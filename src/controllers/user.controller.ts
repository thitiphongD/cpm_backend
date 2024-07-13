import { type Request, type Response } from "express";
import { pool } from "../db/connection";
import {
  checkUserExists,
  fetchPortfolioData,
  getUserAndID,
  loginModel,
  registerModel,
  updateQuantity,
} from "../models/user";
import {
  sendGetPortfolioSuccess,
  sendUpdatePortfolioSuccess,
  sendServerError,
  sendAddCoinSuccess,
  sendCoinNotfound,
} from "../helpers/Response";

import {
  sendLoginSuccess,
  sendLoginFail,
  passwordDoNotMatch,
  sendRegisterSuccess,
  sendRegisterFail,
  userAlreadyExists,
  userNotFound,
} from "../helpers/AuthResponse";

import { ErrorType } from "../types/ErrorTypes";
import { addCoinUser } from "../models/coin";
import { CoinDataMarketCapAPI, CoinList, fetchCoinByID } from "./coin.controller";
import { CoinDTO } from "../interface/interface";

export const LoginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await loginModel(username, password);
    if (user) {
      sendLoginSuccess(res, user.username);
    } else {
      sendLoginFail(res);
    }
  } catch (error) {
    console.error(error);
    sendServerError(res);
  }
};

export const RegisterController = async (req: Request, res: Response) => {
  const { username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return passwordDoNotMatch(res);
    }
    const user = await registerModel(username, password);
    if (user) {
      sendRegisterSuccess(res, user.username);
    } else {
      sendRegisterFail(res);
    }
  } catch (error) {
    if (error instanceof Error && error.message === ErrorType.USER_EXISTS) {
      userAlreadyExists(res);
    } else {
      console.error(error);
      sendServerError(res);
    }
  }
};

export const AddCoinUser = async (req: Request, res: Response) => {
  const { id, quantity, username } = req.body;

  try {
    const user = await getUserAndID(username);
    if (!user) {
      return userNotFound(res);
    }
    await addCoinUser(id, quantity, user.id);
    sendAddCoinSuccess(res);
  } catch (error) {
    console.error("Error in AddCoinUser:", error);
    sendServerError(res);
  }
};

export const GetPortfolio = async (req: Request, res: Response) => {
  const username = req.params.username;
  try {
    const user = await checkUserExists(username);
    if (!user) {
      return userNotFound(res);
    }
    const portfolio = await fetchPortfolioData(username);
    const cryptoIds = portfolio.map((row: any) => row.crypto_id);      
    const result = await CoinDataMarketCapAPI();   
    const coinData = result.filter((coin: any) => cryptoIds.includes(coin.id));
    const coinInfo = await fetchCoinByID(cryptoIds.join(','));
    
    const resultPortfolio = coinData.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      cmc_rank: coin.cmc_rank,
      quote: coin.quote,
      logo: coinInfo.data[coin.id]?.logo,
      description: coinInfo.data[coin.id]?.description,
    }));

    if (resultPortfolio.length === 0) {
      return sendCoinNotfound(res);
    }
    return res.json(resultPortfolio);
  } catch (error) {
    sendServerError(res);
  }
};

export const UpdatePortfolio = async (req: Request, res: Response) => {
  const { quantity, username } = req.body;
  const { id } = req.params;

  try {
    const user = await getUserAndID(username);
    if (!user) {
      return userNotFound(res);
    }
    const updateData = await updateQuantity(quantity, username, +id);
    const result = {
      username,
      crypto_id: id,
      updateData,
    };
    sendUpdatePortfolioSuccess(res, result);
  } catch (error) {
    sendServerError(res);
  }
};

export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    sendServerError(res);
  }
};
