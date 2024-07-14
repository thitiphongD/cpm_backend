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
  GetCoinsById,
} from "../controllers/coin.controller";

router.get("/users", GetAllUsers);
router.post("/login", LoginController);
router.post("/register", RegisterController);

router.post("/portfolio", GetPortfolio);
router.post("/portfolio/buy", AddCoinUser);
router.put("/portfolio/:id", UpdatePortfolio);

router.get("/coin/:id", GetCoin);

router.get("/coins/:ids", GetCoinsById);
router.get("/coins", CoinList);

export default router;
