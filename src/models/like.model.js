import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: function() {
            return !this.comment && !this.tweet;
        } // Required if neither comment nor tweet is present
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: function() {
            return !this.video && !this.tweet;
        } // Required if neither video nor tweet is present
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        required: function() {
            return !this.video && !this.comment;
        } // Required if neither video nor comment is present
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);