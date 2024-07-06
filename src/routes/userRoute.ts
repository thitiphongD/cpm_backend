import express from "express";
const router = express.Router();
import { getAllUsers, login } from '../controllers/user.controller'

router.get("/users", getAllUsers);
router.post("/login", login);

export default router;
