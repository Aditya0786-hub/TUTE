import { Router } from "express";
import { getLikes, toggleLike } from "../Controller/like.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggleLike").post(toggleLike)
router.route("/getVideoLikes/:videoId").get(getLikes)

export default router