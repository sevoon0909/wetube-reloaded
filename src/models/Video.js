import mongoose from "mongoose"

// title,description,createAt,hashtags[],meta{}

const videoSchema = new mongoose.Schema({
    title:String,
    description:String,
    createAt:Date,
    hashtags:[{type:String}],
    meta:{
        views:Number,
        rating:Number,
    },
});

const Video = mongoose.model("Video",videoSchema);
export default Video;

