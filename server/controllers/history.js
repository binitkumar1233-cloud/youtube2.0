import history from "../Modals/history.js";
import mongoose from "mongoose";

export const handleHistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(200).json({ message: "Invalid ID" });
  }

  try {
    // Add or update history entry
    await history.findOneAndUpdate(
      { viewer: userId, videoid: videoId },
      { watchedon: Date.now() },
      { upsert: true, new: true },
    );
    res.status(200).json({ message: "Added to history" });
  } catch (error) {
    console.error("handleHistory error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const handleview = async (req, res) => {
    const { videoId} = req.params;
    try {
        await video.findByIdAndUpdate(videoId, { $inc: { views: -1 } });
    } catch (error) {
        console.error("handleview error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
export const getallHistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyVideos = await history
      .find({ viewer: userId })
      .populate({ path: "videoid", model: "Videofiles" })
      .sort({ watchedon: -1 })
      .exec();
    return res.status(200).json(historyVideos);
  } catch (error) {
    console.error("getallHistoryVideo error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
