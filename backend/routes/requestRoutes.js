import { Router } from "express";
import { createRequest } from "../controllers/requestController.js";
import { getAllRequests } from "../controllers/requestController.js";
import { deleteRequest } from "../controllers/requestController.js";
const router = Router();

router.post("/", createRequest);
router.get("/", getAllRequests);
router.delete("/:id", deleteRequest); 

export default router;