import mongoose,{Schema} from "mongoose";

 const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
        },

    }
 )


 //prevent duplicate likes and if one field is null,it does not show error
likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, sparse: true });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, sparse: true });

 export const Like = mongoose.model("Like",likeSchema)