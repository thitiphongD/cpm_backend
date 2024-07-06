import express from "express";
const router = express.Router();
import { getAllUsers } from '../controllers/user.controller'

router.get("/users", getAllUsers);

export default router;
