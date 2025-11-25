import express from "express";
import { SUGGESTIONS } from "../store/memoryStore";
import { simulateExecution } from "../services/executor";
import {
  getAllSuggestions,
  getSuggestionById,
  insertAudit,
} from "../store/sqliteStore";

const getSuggestions = (req: express.Request, res: express.Response) =>
  res.send(getAllSuggestions());

const getSuggestionPreview = (req: express.Request, res: express.Response) => {
  const s = getSuggestionById(req.params.id);
  if (!s) return res.status(404).send({ error: "not found" });
  res.send({
    id: s.id,
    title: s.title,
    confidence: s.confidence,
    preview: s.preview,
    steps: s.steps,
  });
};

const runSuggestion = (req: express.Request, res: express.Response) => {
  const s = getSuggestionById(req.params.id);
  if (!s) return res.status(404).send({ error: "not found" });
  const edits = req.body.edits || {};
  const consent = !!req.body.consent;
  const report = simulateExecution(s, edits);
  // persist audit
  insertAudit(s.id, consent, report);
  res.send({ suggestionId: s.id, consent, simulated: true, report });
};

export default {
  getSuggestions,
  getSuggestionPreview,
  runSuggestion,
};
