import express from "express"
import { ValidateAccessToken } from "../controllers/TokenValidater.js";
import { ValidateRefreshToken } from "../controllers/TokenValidater.js";

const router = express.Router()

router.post('/ValidateAccessToken', ValidateAccessToken)
router.post('/ValidateRefreshToken', ValidateRefreshToken)

export default router;