import axios from "axios";

export async function postEvent(text: string) {
  return axios.post("/api/v1/events", { type: "meeting", text });
}

export async function getSuggestions() {
  return axios.get("/api/v1/suggestions");
}

export async function previewSuggestion(id: string) {
  return axios.get(`/api/v1/suggestions/${id}/preview`);
}

export async function runSuggestion(id: string, consent: boolean) {
  return axios.post(`/api/v1/suggestions/${id}/run`, { consent });
}

export async function sendFeedback(id: string, accepted: boolean) {
  return axios.post("/api/v1/feedback", { suggestionId: id, accepted });
}
