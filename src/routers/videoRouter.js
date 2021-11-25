import express from "express"
import {
      watch
     ,getEdit
     ,postEdit
     ,getUpload
     ,postUpload
     ,deleteVideo
} from "../controllers/videoController"

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").post(postUpload).get(getUpload);
videoRouter.route("/:id([0-9a-z]{24})/delete").get(deleteVideo);

export default videoRouter;