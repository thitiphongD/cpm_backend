export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface PortfolioDTO {
  username: string;
  crypto_id: number;
  quantity: number;
}

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

export interface CoinDTO {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      tvl: number | null;
      last_updated: string;
    };
  };
  logo: string;
  description: string;
}

export interface CoinMarketCapAPIResponse {
  data: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    cmc_rank: number;
    quote: {
      USD: {
        price: number;
        volume_24h: number;
        volume_change_24h: number;
        percent_change_1h: number;
        percent_change_24h: number;
        percent_change_7d: number;
        percent_change_30d: number;
        percent_change_60d: number;
        percent_change_90d: number;
        market_cap: number;
        market_cap_dominance: number;
        fully_diluted_market_cap: number;
        tvl: number | null;
        last_updated: string;
      };
    };
    logo: string;
    description: string;
  }[];
}
