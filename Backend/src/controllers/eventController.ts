import express from "express";
import { v4 as uuid } from "uuid";
import {
  insertEvent,
  getAllEvents,
  upsertSuggestion,
} from "../store/sqliteStore";
import { detectPatterns } from "../services/detector";
import { Event } from "../types";

const events = (req: express.Request, res: express.Response) => {
  const { type, text, metadata } = req.body;
  if (!type || !text)
    return res.status(400).send({ error: "type and text required" });
  const ev: Event = {
    id: uuid(),
    type,
    text,
    timestamp: Date.now(),
    metadata: metadata || {},
  };
  insertEvent(ev);
  const events = getAllEvents();
  const newSuggestions = detectPatterns(events);
  newSuggestions.forEach((s) => upsertSuggestion(s));
  res.status(201).send({
    event: ev,
    newSuggestions: newSuggestions.map((s) => ({
      id: s.id,
      title: s.title,
      confidence: s.confidence,
    })),
  });
};

export default { events };
