import mongoose from "mongoose";
const watchlaterSchema = mongoose.Schema(
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
    watchlateron: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("WatchLater", watchlaterSchema);
