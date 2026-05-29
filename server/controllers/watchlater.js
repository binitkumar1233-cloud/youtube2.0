
import watchlater from "../Modals/watchlater.js";
import mongoose from "mongoose";

export const handleWatchLater = async (req, res) => {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        // Return 200 OK gracefully for mock/invalid users so the frontend doesn't crash with AxiosError
        return res.status(200).json({ liked: false, message: "Action simulated for invalid ID" });
    }

    try {
        // Remove a dislike if the user previously disliked the video
        const existingDislike = await dislike.findOne({ viewer: userId, videoid: videoId });
        if (existingDislike) {
            await dislike.findByIdAndDelete(existingDislike._id);
            await video.findByIdAndUpdate(videoId, { $inc: { dislike: -1 } });
        }

        const existingWatchLater = await watchlater.findOne({
            viewer: userId,
            videoid: videoId,
        });
        if (existingWatchLater) {
            await watchlater.findByIdAndDelete(existingWatchLater._id);
            await video.findByIdAndUpdate(videoId, { $inc: { watchlater: -1 } });
            return res.status(200).json({ watchlater: false });
        } else {
            await watchlater.create({ viewer: userId, videoid: videoId });
            await video.findByIdAndUpdate(videoId, { $inc: { watchlater: 1 } });
            return res.status(200).json({ watchlater: true });
        }
    } catch (error) {
        console.error("handleWatchLater error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const getallWatchLaterVideo = async (req, res) => {
    const { userId } = req.params;
    try {
        const watchLaterVideos = await watchlater.find({ viewer: userId }).populate({ path: "videoid", model: "Videofiles" })
        .exec();
        return res.status(200).json(watchLaterVideos);
    } catch (error) {
        console.error("getallWatchLaterVideo error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
