import mongoose from "mongoose";
const commentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videofiles",
      required: true,
    },
    commentbody: { type: String, required: true },
    usercommented: { type: String, required: true },
    commentedon: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Comment", commentSchema);
