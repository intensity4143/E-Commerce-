const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
    },
    heading: {
      type: String,
    },
    subheading: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      default: "#ffffff",
    },
    textColor: {
      type: String,
      default: "#414141",
    },
    cta: {
      label: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
