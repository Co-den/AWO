import React, { useState, useEffect } from "react";
import {
  postEvent,
  getSuggestions,
  previewSuggestion,
  runSuggestion,
  sendFeedback,
} from "./api";
import "./App.css";

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

  async function showPreview(id: string) {
    const res = await previewSuggestion(id);
    setPreview(res.data);
    setReport(null);
  }

  async function run(id: string) {
    const res = await runSuggestion(id, true);
    setReport(res.data);
  }

  async function feedback(id: string, accepted: boolean) {
    await sendFeedback(id, accepted);
    alert("Feedback recorded");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Adaptive Workflow Orchestrator</h1>
        <p className="subtitle">
          Add meeting text and explore suggestions
        </p>
      </header>

      <section className="composer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter meeting text..."
          className="input"
        />
        <button onClick={addEvent} className="btn primary">
          Add Event
        </button>
      </section>

      <section className="suggestions">
        <h2>Suggestions</h2>
        <ul className="suggestion-list">
          {suggestions.map((s) => (
            <li key={s.id} className="suggestion-card">
              <div className="suggestion-main">
                <div className="title-row">
                  <strong className="s-title">{s.title}</strong>
                  <span className="confidence">confidence {s.confidence}</span>
                </div>
                <div className="description">{s.description}</div>
              </div>

              <div className="actions">
                <button
                  className="btn secondary"
                  onClick={() => showPreview(s.id)}
                >
                  Preview
                </button>
                <button className="btn" onClick={() => run(s.id)}>
                  Run
                </button>
                <button
                  className="btn icon"
                  onClick={() => feedback(s.id, true)}
                >
                  👍
                </button>
                <button
                  className="btn icon"
                  onClick={() => feedback(s.id, false)}
                >
                  👎
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {preview && (
        <section className="panel preview-panel">
          <h3>Preview</h3>
          <pre>{JSON.stringify(preview, null, 2)}</pre>
        </section>
      )}

      {report && (
        <section className="panel report-panel">
          <h3>Execution Report</h3>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
