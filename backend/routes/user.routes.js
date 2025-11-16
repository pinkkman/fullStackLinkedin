import {Router} from "express"
import {activeCheck} from "../controller/post.controller.js";
import {getAllUserProfile, updateProfileData,
    getUserAndProfile, updateUserProfile, login, register, uploadProfilePicture, downloadProfile,
    sendConnectionRequest,getMyConnectionRequest, whatAreMyConnections, acceptConnectionRequest

} from "../controller/user.controller.js";
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
    .post(upload.single("profilePicture"),uploadProfilePicture)

router.route("/register").post(register);
router.route("/login").post(login)
router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/user/search_profile").get(getAllUserProfile)
router.route("/user/downloadProfile").get(downloadProfile);

router.route("/get_my_connection_request").get(getMyConnectionRequest);
router.route("/send_connection_request").post(sendConnectionRequest);
router.route("/what_are_my_connections").get(whatAreMyConnections);
router.route("/accept_connection_request").post(acceptConnectionRequest);


export default router;