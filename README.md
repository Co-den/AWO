# Adaptive Workflow Orchestrator (AWO)

## Feature Description
**Adaptive Workflow Orchestrator (AWO)** detects patterns in meeting notes and automatically generates workflow suggestions.  
- **Problem it solves:** Teams often leave meetings with decisions and action items but fail to follow through consistently. Manual tracking is error‑prone and time‑consuming.  
- **Solution:** AWO listens to meeting events, identifies when decisions and tasks are mentioned, and proposes structured workflows (e.g., “Post‑meeting follow‑up workflow”). It provides previews, simulated execution, and collects feedback to improve future suggestions.  

---

## Concrete Use Case
Sofia, a project manager using **Pulse**, records her meeting notes:  
- *“Decision: adopt the new project management tool. Action: assign tasks to the team.”*  
- *“We decided to move forward with the marketing campaign. Follow up: create tasks and assign owners.”*  

Pulse detects these patterns and automatically suggests:  
> **Suggestion:** *“Post‑meeting follow‑up workflow”*  
> Confidence: 0.9  
> Steps: Create tasks, assign owners, schedule follow‑up.  

Sofia clicks **Preview** to see the workflow, then **Run** to simulate execution. An audit log is created, and she gives feedback (👍 or 👎) to refine future suggestions.  

---

## Technical MVP (TypeScript)

### Backend (minimal API with Express + SQLite)
```ts
// src/index.ts
import express from "express";
import bodyParser from "body-parser";
import { insertEvent, getAllSuggestions, getSuggestionById, insertFeedback, insertAudit } from "./store/sqliteStore";
import { detectSuggestions } from "./services/detector";

const app = express();
app.use(bodyParser.json());

// Add event
app.post("/api/v1/events", (req, res) => {
  const event = { id: Date.now().toString(), ...req.body, timestamp: Date.now() };
  insertEvent(event);
  const suggestions = detectSuggestions();
  suggestions.forEach(s => insertAudit(s.id, true, { preview: s }));
  res.json({ status: "ok", newSuggestions: suggestions });
});

// List suggestions
app.get("/api/v1/suggestions", (req, res) => {
  res.json(getAllSuggestions());
});

// Preview suggestion
app.get("/api/v1/suggestions/:id/preview", (req, res) => {
  const suggestion = getSuggestionById(req.params.id);
  if (!suggestion) return res.status(404).send("Not found");
  res.json(suggestion);
});

// Run suggestion (simulated)
app.post("/api/v1/suggestions/:id/run", (req, res) => {
  const suggestion = getSuggestionById(req.params.id);
  if (!suggestion) return res.status(404).send("Not found");
  insertAudit(suggestion.id, req.body.consent, { executed: true });
  res.json({ status: "executed", suggestion });
});

// Feedback
app.post("/api/v1/feedback", (req, res) => {
  insertFeedback({ id: Date.now().toString(), ...req.body, timestamp: Date.now() });
  res.json({ status: "feedback recorded" });
});

app.listen(4000, () => console.log("AWO backend listening on :4000"));
```

---

### Frontend (React + Vite stub UI)
```tsx
// src/App.tsx
import React, { useState } from "react";
import { postEvent, getSuggestions, previewSuggestion, runSuggestion, sendFeedback } from "./api";

export default function App() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [preview, setPreview] = useState<any | null>(null);
  const [report, setReport] = useState<any | null>(null);

  async function addEvent() {
    await postEvent(text);
    setText("");
    const res = await getSuggestions();
    setSuggestions(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Adaptive Workflow Orchestrator Demo</h1>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Enter meeting text..." />
      <button onClick={addEvent}>Add Event</button>
      <h2>Suggestions</h2>
      <ul>
        {suggestions.map(s => (
          <li key={s.id}>
            <strong>{s.title}</strong> (confidence {s.confidence})
            <button onClick={() => previewSuggestion(s.id).then(r => setPreview(r.data))}>Preview</button>
            <button onClick={() => runSuggestion(s.id, true).then(r => setReport(r.data))}>Run</button>
            <button onClick={() => sendFeedback(s.id, true)}>👍</button>
            <button onClick={() => sendFeedback(s.id, false)}>👎</button>
          </li>
        ))}
      </ul>
      {preview && <pre>{JSON.stringify(preview, null, 2)}</pre>}
      {report && <pre>{JSON.stringify(report, null, 2)}</pre>}
    </div>
  );
}
```

---

## How to Run it
1. **Backend**
   ```bash
   cd backend
   npm install
   npm run start
   ```
   Runs on `http://localhost:4000`.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Opens on `http://localhost:5173`.

3. **Demo Flow**
   - Enter meeting text (e.g., *“Decision: adopt new tool. Action: assign tasks.”*) and click **Add Event**.  
   - Add another event with a decision/action.  
   - Suggestions appear in the list.  
   - Preview, Run, and give feedback.  
   - Audit logs available at `http://localhost:4000/api/v1/audits`.

---
