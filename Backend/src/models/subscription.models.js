import mongoose,{Schema} from "mongoose";
import { User } from "./user.models.js";

const SubscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    channel:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})


export const Subscription = mongoose.model("subscription", SubscriptionSchema)