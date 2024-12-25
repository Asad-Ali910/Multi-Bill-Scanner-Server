import express, { Router } from "express"
import LoginUserController from "../controllers/LoginUserController.js";

const router = express.Router();

router.post('/Login', LoginUserController)

export default router;