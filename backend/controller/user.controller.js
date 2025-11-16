import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import connectionRequest from "../model/connection.model.js";
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import PDFDocument from "pdfkit";
import * as fs from "node:fs";
import ConnectionRequest from "../model/connection.model.js";


const convertUserDataToPDF=(userData)=>{
const doc =new PDFDocument();
    const outputPath=crypto.randomBytes(32).toString("hex")+ ".pdf";
const stream=fs.createWriteStream("uploads/" + outputPath);
doc.pipe(stream);

doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100});
doc.fontSize(14).text(`Name: ${userData.userId.name}`);
doc.fontSize(14).text(`E-mail : ${userData.userId.email}`)
    doc.fontSize(14).text(`Username : ${userData.userId.username}`)
    doc.fontSize(14).text(`Bio : ${userData.bio}`)
    doc.fontSize(14).text(`Current Position : ${userData.currentPost}`)
doc.fontSize(14).text("Past work : ")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name : ${work.company}`)
        doc.fontSize(14).text(`Position : ${work.position}`)
        doc.fontSize(14).text(`Years : ${work.years}`)
    })
doc.end();
return outputPath;
}




export const register=async (req,res)=>{

    try{
        const{name,email,password,username}=req.body;

        if(!name || !email || !password || !username)
            return res.status(400).json({message:"All feilds are required"});

        const user =await User.findOne({
            email
        })
        if(user)return res.status(400).json({message:"User already exists"});
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            username
        });
        await newUser.save();

        const newProfile =Profile({
            userId:newUser._id
        })
        newProfile.save();
    }
    catch (err){
        return res.status(500).json({message: err.message})
    }
}



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid Credentials" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { token });

        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};



export const uploadProfilePicture= async (req,res)=>{
    const {token} = req.body;
    try{
        const user= await User.findOne({token:token})
if(!user){
    return res.status(400).json({message:"user not found"})
}

user.profilePicture=req.file.filename;
await user.save();
return res.json({message:"profile picture updated"});

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}



export const updateUserProfile=async(req,res)=>{
    try{
        const {token,...newUserData}=req.body;
        const user=await User.findOne({token});

        if(!user) return res.status(400).json({message:"User do not exists"});

        const {username,email}=newUserData;
       const existingUser=await User.findOne({$or: [{username},{email}]})

        if(existingUser){
            if(existingUser  || String(existingUser._id)!==String(user._id) ){
                return res.status(400).json({message:"user already exists"});
            }
        }
        Object.assign(user,newUserData)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}



export const getUserAndProfile = async(req,res)=>{

    try{
        const {token}=req.body;
        const user=await User.findOne({token})
if(!user) return res.status(400).json({message:"user donot exist"});

const userProfile= await Profile.findOne({userId:user._id})
    .populate('userId','name email username profilePicture');

return res.json(userProfile);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}



export const updateProfileData = async(req,res)=>{

    try{
        const {token , ...newProfileData}= req.body;

        const userProfile=await User.findOne({token:token});
if(!userProfile) return res.status(400).json({message:"user do not exist"});

const profile_to_update=await Profile.findOne({userId : userProfile._id})

Object.assign(profile_to_update , newProfileData);
await profile_to_update.save();
res.status(200).json({message:"updated profile"})

    }catch(err){
        res.status(500).json({message:err.message})
    }
}

export const  getAllUserProfile= async(req,res)=>{
    try {

        const allProfile= await Profile.find().populate('userId','name profilePicture email username')
res.status(200).json({allProfile})

    }
        catch(err){
            res.status(500).json({message:err.message})
        }
}



export const  downloadProfile= async(req,res)=>{
    try {
const user_id=req.query.id;
        const userProfile= await Profile.findOne({userId:user_id}).populate('userId','name username email profilePicture')

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let outputPath=await convertUserDataToPDF(userProfile);
        res.json({message: outputPath})

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}




export const  sendConnectionRequest= async(req,res)=>{
    const {token,connectionId}=req.body;

    try {
    const user=await User.findOne({token});

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

const connectionUser = User.findOne({_id:connectionId});

        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }

//bhejne wala and recieve krne wala dono chye

const existingRequest = connectionRequest.findOne({
    userId:user._id,
    connectionId : connectionUser._id
})
        if(existingRequest){
            res.status(404).json({message:"connection already sent"});
        }
   const request = new connectionRequest({
            userId:user._id,
                connectionId : connectionUser._id
        })

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}



export const getMyConnectionRequest = async(req,res)=>{
    const {token}= req.body;
    try{
        const user=User.findOne({token})
        if(!user){
            res.status(404).json({message:"user do not exists"});
        }
const connections= await ConnectionRequest.find({userId:user._id})
    .populate('connectionId','name profilePicture email username')
return res.json({connections});

    } catch(err){
        res.status(500).json({message:err.message});
    }
}



export const whatAreMyConnections = async(req,res)=>{
    const {token}= req.body;
    try{
        const user=User.findOne({token})
        if(!user){
            res.status(404).json({message:"user do not exists"});
        }
     const connections = ConnectionRequest.find({connectionId:user._id})
         .populate('userId','name profilePicture email username')

res.json({connections});
    } catch(err){
        res.status(500).json({message:err.message});
    }
}





export const acceptConnectionRequest = async(req,res)=>{
    const {token,requestId,action_type}= req.body;
    try{
        const user=User.findOne({token})
        if(!user){
            res.status(404).json({message:"user do not exists"});
        }
const connection =await ConnectionRequest.findOne({_id:requestId});
        if(!connection){
            res.status(404).json({message:"connection not found"});
        }
if(action_type==="accept"){
    connection.status_accepted=true;
}else{
connection.status_accepted=false;
}

await connection.save();
res.json({message:"Request updated"})

    } catch(err){
        res.status(500).json({message:err.message});
    }
}