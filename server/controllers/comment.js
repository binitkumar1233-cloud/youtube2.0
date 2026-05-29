import mongoose from 'mongoose';
import Comment from '../Modals/comment.js';
import { getIo } from '../socket.js';

export const postComment = async (req, res) => {
    const commentData = req.body;
    const newComment = new Comment(commentData);
    try {
        await newComment.save();
        // Emit the new comment to the video room (if Socket.IO initialized)
        try {
            const io = getIo();
            if (io && newComment.videoId) {
                io.to(String(newComment.videoId)).emit('comment:new', newComment);
            }
        } catch (emitErr) {
            console.warn('Failed to emit socket comment:new', emitErr?.message || emitErr);
        }

        return res.status(201).json(newComment);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getallcomment = async (req, res) => {
    const { videoId } = req.params;
    try {
        const commentvideo = await Comment.find({ videoId: videoId });
        return res.status(200).json(commentvideo);
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

export const deletecomment = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('comment unavailable');
    }
    try {
        await Comment.findByIdAndDelete(_id);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

