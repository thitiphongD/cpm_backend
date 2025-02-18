import { type Request, type Response } from "express";
import dotenv from "dotenv";
import {
  deleteCoinSuccess,
  notFoundUserOrCoin,
  sendApiKeyNotfound,
  sendCoinNotfound,
  sendServerError,
} from "../helpers/Response";
import { deleteCoinModel } from "../models/coin";
import { API_URL } from "../types/enum";
dotenv.config();

const apiKey = process.env.CMC_API_KEY;

export const CoinDataMarketCapAPI = async () => {
  const coinListURL = API_URL.ALL_COIN_LIST;

  if (!apiKey) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(coinListURL, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error("Fail to fetch data from CoinMarketCap API");
    }

    const result = await response.json();
    const ids = result.data.map((coin: any) => coin.id);
    const idsString = ids.join(",");
    const coinInfo = await FetchCoinByID(idsString);

    result.data.forEach((coin: any) => {
      coin.logo = coinInfo.data[coin.id]?.logo;
      coin.description = coinInfo.data[coin.id]?.description;
    });

    return result.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      cmc_rank: coin.cmc_rank,
      quote: coin.quote,
      logo: coin.logo,
      description: coin.description,
    }));

  } catch (error) {
    throw error;
  }
};

export const FetchCoinByID = async (id: string) => {
  const apiUrl = API_URL.COIN_INFO;
  const url = `${apiUrl}?id=${id}`;

  const response = await fetch(url, {
    headers: {
      'X-CMC_PRO_API_KEY': apiKey as string,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const CoinList = async (req: Request, res: Response) => {
  if (!apiKey) {
    return sendApiKeyNotfound(res);
  }
  try {
    const result = await CoinDataMarketCapAPI();
    return res.json(result);
  } catch (error) {
    console.error("Error fetch data from CoinMarketCap API:", error);
    sendServerError(res);
  }
};


export const GetCoin = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!apiKey) {
    return sendApiKeyNotfound(res);
  }
  if (!id) {
    return sendCoinNotfound(res);
  }
  try {
    const result = await CoinDataMarketCapAPI();
    const coinData = result.find((coin: any) => coin.id.toString() === id);
    if (!coinData) {
      return sendCoinNotfound(res);
    }
    const coinInfo = await FetchCoinByID(id);

    const resultCoinData = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
      slug: coinData.slug,
      cmc_rank: coinData.cmc_rank,
      quote: coinData.quote,
      logo: coinInfo.data[coinData.id]?.logo,
      description: coinInfo.data[coinData.id]?.description,
    }

    res.json(resultCoinData);
  } catch (error) {
    sendServerError(res);
  }
};

export const GetCoinsById = async (req: Request, res: Response) => {
  const { ids } = req.params;
  const apiUrl = API_URL.COIN_USER;
  if (!apiKey) {
    sendApiKeyNotfound(res);
  }
  const url = `${apiUrl}?id=${ids}`;
  try {
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
    }
    res.json(data);
  } catch (error) {
    sendServerError(res);
  }
};

export const DeleteCoinController = async (req: Request, res: Response) => {
  const username = req.body.username;
  const id = req.params.id;
  const crypto_id = parseInt(id)

  try {
    const result = await deleteCoinModel(crypto_id, username);
    if (result === false) {
      return notFoundUserOrCoin(res);
    }
    return deleteCoinSuccess(res, result);
  } catch (error) {
    return sendServerError(res);
  }
}



