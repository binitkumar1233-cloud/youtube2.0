import express from "express";
import { getallHistoryVideo, handleview, handleHistory } from "../controllers/history.js";

const routes = express.Router();
routes.get("/:userId", getallHistoryVideo);
routes.post("/:videoId", handleHistory);
routes.post("/view/:videoId", handleview);

export default routes;