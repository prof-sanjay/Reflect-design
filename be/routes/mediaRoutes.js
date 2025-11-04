import express from "express";
import { uploadMedia } from "../controllers/mediaController.js";
import multer from "multer";

const router = express.Router();

// Multer config for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route (POST)
router.post("/upload", upload.array("media"), uploadMedia);

export default router;
