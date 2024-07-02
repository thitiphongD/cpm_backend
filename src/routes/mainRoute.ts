import express from "express";
const router = express.Router();
import { HealthCheck } from "../controllers/main";

router.get("/check", HealthCheck);

export default router;
