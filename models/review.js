const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    reviewUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
