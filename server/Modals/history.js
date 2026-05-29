import mongoose from "mongoose";
const historySchema = mongoose.Schema(
  {
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videofiles",
      required: true,
    },
    watchedon: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("History", historySchema);
