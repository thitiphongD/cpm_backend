import express from "express";
const router = express.Router();
import {
  AddCoinUser,
  GetAllUsers,
  GetPortfolio,
  LoginController,
  RegisterController,
  UpdatePortfolio,
} from "../controllers/user.controller";
import {
  CoinList,
  GetCoin,
  GetCoinsByUser,
} from "../controllers/coin.controller";

router.get("/users", GetAllUsers);
router.post("/login", LoginController);
router.post("/register", RegisterController);

router.get("/portfolio/:username", GetPortfolio);
router.post("/portfolio", AddCoinUser);
router.put("/portfolio/:id", UpdatePortfolio);

router.get("/coin/:id", GetCoin);

router.get("/coins/:ids", GetCoinsByUser);
router.get("/coins", CoinList);

export default router;
