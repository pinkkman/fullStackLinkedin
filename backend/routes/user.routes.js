import {Router} from "express"
import {activeCheck} from "../controller/post.controller.js";
import { getAllUserProfile, updateProfileData, getUserAndProfile,updateUserProfile, login,register,uploadProfilePicture} from "../controller/user.controller.js";
import multer from "multer"


const router=Router();

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }

})

const upload=multer({storage:storage});

router.route("/upload_profile_picture")
    .post(upload.single("profile_picture"),uploadProfilePicture)

router.route("/register").post(register);
router.route("/login").post(login)
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/search_profile").get(getAllUserProfile)


export default router;