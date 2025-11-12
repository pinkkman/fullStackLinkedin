import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import PDFDocument from "pdfkit";


const convertUserDataToPDF=(userData)=>{

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
return res.json({message:"profile picture updated"})

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const updateUserProfile=async()=>{
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
    .populate('userId','name,email,username,profilePicture');

return res.json(userProfile)
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const updateProfileData = async(req,res)=>{

    try{
        const {token , ...newProfileData}= req.body;

        const user=await User.findOne({token:token});
if(!userProfile) return res.status(400).json({message:"user donot exist"});

const profile_to_update=await Profile.findOne({userId : userProfile._id})

Object.assign(profile_to_update , newProfileData)
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
        const userProfile= await Profile.find().populate('userId','name profilePicture email username')

        let a=await convertUserDataToPDF(userProfile);
        res.json({message: a})

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}