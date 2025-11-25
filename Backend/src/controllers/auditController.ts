import express from "express";
import { getAudits } from "../store/sqliteStore";

 const audits = (req: express.Request, res: express.Response) => {
  res.send(getAudits());
}

export default { audits };