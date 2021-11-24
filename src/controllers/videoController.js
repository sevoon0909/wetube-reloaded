import Video from "../models/Video";

const fakeUser = {
    username: "Lee",
    loggedIn: false
}


export const home = async (req, res) => {
    const videos = await Video.find({});
    res.render("home", {
        pageTitle: "Home",
        videos: videos
    });
};
export const watch = (req, res) => {
    const {id} = req.params;
    return res.render("watch", {pageTitle: `Watching`});
};
export const getEdit = (req, res) => {
    const {id} = req.params;
    return res.render("edit", {pageTitle: `Editing`});
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};
export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    const dbVideo = await Video.create({
        title,
        description,
        createAt:Date.now(),
        hashtags:hashtags.split(",").map((word) => `#${word}`),
        meta:{
            views:0,
            ratring:0,
        },
    });

    console.log(dbVideo);
    return res.redirect("/");
};