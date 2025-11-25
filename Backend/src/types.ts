export type EventType = "meeting" | "message" | "task" | "note";

export type Event = {
  id: string;
  type: EventType;
  text: string;
  timestamp: number;
  metadata?: Record<string, any>;
};

export type WorkflowStep = {
  id: string;
  action:
    | "extract_summary"
    | "create_task"
    | "draft_message"
    | "schedule_followup";
  params: Record<string, any>;
};

export type Suggestion = {
  id: string;
  title: string;
  confidence: number;
  steps: WorkflowStep[];
  preview: string;
  sourceEventIds: string[];
  createdAt: number;
};

export type Feedback = {
  id: string;
  suggestionId: string;
  accepted: boolean;
  notes?: string;
  timestamp: number;
};
