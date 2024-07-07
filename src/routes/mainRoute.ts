import express from "express";
const router = express.Router();
import { getAllUsers, getPortfolio, login, register } from '../controllers/user.controller'
import { coinList, coinMarketCapAPI, getCoin, getCoinsByUser } from '../controllers/coin.controller'

router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/portfolio/:username", getPortfolio)
router.get("/coin-list", coinMarketCapAPI)
router.get("/coin/:id", getCoin)
router.get("/coins/:ids", getCoinsByUser);
router.get("/coins", coinList);



export default router;
