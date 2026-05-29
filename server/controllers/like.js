import video from "../Modals/video.js";
import like from "../Modals/like.js";
import dislike from "../Modals/dislike.js";
import mongoose from "mongoose";

export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    // Return 200 OK gracefully for mock/invalid users so the frontend doesn't crash with AxiosError
    return res
      .status(200)
      .json({ liked: false, message: "Action simulated for invalid ID" });
  }

  try {
    // Remove a dislike if the user previously disliked the video
    const existingDislike = await dislike.findOne({
      viewer: userId,
      videoid: videoId,
    });
    if (existingDislike) {
      await dislike.findByIdAndDelete(existingDislike._id);
      await video.findByIdAndUpdate(videoId, { $inc: { dislike: -1 } });
    }

    const existingLike = await like.findOne({
      viewer: userId,
      videoid: videoId,
    });
    if (existingLike) {
      await like.findByIdAndDelete(existingLike._id);
      await video.findByIdAndUpdate(videoId, { $inc: { Like: -1 } });
      return res.status(200).json({ liked: false });
    } else {
      await like.create({ viewer: userId, videoid: videoId });
      await video.findByIdAndUpdate(videoId, { $inc: { Like: 1 } });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error("handleLike error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getallLikeVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const likedVideos = await like
      .find({ viewer: userId })
      .populate({ path: "videoid", model: "Videofiles" })
      .exec();
    return res.status(200).json(likedVideos);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
