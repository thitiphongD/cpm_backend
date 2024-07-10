import { type Request, type Response } from "express";
import { pool } from "../db/connection";
import { PortfolioData } from "../interface/interface";
import {
  checkUserExists,
  fetchPortfolioData,
  loginModel,
  registerModel,
} from "../models/user";
import {
  passwordDoNotMatch,
  sendLoginFail,
  sendLoginSuccess,
  sendRegisterFail,
  sendRegisterSuccess,
  sendServerError,
  userAlreadyExists,
  userNotFound,
} from "../helpers/Response";
import { ErrorType } from "../types/ErrorTypes";
import { fetchCoinData } from "../models/coin";

export const LoginController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const RegisterController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const GetPortfolio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const username = req.params.username;
  try {
    const user = await checkUserExists(username);

    if (!user) {
      userNotFound(res);
    }

    const portfolioRows = await fetchPortfolioData(username);
    const cryptoIds = portfolioRows.map((row) => row.crypto_id).join(",");
    const resultCoins = await fetchCoinData(cryptoIds);

    const mergeData: PortfolioData[] = portfolioRows.map((row) => {
      const coinData = resultCoins.data[row.crypto_id];
      const price = resultCoins.data[row.crypto_id].quote["USD"].price;
      const amount =
        parseFloat(row.quantity) *
        resultCoins.data[row.crypto_id].quote["USD"].price;
      return {
        id: row.crypto_id,
        name: coinData.name,
        symbol: coinData.symbol,
        cmc_rank: coinData.cmc_rank,
        price: price,
        percent_change_1h: coinData.quote["USD"].percent_change_1h,
        percent_change_24h: coinData.quote["USD"].percent_change_24h,
        percent_change_7d: coinData.quote["USD"].percent_change_7d,
        volume_24h: coinData.quote["USD"].volume_24h,
        market_cap: coinData.quote["USD"].market_cap,
        quantity: parseFloat(row.quantity),
        amount: amount,
      };
    });
    res.status(200).json({
      data: mergeData,
    });
  } catch (error) {
    sendServerError(res);
  }
};

export const GetAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    sendServerError(res);
  }
};
