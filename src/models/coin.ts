import { type Request, type Response } from "express";

export const fetchCoinData = async (cryptoIds: string) => {
  const coinsResponse = await fetch(`http://localhost:8080/coins/${cryptoIds}`);
  if (!coinsResponse.ok) {
    throw new Error("Failed to fetch coin data");
  }
  return coinsResponse.json();
};
