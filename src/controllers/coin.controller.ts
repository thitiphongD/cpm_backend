import { type Request, type Response } from "express";
import dotenv from "dotenv";
import {
  sendApiKeyNotfound,
  sendCoinNotfound,
  sendServerError,
  sendSuccess,
} from "../helpers/Response";
import { CoinDTO } from "../interface/interface";
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

export const CoinData = async (req: Request, res: Response) => {
  const coinListURL = API_URL.ALL_COIN_LIST;
  if (!apiKey) {
    sendApiKeyNotfound(res);
  }
  try {
    const response = await fetch(coinListURL, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from CoinMarketCap API");
    }
    const result = await response.json();
    const ids = result.data.map((coin: any) => coin.id);
    const idsString = ids.join(",");
    const coinByParams = API_URL.COIN_INFO;
    const url = `${coinByParams}?id=${idsString}`;

    const dataRes = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey as string,
        Accept: "application/json",
      },
    });
    if (!dataRes.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const coinInfo = await dataRes.json();

    result.data.forEach((coin: any) => {
      coin.logo = coinInfo.data[coin.id]?.logo;
      coin.description = coinInfo.data[coin.id]?.description;
    });

    const coinData = result.data.map((coin: CoinDTO) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      cmc_rank: coin.cmc_rank,
      quote: coin.quote,
      logo: coin.logo,
      description: coin.description,
    }));

    res.json(coinData);
  } catch (error) {
    sendServerError(res);
  }
};
