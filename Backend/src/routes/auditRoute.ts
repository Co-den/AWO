import express from "express";
import auditController from "../controllers/auditController";

const router = express.Router();

router.get("/getaudits", auditController.audits);

export default router;