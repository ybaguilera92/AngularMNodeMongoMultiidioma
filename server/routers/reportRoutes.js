import express from "express";
import Auth from "../middleware/Auth.js";

import { getLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/logs", Auth, getLogs);

export default router;