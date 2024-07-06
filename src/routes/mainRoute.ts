import express from "express";
const router = express.Router();
import { coinMarketCapAPI, getAllUsers, getPortfolio, login, register } from '../controllers/user.controller'

router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/portfolio", getPortfolio)
router.get("/coin-list", coinMarketCapAPI)


export default router;
