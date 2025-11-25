import express from "express";
import bodyParser from "body-parser";
import eventsRouter from "./routes/event";
import suggestionsRouter from "./routes/suggestions";
import feedbackRouter from "./routes/feedback";
import auditRouter from "./routes/auditRoute";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(bodyParser.json());

app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/suggestions", suggestionsRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/audits", auditRouter);

app.get("/api/v1/health", (req, res) =>
  res.send({ status: "ok", time: Date.now() })
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`AWO backend listening on :${PORT}`));
