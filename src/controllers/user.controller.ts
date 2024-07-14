import { type Request, type Response } from "express";
import {
  checkUserExistsModel,
  getPortFolioModel,
  getUserAndIdModel,
  loginModel,
  registerModel,
} from "../models/user";
import {
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

import { ErrorType } from "../types/enum";
import { addCoinModel, updateCoinModel } from "../models/coin";
import { CoinDataMarketCapAPI, FetchCoinByID } from "./coin.controller";

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
      sendServerError(res);
    }
  }
};

export const AddCoinUser = async (req: Request, res: Response) => {
  const { id, quantity, username } = req.body;

  try {
    const user = await getUserAndIdModel(username);
    if (!user) {
      return userNotFound(res);
    }
    await addCoinModel(id, quantity, user.id);
    sendAddCoinSuccess(res);
  } catch (error) {
    sendServerError(res);
  }
};

export const GetPortfolio = async (req: Request, res: Response) => {
  const username = req.body.username;

  try {
    const user = await checkUserExistsModel(username);
    if (!user) {
      return userNotFound(res);
    }
    const portfolio = await getPortFolioModel(username);
    const cryptoIds = portfolio.map((row: any) => row.crypto_id);
    const result = await CoinDataMarketCapAPI();
    const coinData = result.filter((coin: any) => cryptoIds.includes(coin.id));
    const coinInfo = await FetchCoinByID(cryptoIds.join(','));

    const resultPortfolio = coinData.map((coin: any) => {
      const portfolioItem = portfolio.find((item: any) => item.crypto_id === coin.id);
      const quantity = portfolioItem ? portfolioItem.quantity : 0;
      const price = coin.quote["USD"].price;
      const amount = quantity * price;

      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        slug: coin.slug,
        cmc_rank: coin.cmc_rank,
        quote: coin.quote,
        logo: coinInfo.data[coin.id]?.logo,
        description: coinInfo.data[coin.id]?.description,
        quantity: parseFloat(quantity),
        amount: amount
      };
    });
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
    const user = await getUserAndIdModel(username);
    if (!user) {
      return userNotFound(res);
    }
    const updateData = await updateCoinModel(quantity, username, +id);
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
