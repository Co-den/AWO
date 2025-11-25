import { Suggestion, WorkflowStep } from "../types";

/**
 * Simulate execution of workflow steps.
 * Returns a simple report for each step.
 */
export function simulateExecution(
  suggestion: Suggestion,
  edits: Record<string, any> = {}
) {
  const executed = suggestion.steps.map((step: WorkflowStep) => {
    const params = { ...step.params, ...(edits[step.id] || {}) };
    // Simulated result per action
    let result: any = { status: "simulated" };
    switch (step.action) {
      case "extract_summary":
        result.output = [
          `Decision 1 (simulated)`,
          `Decision 2 (simulated)`,
          `Decision 3 (simulated)`,
        ];
        break;
      case "create_task":
        result.created = params.tasks || [
          {
            id: `task-${Math.random().toString(36).slice(2, 8)}`,
            title: "Simulated task",
          },
        ];
        break;
      case "draft_message":
        result.draft = {
          subject: "Meeting summary (simulated)",
          body: "Here are the top decisions...",
        };
        break;
      case "schedule_followup":
        result.scheduled = {
          when: params.when || "next-week",
          calendarEventId: `evt-${Math.random().toString(36).slice(2, 8)}`,
        };
        break;
      default:
        result.note = "unknown action";
    }
    return { stepId: step.id, action: step.action, params, result };
  });
  return { suggestionId: suggestion.id, executed, timestamp: Date.now() };
}
