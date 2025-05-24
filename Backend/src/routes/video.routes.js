import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { getAllVideos, getVideosbyId, publishVideo } from "../Controller/video.controller.js";


console.log("router there")
const router = Router()
router.use(verifyJWT)
// Apply verifyJWT middleware to all routes in this file

router.get("/health", (req, res) => {
    console.log("router is wroking")
  res.json({ message: "video router is working" });
  
});

router.route("/publishvideo").post(
    upload.fields([
        {
            name:"videoFile",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
        
    ]),
    publishVideo
)
router.route("/getallvideos").get(getAllVideos)
router.route("/:videoId").get(getVideosbyId)

export default router