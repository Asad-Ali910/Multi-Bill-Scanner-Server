import express from "express"
import otpVerificationController from "./../controllers/otpVerificationController.js"

const router = express.Router();

router.post('/otpVerification', otpVerificationController);

export default router;