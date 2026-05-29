import express from "express";
import { handleDislike, getallDislikeVideo } from "../controllers/dislike.js";

const routes = express.Router();
routes.get("/:userId", getallDislikeVideo);
routes.post("/:videoId", handleDislike);

export default routes;
