
const Test = require('../models/test');

// const TestSchema = new mongoose.Schema({
//     courseName: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     template: {
//         type: String,
//         required: true
//     },
//     security: {
//         type: Boolean,
//         default: false
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     tags: {
//         type: [String]
//     }
// }, {
//     timestamps: true
// })

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

module.exports = {
    createTestCourse
}