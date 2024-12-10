import express from "express"
import ExtractBillInfo from "../controllers/ExtractBillInfoController.js";

const router = express.Router();

router.post("/ExtractBillInfo", ExtractBillInfo);

export default router;
