const Video = require('../models/video');
const Test = require('../models/test');
const createVideo = async (req,res) => {
    try {
        const courseId = req.params.id;
        // search if course exists 
        const isCourse = await Test.findById({_id: courseId});

        if (!isCourse) {
            return res
                    .status(404)
                    .json({
                        message: "Course Not Found!!"
                    })
        }

        let nameArr = [];
        let pathArr = [];

        req.files.forEach((item) => {
            nameArr.push(item.filename);
            pathArr.push(item.path);
        })

        if (nameArr.length !== isCourse.title.length) {
            return res
                    .status(403)
                    .json({
                        message: "The length of title and videos don't match"
                    })
        }

        const createVideos = new Video({
            courseId: courseId,
            videoName: nameArr,
            videoPath: pathArr
        })

        await createVideos.save()

        return res 
                .status(201)
                .json(createVideos);
    } catch (err) {
        console.log(err);
        return res 
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        return res
                .status(200)
                .json(videos);
    } catch (err){
        console.log(err);
    }
}

const deleteVideo = async (req, res) => {
    try {
        const courseId = req.params.id;
        const isCourse = await Test.findById({_id: courseId});
        if (req.user.id !== isCourse.author) {
            return res
                    .status(400)
                    .json({
                        message: "You are not the owner of the course"
                    })
        }
        const videoIndex = req.body.idx;
        
    } catch (err) {

    }
}
module.exports = {
    createVideo,
    getAllVideos
}