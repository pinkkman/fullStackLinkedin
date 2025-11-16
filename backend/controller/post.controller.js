import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import Profile from "../model/profile.model.js";
import Post from "../model/post.model.js";
import Comment from "../model/comments.model.js";

export const activeCheck =async (req,res)=>{
   return res.status(200).json({message:"Running"})
}


export const createPost= async(req,res)=>{
   try{
      const {token}= req.body;
      const user=await User.findOne({token});
if(!user){
   res.status(400).json({message:"user not found"});
}
const post= new Post({
   userId:user._id,
body:req.body.body,
   media:req.file !=undefined ? req.file.filename : " ",
   fileType:req.file !=undefined ?  req.file.mimetype.split("/") : " "
})
await post.save();
return res.status(200).json({message:"post created"});

   } catch(err){
      res.status(500).json({message:err.message})
   }
}



export const getAllPosts= async(req,res)=>{
   try{
      const post=await Post.find().populate('userId','name email username profilePhoto');
      res.status(200).json({post});

   }catch(err){
      res.status(500).json({message:err.message})
   }
}


export const deletePost=async(req,res)=>{
   try{
      const {token,post_id}=req.body;

      const user=await User
          .findOne({token:token})
          .select("_id");

      if(!user){
         res.status(404).json({message:"user not found"});
      }

      const post=await Post.findOne({_id:post_id});
      if(!post){
         res.status(400).json({message:"post not found"});
      }

      if(post.userId.toString() !== user._id.toString()){
         res.status(400).json({message:"Unauthorized"})
      }
await Post.deleteOne({_id:post_id});
      res.status(200).json({message:"post deleted"});

   }catch(err){
      res.status(500).json({message:err.message})
   }
}


export const postComment= async(req,res)=>{
   try{
      const{token,post_id,commentBody}=req.body;

      const user=await User.findOne({token:token}).select("_id")
      if(!user){
          return res.status(400).json({message:"user not found"});
      }

      const post = await Post.findOne({_id:post_id});

      if(!post) res.status(404).json({message:"post not found"});

      const comment=new Comment({
         userId:user._id,
         postId:post_id,
         comment:commentBody
      });
await comment.save();
      res.status(200).json({message:"comment sent"})
   }catch(err){
      res.status(500).json({message:err.message})
   }
}



export const getCommentByPost= async(req,res)=>{
   const {post_id}=req.body;
   try{
const post = await Post.findOne({_id:post_id});
if(!post){
   return res.status(400).json({message:'Post not found'})
}
res.status(200).json({comments:post.comments})

   }catch (err){
      res.status(500).json({message:err.message});
   }
}



export const delete_comment=async(req,res)=>{
   const {token,comment_id}=req.body;
   try{
const user=await User.findOne({token:token}).select('_id');
if(!user){
   res.status(400).send({message:"user do not exists"})
}

const comment=await Comment.findOne({_id:comment_id});

if(!comment){
   res.status(400).json({message:"comment do not exists"})
}

if(comment.userId.toString()!== user._id.toString()){
   res.status(400).json({message:'unAuthorized'})
}
Comment.deleteOne({_id:comment_id});
res.status(200).json({message:"comment deleted"})

   }catch(err){
      res.status(500).send({message:err.message})
   }
}


export const implement_likes=async(req,res)=>{
   const {post_id}=req.body;
   try{
      const post=await Post.findOne({_id:post_id});
      if(!post){
         res.status(400).json({message:"post not found"});
      }

      post.likes=post.likes+1;
      await Post.save();
return res.status(200).json({message:"liked"})
   }catch (err){
      res.status(500).json({message:err.message});
   }
}