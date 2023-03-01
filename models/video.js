const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    },
    videoName: {
        type: [String],
        required: true
    },
    videoPath: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Video", VideoSchema);