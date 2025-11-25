import { Event, Suggestion, WorkflowStep } from "../types";
import { v4 as uuid } from "uuid";

const decisionRegex = /\b(decision|decide|decided)\b/;
const actionRegex = /\b(task|action|follow up|follow-up|assign)\b/;

export function detectPatterns(events: Event[]): Suggestion[] {
  const meetings = events.filter((e) => e.type === "meeting");
  const hits = meetings.filter(
    (m) =>
      decisionRegex.test(m.text.toLowerCase()) &&
      actionRegex.test(m.text.toLowerCase())
  );
  if (hits.length >= 1) {
    const id = uuid();
    const steps: WorkflowStep[] = [
      {
        id: uuid(),
        action: "extract_summary",
        params: { source: "latest_meeting_transcript", top_n: 3 },
      },
      {
        id: uuid(),
        action: "create_task",
        params: { board: "default", assign_to: "prompt" },
      },
      {
        id: uuid(),
        action: "draft_message",
        params: { channel: "email", template: "meeting_summary" },
      },
    ];
    const suggestion: Suggestion = {
      id,
      title: "Post-meeting follow-up workflow",
      confidence: Math.min(0.9, 0.4 + hits.length * 0.25),
      steps,
      preview:
        "Extract top 3 decisions, create tasks, and draft a summary email to attendees.",
      sourceEventIds: hits.slice(-3).map((h) => h.id),
      createdAt: Date.now(),
    };
    return [suggestion];
  }
  return [];
}
