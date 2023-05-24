import express from "express";
import Auth from "../middleware/Auth.js";

import { fn_getAll } from "../controllers/logactController.js";

const router = express.Router();

router.get("/rp_logact", Auth, fn_getAll);

export default router;