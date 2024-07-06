import express from "express";
const router = express.Router();
import { getAllUsers, login, register } from '../controllers/user.controller'

router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/register", register);


export default router;
