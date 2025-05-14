import { Router } from "express";
import { getchannelSubscriber, toggleSubscription } from "../Controller/subscription.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()

router.route("/channel/:username").post(verifyJWT,toggleSubscription)
router.route("/getchannelsubscribers").get(verifyJWT,getchannelSubscriber)

export default router