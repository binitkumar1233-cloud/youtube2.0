import videoFiles from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = new videoFiles({
            videotitle: req.body.videotitle,
            filename: req.file.originalname,
            filetype: req.file.mimetype,
            filepath: req.file.path,
            filesize: req.file.size.toString(),
            videochanel: req.body.videochannel,
            uploader: req.body.uploader,
        });

        await file.save();
        res.status(200).json({ message: "Video uploaded successfully", filepath: req.file.path, file });
    } catch (error) {
        console.error("Error uploading video", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getallvideo = async (req, res) => {
    try {
        const files = await videoFiles.find();
        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching videos", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
