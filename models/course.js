const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: [String]
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    courseName: {
        type: String,
        required: true
    },
    video: {
        type: [String]
    },
    videoName: {
        type: [String]
    },
    template: {
        type: String
    },
    tags: {
        type: [String]
    },
    // if false we don't send it to the user
    privacy: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', CourseSchema);


// online compiler, web chat app 