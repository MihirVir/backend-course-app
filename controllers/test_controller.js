
const Test = require('../models/test');
const Video = require('../models/video');

const createTestCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        const title = req.body.title.split(',');
        const tags = req.body.tags.split(',');
        const {
            courseName,
            price,
            security,
        } = req.body;
        const template = req.file.filename;

        const newCourse = await Test({
            courseName,
            price,
            security,
            tags,
            title,
            template,
            author: userId,
        });

        await newCourse.save();

        return res
                .status(201)
                .json(newCourse);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const deleteTestCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const isCourse = await Test.findOneAndDelete({_id: courseId, $match: { author: userId }})

        const deleteVideos = await Video.deleteMany({courseId: courseId});
        return res
                .status(200)
                .json(successObj = {isCourse, deleteVideos,message: "Successfully deleted the course"})
    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

module.exports = {
    createTestCourse,
    deleteTestCourse
}