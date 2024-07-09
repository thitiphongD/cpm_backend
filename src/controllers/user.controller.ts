import { type Request, type Response } from "express";
import { pool } from "../db/connection";
import { PortfolioData } from "../interface/interface";
import { loginModel, registerModel } from "../models/user";
import {
    passwordDoNotMatch,
    sendLoginFail,
    sendLoginSuccess,
    sendRegisterFail,
    sendRegisterSuccess,
    sendServerError,
    userAlreadyExists,
} from "../helpers/Response";
import { logError } from "../helpers/Error";
import { ErrorType } from "../types/ErrorTypes";

export const Login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        const user = await loginModel(username, password);
        if (user) {
            sendLoginSuccess(res, user.username);
        } else {
            sendLoginFail(res);
        }
    } catch (error) {
        logError(error, "login");
        sendServerError(res);
    }
};

export const Register = async (req: Request, res: Response): Promise<void> => {
    const { username, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return passwordDoNotMatch(res);
        }
        const user = await registerModel(username, password);
        if (user) {
            sendRegisterSuccess(res, user.username)
        } else {
            sendRegisterFail(res)
        }

    } catch (error) {
        if (error instanceof Error && error.message === ErrorType.USER_EXISTS) {
            userAlreadyExists(res);
        } else {
            logError(error, "register");
            sendServerError(res);
        }
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
