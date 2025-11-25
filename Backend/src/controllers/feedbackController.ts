import express from "express";
import { v4 as uuid } from "uuid";
import { FEEDBACKS } from "../store/memoryStore";
import { Feedback } from "../types";
import { insertFeedback } from "../store/sqliteStore";

const feedback = (req: express.Request, res: express.Response) => {
  const { suggestionId, accepted, notes } = req.body;
  if (!suggestionId || typeof accepted !== "boolean")
    return res
      .status(400)
      .send({ error: "suggestionId and accepted required" });
  const fb: Feedback = {
    id: uuid(),
    suggestionId,
    accepted,
    notes,
    timestamp: Date.now(),
  };
  insertFeedback(fb);
  res.status(201).send({ ok: true, feedback: fb });
};

export default { feedback };
