const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../controllers/HeroSlideController");
const adminAuth = require("../middleware/adminAuth");

// Public
router.get("/hero-slides", getActiveSlides);

// Admin
router.get("/hero-slides", getAllSlides);
router.post("/hero-slides", adminAuth, upload.single("image"), createSlide);
router.put("/hero-slides/:id", adminAuth, upload.single("image"), updateSlide);
router.delete("/hero-slides/:id", adminAuth, deleteSlide);

module.exports = router;