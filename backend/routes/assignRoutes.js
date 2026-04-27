import { Router } from "express";
import { assignWorker } from "../controllers/assignController.js";

const router = Router();

router.post("/", assignWorker);

export default router;