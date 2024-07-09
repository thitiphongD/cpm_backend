import express from "express";
const router = express.Router();
import {
  GetAllUsers,
  GetPortfolio,
  Login,
  Register,
} from "../controllers/user.controller";
import {
  CoinList,
  CoinMarketCapAPI,
  GetCoin,
  GetCoinsByUser,
} from "../controllers/coin.controller";

router.get("/users", GetAllUsers);
router.post("/login", Login);
router.post("/register", Register);
router.get("/portfolio/:username", GetPortfolio);

router.get("/coin-list", CoinMarketCapAPI);
router.get("/coin/:id", GetCoin);
router.get("/coins/:ids", GetCoinsByUser);
router.get("/coins", CoinList);

export default router;
