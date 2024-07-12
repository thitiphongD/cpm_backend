import { PortfolioData, PortfolioDTO } from "../interface/interface";
import { fetchCoinData } from "../models/coin";
import { fetchPortfolioData } from "../models/user";

export const mergePortfolioData = (
  // portfolio: PortfolioDTO,
  portfolio: PortfolioDTO,
  resultCoins: any,
): PortfolioData[] => {
  return portfolio.map((row: any) => {
    const coinData = resultCoins.data[row.crypto_id];
    const price = resultCoins.data[row.crypto_id].quote["USD"].price;
    const amount = row.quantity * price;
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
      quantity: row.quantity,
      amount: amount,
    };
  });
};

export const getPortfolioAndCoinData = async (username: string) => {
  const portfolio = await fetchPortfolioData(username);
  const cryptoIds = portfolio.map((row) => row.crypto_id).join(",");
  const resultCoins = await fetchCoinData(cryptoIds);
  return { portfolio, resultCoins };
};
