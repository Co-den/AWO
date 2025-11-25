import express from "express";
import suggestionController from "../controllers/suggestionController";

const router = express.Router();

router.get("/", suggestionController.getSuggestions);

router.get("/:id/preview", suggestionController.getSuggestionPreview);

router.post("/:id/run", suggestionController.runSuggestion);

export default router;
