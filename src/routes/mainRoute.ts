import express from "express";
const router = express.Router();
import {
  AddCoinUser,
  GetAllUsers,
  GetPortfolio,
  LoginController,
  RegisterController,
} from "../controllers/user.controller";
import {
  CoinList,
  CoinMarketCapAPI,
  GetCoin,
  GetCoinsByUser,
} from "../controllers/coin.controller";

router.get("/users", GetAllUsers);
router.post("/login", LoginController);
router.post("/register", RegisterController);
router.get("/portfolio/:username", GetPortfolio);

router.get("/coin-list", CoinMarketCapAPI);
router.get("/coin/:id", GetCoin);
router.get("/coins/:ids", GetCoinsByUser);
router.get("/coins", CoinList);
router.post("/portfolio", AddCoinUser);

export default router;
