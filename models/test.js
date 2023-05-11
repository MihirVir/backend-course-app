const mongoose = require("mongoose");
const TestSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    security: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
    },
    title: {
      type: [String],
      required: true,
    },
    coupon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Test", TestSchema);
