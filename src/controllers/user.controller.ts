import { type Request, type Response } from "express";
import { pool } from "../db/connection";
import {
    checkUserExists,
    getUserAndID,
    loginModel,
    registerModel,
} from "../models/user";
import {
    passwordDoNotMatch,
    sendAddCoinSuccess,
    sendLoginFail,
    sendLoginSuccess,
    sendRegisterFail,
    sendRegisterSuccess,
    sendServerError,
    userAlreadyExists,
    userNotFound,
} from "../helpers/Response";
import { ErrorType } from "../types/ErrorTypes";
import { addCoinUser } from "../models/coin";
import { getPortfolioAndCoinData, mergePortfolioData } from "../helpers/portfolioHelpers";

export const LoginController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, password } = req.body;
    try {
        const user = await loginModel(username, password);
        if (user) {
            sendLoginSuccess(res, user.username);
        } else {
            sendLoginFail(res);
        }
    } catch (error) {
        console.error(error);
        sendServerError(res);
    }
};

export const RegisterController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return passwordDoNotMatch(res);
        }
        const user = await registerModel(username, password);
        if (user) {
            sendRegisterSuccess(res, user.username);
        } else {
            sendRegisterFail(res);
        }
    } catch (error) {
        if (error instanceof Error && error.message === ErrorType.USER_EXISTS) {
            userAlreadyExists(res);
        } else {
            console.error(error);
            sendServerError(res);
        }
    }
};

export const AddCoinUser = async (req: Request, res: Response) => {
    const { id, quantity, username } = req.body;
    
    try {
        const user = await getUserAndID(username);
        if (!user) {
            return userNotFound(res);
        }
        await addCoinUser(id, quantity, user.id);

        const { portfolio, resultCoins } = await getPortfolioAndCoinData(username);
        const mergeData = mergePortfolioData(portfolio, resultCoins);

        sendAddCoinSuccess(res, mergeData);
    } catch (error) {
        console.error("Error in AddCoinUser:", error);
        sendServerError(res);
    }
};

export const GetPortfolio = async (req: Request, res: Response): Promise<void> => {
    const username = req.params.username;
    try {
        const user = await checkUserExists(username);
        if (!user) {
            return userNotFound(res);
        }

        const { portfolio, resultCoins } = await getPortfolioAndCoinData(username);
        const mergeData = mergePortfolioData(portfolio, resultCoins);

        res.status(200).json({
            data: mergeData,
        });
    } catch (error) {
        sendServerError(res);
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
        sendServerError(res);
    }
};
