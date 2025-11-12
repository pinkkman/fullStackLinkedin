import mongoose from "mongoose";
import connectionModel from "./connection.model.js";
import Post from "./post.model.js";

const commentSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    postId:{
type:mongoose.Schema.Types.ObjectId,
        ref:Post
    },
    body:{
type:String,
        required:true
    }
})

const Comment=mongoose.model("Comment",commentSchema);

export default Comment;