import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { generateQuiz, summarize } from "../controllers/ai.controller.js";
const router = express.Router();
router.post("/quiz", protect, generateQuiz);
router.post("/summarize", protect, summarize);
export default router;
