import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";



dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

const start=async()=>{

const connectDB= await mongoose.connect("mongodb+srv://pink:8280Misbah@cluster0.xeopvqp.mongodb.net/linkedin?retryWrites=true&w=majority")

    app.listen(9090,()=>{
        console.log("listening");
    })
}

app.use(postRoutes);
app.use(userRoutes);

start();
