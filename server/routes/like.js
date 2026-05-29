import express from "express";
import { handleLike, getallLikeVideo } from "../controllers/like.js";

const routes = express.Router();
routes.get("/:userId", getallLikeVideo);
routes.post("/:videoId", handleLike);

export default routes;