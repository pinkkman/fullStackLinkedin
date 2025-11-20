import {Router} from "express";
import {
    activeCheck,
    createPost, delete_comment,
    deletePost,
    getAllPosts,
    getCommentByPost, implement_likes,
    postComment
} from "../controller/post.controller.js"
import multer from "multer";
import { getAllUserProfile} from "../controller/user.controller.js";


const router =Router();

router.route("/").get(activeCheck);

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
const upload=multer({storage:storage});


router.route("/post").post(upload.single('media'),createPost);
router.route("/get_all_posts").get(getAllPosts)
router.route("/delete_post").post(deletePost);
router.route("/post_comment").post(postComment);
router.route("/get_comment)").post(getCommentByPost);
router.route("/delete_comment").delete(delete_comment);
router.route("/implement_likes").post(implement_likes);



export default router;