import mongoose from "mongoose";


const schema=mongoose.Schema;

const postSchema=schema({
    userId:{
type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
type:String,
        required:true
    },
    likes:{
type:Number
    },
    createdAt:{
type:Date
    },
    updatedAt:{
        type:Date,
default:Date.now
    },
    media:{
      type:String,
      default:''
    },
    active:{
type:Boolean,
        default:true
    },
    filetype:{

    }

});

const Post=mongoose.model("Post",postSchema);

export default Post;