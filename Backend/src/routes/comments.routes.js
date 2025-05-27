import { addComment } from "../Controller/comments.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").post(addComment)

export default router
