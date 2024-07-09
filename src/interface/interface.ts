export interface PortfolioData {
  id: number;
  name: string;
  symbol: string;
  cmc_rank: number;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  volume_24h: number;
  market_cap: number;
  quantity: number;
  amount: number;
}
