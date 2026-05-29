import express from "express";
import { handleWatchLater, getallWatchLaterVideo } from "../controllers/watchlater.js";

const routes = express.Router();
routes.get("/:userId", getallWatchLaterVideo);
routes.post("/:videoId", handleWatchLater);

export default routes;