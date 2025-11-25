// src/store/sqliteStore.ts
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { Event, Suggestion, Feedback } from "../types";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const DB_PATH = process.env.AWO_DB_PATH || path.join(process.cwd(), "awo.db");
const exists = fs.existsSync(DB_PATH);
const db = new Database(DB_PATH);

if (!exists) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      text TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      metadata TEXT
    );
    CREATE TABLE suggestions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      confidence REAL NOT NULL,
      preview TEXT,
      steps TEXT,
      sourceEventIds TEXT,
      createdAt INTEGER NOT NULL
    );
    CREATE TABLE feedbacks (
      id TEXT PRIMARY KEY,
      suggestionId TEXT NOT NULL,
      accepted INTEGER NOT NULL,
      notes TEXT,
      timestamp INTEGER NOT NULL
    );
    CREATE TABLE audits (
      id TEXT PRIMARY KEY,
      suggestionId TEXT NOT NULL,
      consent INTEGER NOT NULL,
      report TEXT,
      timestamp INTEGER NOT NULL
    );
  `);
}

// Events
export function insertEvent(e: Event) {
  const stmt = db.prepare(
    `INSERT INTO events (id,type,text,timestamp,metadata) VALUES (@id,@type,@text,@timestamp,@metadata)`
  );
  stmt.run({
    id: e.id,
    type: e.type,
    text: e.text,
    timestamp: e.timestamp,
    metadata: JSON.stringify(e.metadata || {}),
  });
}

export function getAllEvents(): Event[] {
  const rows: any[] = db
    .prepare(`SELECT * FROM events ORDER BY timestamp ASC`)
    .all() as any[];
  return rows.map((r: any) => ({
    id: r.id,
    type: r.type,
    text: r.text,
    timestamp: r.timestamp,
    metadata: JSON.parse(r.metadata || "{}"),
  }));
}

// Suggestions
export function upsertSuggestion(s: Suggestion) {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO suggestions (id,title,confidence,preview,steps,sourceEventIds,createdAt) VALUES (@id,@title,@confidence,@preview,@steps,@sourceEventIds,@createdAt)`
  );
  stmt.run({
    id: s.id,
    title: s.title,
    confidence: s.confidence,
    preview: s.preview,
    steps: JSON.stringify(s.steps),
    sourceEventIds: JSON.stringify(s.sourceEventIds),
    createdAt: s.createdAt,
  });
}

export function getAllSuggestions(): Suggestion[] {
  const rows: any[] = db
    .prepare(`SELECT * FROM suggestions ORDER BY createdAt DESC`)
    .all() as any[];
  return rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    confidence: r.confidence,
    preview: r.preview,
    steps: JSON.parse(r.steps || "[]"),
    sourceEventIds: JSON.parse(r.sourceEventIds || "[]"),
    createdAt: r.createdAt,
  }));
}

export function getSuggestionById(id: string): Suggestion | null {
  const r: any = db
    .prepare(`SELECT * FROM suggestions WHERE id = ?`)
    .get(id) as any;
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    confidence: r.confidence,
    preview: r.preview,
    steps: JSON.parse(r.steps || "[]"),
    sourceEventIds: JSON.parse(r.sourceEventIds || "[]"),
    createdAt: r.createdAt,
  };
}

// Feedback
export function insertFeedback(f: Feedback) {
  const stmt = db.prepare(
    `INSERT INTO feedbacks (id,suggestionId,accepted,notes,timestamp) VALUES (@id,@suggestionId,@accepted,@notes,@timestamp)`
  );
  stmt.run({
    id: f.id,
    suggestionId: f.suggestionId,
    accepted: f.accepted ? 1 : 0,
    notes: f.notes || "",
    timestamp: f.timestamp,
  });
}

// Audit
export function insertAudit(
  suggestionId: string,
  consent: boolean,
  report: any
) {
  const stmt = db.prepare(
    `INSERT INTO audits (id,suggestionId,consent,report,timestamp) VALUES (@id,@suggestionId,@consent,@report,@timestamp)`
  );
  stmt.run({
    id: uuid(),
    suggestionId,
    consent: consent ? 1 : 0,
    report: JSON.stringify(report),
    timestamp: Date.now(),
  });
}

export function getAudits(): any[] {
  const rows: any[] = db
    .prepare(`SELECT * FROM audits ORDER BY timestamp DESC`)
    .all() as any[];
  return rows.map((r: any) => ({ ...r, report: JSON.parse(r.report || "{}") }));
}
