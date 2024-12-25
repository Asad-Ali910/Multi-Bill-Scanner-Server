import express from "express";
import ExtractBillInfo from "../controllers/ExtractBillInfoController.js";
import checkAuthorization from "../middleware/checkAuthorization.js";

const router = express.Router();

router.post("/ExtractBillInfo", ExtractBillInfo, checkAuthorization);

export default router;
