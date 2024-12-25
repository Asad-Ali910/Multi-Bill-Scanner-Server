import express from "express";
import RegisterUserController from "../controllers/RegisterUserController.js";

const router = express.Router();

router.post('/Register', RegisterUserController);


export default router;