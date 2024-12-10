import express from "express"
import DecodeImage from "../controllers/DecodeController.js";

const router = express.Router();

router.post("/DecodeImage", DecodeImage);

export default router;
