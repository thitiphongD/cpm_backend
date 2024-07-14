import { type Response } from "express";
import { ErrorType, SuccessType } from "../types/ErrorTypes";

export const sendServerError = (res: Response) => {
  res.status(500).json({ error: ErrorType.SERVER_ERROR });
};

export const notFound = (res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "Hacker?",
  });
};

export const sendSuccess = (res: Response, data: any) => {
  res.json({
    data,
  });
};

export const sendApiKeyNotfound = (res: Response) => {
  return res.status(500).json({ error: ErrorType.CMC_KEY });
};

export const sendCoinNotfound = (res: Response) => {
  return res.status(500).json({ error: ErrorType.COIN_NOT_FOUND });
};

export const sendGetPortfolioSuccess = (res: Response, data: any) => {
  res.status(200).json({ message: SuccessType.PORT_SUCCESS, data: data });
};

export const sendAddCoinFail = (res: Response) => {
  res.status(400).json({ error: ErrorType.ADD_COIN_FAIL });
};

export const sendAddCoinSuccess = (res: Response) => {
  res.status(201).json({ message: SuccessType.COIN_SUCCESS });
};

export const sendUpdatePortfolioSuccess = (res: Response, data: any) => {
  res.status(200).json({ message: SuccessType.UPDATE_PORT_SUCCESS, data: data });
}

export const notFoundUserOrCoin = (res: Response) => {
  res.status(404).json({message : ErrorType.COIN_OR_USER_NOT_FOUND})
}

export const deleteCoinSuccess = (res: Response, data: any) => {
  res.status(200).json({ message: SuccessType.DELETE_COIN_SUCCESS, data: data });
}
