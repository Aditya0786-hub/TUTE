import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { ChangeAvatar,
     ChangeCoverImage,
     getCurrentUser,
     loginUser, 
     logoutUser,
     refreshAccessToken,
     registerUser,
     updateAccountDetails,
     UpdatePassword,
     getUserChannelProfile 
    } from "../Controller/user.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
//secured routes
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)
router.route("/update-password").post(verifyJWT,UpdatePassword)
router.route("/getcurrentuser").get(verifyJWT,getCurrentUser)
router.route("/update-account").post(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,ChangeAvatar)
router.route("/cover-image").patch(verifyJWT,ChangeCoverImage)
//get user channel profile
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)//:username means it is variable 




export default router