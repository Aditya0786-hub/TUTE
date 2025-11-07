import { Router } from "express";
import { getchannelSubscriber, getUserSubscribedChannel, toggleSubscription } from "../Controller/subscription.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";


const router = Router()

router.route("/channel/:username").post(verifyJWT,toggleSubscription)
router.route("/getchannelsubscribers").get(verifyJWT,getchannelSubscriber)
router.route("/getusersubscribedchannel").get(verifyJWT,getUserSubscribedChannel)

export default router