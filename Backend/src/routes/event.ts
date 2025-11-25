import express from "express";
import eventController from "../controllers/eventController";

const router = express.Router();

router.post("/", eventController.events);

export default router;
