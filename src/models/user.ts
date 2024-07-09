import { pool } from "../db/connection";
import { UserLogin, UserRegister } from "../interface/interface";

export const loginModel = async (
  username: string,
  password: string
): Promise<UserLogin | null> => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1 AND password = $2",
      values: [username, password],
    };

    const result = await pool.query(query);
    if (result.rows.length > 0) {
      return result.rows[0] as UserLogin;
    }
    return null;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

export const registerModel = async (
  username: string,
  password: string
): Promise<UserRegister | null> => {
  try {
    const checkQuery = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const checkResult = await pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new Error("User already exists");
    }

    const insertQuery = {
      text: "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      values: [username, password],
    };

    const insertResult = await pool.query(insertQuery);

    if (insertResult.rows.length > 0) {
      return insertResult.rows[0] as UserRegister;
    }
    return null;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

