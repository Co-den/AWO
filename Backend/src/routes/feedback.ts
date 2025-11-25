import express from "express";
import feedbackController from "../controllers/feedbackController";

const router = express.Router();

router.post("/", feedbackController.feedback);
export default router;
