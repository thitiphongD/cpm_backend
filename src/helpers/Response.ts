import { type Response } from "express";
import { ErrorType, SuccessType } from "../types/ErrorTypes";

export const sendServerError = (res: Response) => {
  res.status(500).json({ error: ErrorType.SERVER_ERROR });
};

export const sendSuccess = (res: Response, data: any) => {
  res.json({
    data,
  });
};

export const sendLoginSuccess = (res: Response, username: string) => {
  res.status(200).json({
    message: SuccessType.LOGIN,
    username: username,
  });
};

export const sendLoginFail = (res: Response) => {
  res.status(401).json({ error: ErrorType.LOGIN_FAIL });
};

export const passwordDoNotMatch = (res: Response) => {
  res.status(400).json({ error: ErrorType.PASSWORD_NOT_MATCH });
};

export const sendRegisterSuccess = (res: Response, username: string) => {
  res.status(201).json({ message: SuccessType.REGISTER, username: username });
};

export const sendRegisterFail = (res: Response) => {
  res.status(400).json({ error: ErrorType.REGISTER_FAIL });
};

export const userAlreadyExists = (res: Response) => {
  res.status(400).json({ error: ErrorType.USER_EXISTS });
};

export const userNotFound = (res: Response) => {
  res.status(400).json({ error: ErrorType.USER_NOT_FOUND });
};

export const sendApiKeyNotfound = (res: Response) => {
  return res.status(500).json({ error: ErrorType.CMC_KEY });
};

export const sendCoinNotfound = (res: Response) => {
  return res.status(500).json({ error: ErrorType.COIN_NOT_FOUND });
};
