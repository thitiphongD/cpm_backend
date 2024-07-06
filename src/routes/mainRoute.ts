import express from "express";
const router = express.Router();
import { coinMarketCapAPI, getAllUsers, getCoin, getPortfolio, login, register } from '../controllers/user.controller'

router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/portfolio", getPortfolio)
router.get("/coin-list", coinMarketCapAPI)
router.get("/coins/:id", getCoin)

export default router;
