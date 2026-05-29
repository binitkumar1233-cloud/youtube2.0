import video from "../Modals/video.js";
import dislike from "../Modals/dislike.js";
import like from "../Modals/like.js";
import mongoose from "mongoose";

export const handleDislike = async (req, res) => {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(200).json({ disliked: false, message: "Action simulated for invalid ID" });
    }

    try {
        // Also remove a like if the user previously liked the video
        const existingLike = await like.findOne({ viewer: userId, videoid: videoId });
        if (existingLike) {
            await like.findByIdAndDelete(existingLike._id);
            await video.findByIdAndUpdate(videoId, { $inc: { Like: -1 } });
        }

        const existingDislike = await dislike.findOne({
            viewer: userId,
            videoid: videoId,
        });

        if (existingDislike) {
            await dislike.findByIdAndDelete(existingDislike._id); 
            await video.findByIdAndUpdate(videoId, { $inc: { dislike: -1 } });
            return res.status(200).json({ disliked: false });
        } else {
            await dislike.create({ viewer: userId, videoid: videoId });
            await video.findByIdAndUpdate(videoId, { $inc: { dislike: 1 } });
            return res.status(200).json({ disliked: true });
        }
    } catch (error) {
        console.error("handleDislike error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const getallDislikeVideo = async (req, res) => {
    const { userId } = req.params;
    try {
        const dislikedVideos = await dislike.find({ viewer: userId }).populate({ path: "videoid", model: "Videofiles" })
        .exec();
        return res.status(200).json(dislikedVideos);
    } catch (error) {
        console.error("Dislike fetch error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
