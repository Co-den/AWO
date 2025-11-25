---

# Adaptive Workflow Orchestrator – Demo Instructions

## Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node)
- Git (optional, if cloning)

## Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run start
   ```
   The server will listen on **http://localhost:4000**.

### Backend Demo (curl)
You can test the backend directly:
```bash
# Add two meeting events
curl -X POST http://localhost:4000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"type":"meeting","text":"Decision: adopt new tool. Action: assign tasks."}'

curl -X POST http://localhost:4000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"type":"meeting","text":"We decided to move forward. Follow up: create tasks and assign owners."}'

# List suggestions
curl http://localhost:4000/api/v1/suggestions
```

---

## Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   Vite will print the local URL (usually **http://localhost:5173**).

---

## Demo Flow
1. Open the frontend URL in your browser.  
2. Type a meeting note (e.g., *“Decision: adopt new tool. Action: assign tasks.”*) and click **Add Event**.  
3. Add a second event with another decision/action.  
4. Suggestions will appear in the list.  
5. Click **Preview** to see details, **Run** to simulate execution, and give feedback with 👍 or 👎.  
6. You can inspect audit logs at **http://localhost:4000/api/v1/audits**.

---

## Notes
- **Persistence**: All events, suggestions, feedback, and audits are stored in `awo.db` (SQLite file in backend root).  
- **Safety**: Execution is simulated; no external connectors are triggered.  
- **Deprecation warnings**: You may see Node.js warnings from dependencies (e.g., `util._extend`). Safe to ignore for demo.  

---

This README ensures reviewers can run both parts quickly and reproduce the Sofia use case end‑to‑end.  

👉 I can also add a **screenshot mock description** of the frontend UI so your README looks even more polished. Would you like me to draft that?
