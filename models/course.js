const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: [String]
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: [String]
    },
    videoName: {
        type: [String]
    },
    template: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', CourseSchema);


// online compiler, web chat app 