import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeImage, auditGarment } from "../controllers/aiController.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/analyze", upload.single("image"), analyzeImage);
router.post("/audit", upload.single("image"), auditGarment);

export default router;
