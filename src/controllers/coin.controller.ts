import { type Request, type Response } from "express";
import dotenv from "dotenv";
import {
  sendApiKeyNotfound,
  sendCoinNotfound,
  sendServerError,
  sendSuccess,
} from "../helpers/Response";
dotenv.config();
const apiKey = process.env.CMC_API_KEY;

enum API_URL {
  ALL_COIN_LIST = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  COIN_LIST = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  COIN_INFO = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
  COIN_USER = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest",
}

export const CoinMarketCapAPI = async (req: Request, res: Response) => {
  const apiUrl = API_URL.ALL_COIN_LIST;
  if (!apiKey) {
    sendApiKeyNotfound(res);
  }
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from CoinMarketCap API");
    }
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error fetch data from CoinMarketCap API:", error);
    sendServerError(res);
  }
};

export const CoinList = async (req: Request, res: Response) => {
  const apiUrl = API_URL.COIN_LIST;

  if (!apiKey) {
    sendApiKeyNotfound(res);
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from CoinMarketCap API");
    }
    const result = await response.json();
    const coinData = result.data.map((row: any) => {
      return {
        id: row.id,
        name: row.name,
        symbol: row.symbol,
      };
    });
    sendSuccess(res, coinData);
  } catch (error) {
    console.error("Error fetch data from CoinMarketCap API:", error);
    sendServerError(res);
  }
};

export const GetCoin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const apiUrl = API_URL.COIN_INFO;
  if (!apiKey) {
    sendApiKeyNotfound(res);
  }

  if (!id) {
    sendCoinNotfound(res);
  }

  const url = `${apiUrl}?id=${id}`;
  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey as string,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  res.json(data);
};

export const GetCoinsByUser = async (req: Request, res: Response) => {
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
      console.error("API Error:", errorData);
      throw new Error(
        `Failed to fetch data: ${
          errorData.status?.error_message || "Unknown error"
        }`,
      );
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    sendServerError(res);
  }
};
