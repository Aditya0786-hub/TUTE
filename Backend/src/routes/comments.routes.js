import { addComment, deleteComment, getAllComments } from "../Controller/comments.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").post(addComment).get(getAllComments)
router.route("/:commentId").delete(deleteComment)

export default router
