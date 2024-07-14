import express from "express";
const router = express.Router();
import {
  AddCoinUser,
  GetPortfolio,
  LoginController,
  RegisterController,
  UpdatePortfolio,
} from "../controllers/user.controller";
import {
  CoinList,
  DeleteCoinController,
  GetCoin,
  GetCoinsById,
} from "../controllers/coin.controller";

router.post("/login", LoginController);
router.post("/register", RegisterController);

router.post("/portfolio", GetPortfolio);
router.post("/portfolio/buy", AddCoinUser);
router.put("/portfolio/:id", UpdatePortfolio);
router.delete("/portfolio/:id", DeleteCoinController);

router.get("/coin/:id", GetCoin);

router.get("/coins/:ids", GetCoinsById);
router.get("/coins", CoinList);

export default router;
