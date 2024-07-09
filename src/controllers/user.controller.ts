import { type Request, type Response } from "express";
import pool from "../db/connection";
import { PortfolioData } from "../interface/interface";

export const Login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1 AND password = $2",
      values: [username, password],
    };

    const result = await pool.query(query);
    if (result.rows.length === 1) {
      const user = result.rows[0];
      if (user.password === password) {
        res.status(200).json({
          message: "Login success",
          username: result.rows[0].username,
        });
      } else {
        res.status(401).json({ error: "user or password incorrect" });
      }
    } else {
      res.status(401).json({ error: "user or password incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

export const Register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }
    const checkQuery = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const checkResult = await pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }
    const insertQuery = {
      text: "INSERT INTO users (username, password) VALUES ($1, $2)",
      values: [username, password],
    };
    await pool.query(insertQuery);
    res.status(201).json({ message: "User register success" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const GetPortfolio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const username = req.params.username;
  try {
    const query = {
      text: "SELECT u.username, p.crypto_id, p.quantity FROM users u JOIN portfolio p ON u.id = p.user_id WHERE u.username = $1",
      values: [username],
    };
    const result = await pool.query(query);

    const cryptoIds = result.rows.map((row) => row.crypto_id).join(",");

    const coinsResponse = await fetch(
      `http://localhost:8080/coins/${cryptoIds}`
    );

    if (!coinsResponse.ok) {
      throw new Error("Failed to fetch coin data");
    }
    const resultCoins = await coinsResponse.json();

    const mergeData: PortfolioData[] = result.rows.map((row) => {
      const coinData = resultCoins.data[row.crypto_id];
      const price = resultCoins.data[row.crypto_id].quote["USD"].price;
      const amount =
        parseFloat(row.quantity) *
        resultCoins.data[row.crypto_id].quote["USD"].price;
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
        quantity: parseFloat(row.quantity),
        amount: amount,
      };
    });

    res.status(200).json({
      data: mergeData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

export const GetAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};
