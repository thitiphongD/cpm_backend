import { type Response } from "express";
import { ErrorType } from "../types/ErrorTypes";

export const sendServerError = (res: Response) => {
  res.status(500).json({ error: ErrorType.SERVER_ERROR });
};

export const sendLoginSuccess = (res: Response, username: string) => {
  res.status(200).json({
    message: "Login success",
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
  res.status(201).json({ message: "User register success", username: username });
};

export const sendRegisterFail = (res: Response) => {
  res.status(400).json({ error: ErrorType.REGISTER_FAIL });
};

export const userAlreadyExists = (res: Response) => {
  res.status(400).json({ error: ErrorType.USER_EXISTS });
};
