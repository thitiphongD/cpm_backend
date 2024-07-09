import { type Response } from "express";

export const sendLoginSuccess = (res: Response, username: string) => {
  res.status(200).json({
    message: "Login success",
    username: username,
  });
};

export const sendLoginFail = (res: Response) => {
  res.status(401).json({ error: "Invalid credentials" });
};

export const sendServerError = (res: Response) => {
  res.status(500).json({ error: "Server error" });
};
