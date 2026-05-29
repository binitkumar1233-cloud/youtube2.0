import express from 'express';
import { postComment, getallcomment, deletecomment } from '../controllers/comment.js';

const router = express.Router();

router.post('/', postComment);
router.get('/:videoId', getallcomment);
router.delete('/:id', deletecomment);

export default router;
