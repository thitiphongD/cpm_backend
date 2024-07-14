import { pool } from "../db/connection";
import { UserLogin, UserRegister } from "../types/interface";

export const loginModel = async (
  username: string,
  password: string,
) => {
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
    console.error("error login user:", error);
    throw error;
  }
};

export const registerModel = async (
  username: string,
  password: string,
) => {
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
    console.error("error register", error);
    throw error;
  }
};

export const getPortFolioModel = async (username: string) => {
  const query = {
    text: `
      SELECT u.username, p.crypto_id, p.quantity::numeric(10, 2)
      FROM users u
      JOIN portfolio p ON u.id = p.user_id
      WHERE u.username = $1
    `,
    values: [username],
  };
  const result = await pool.query(query);
  return result.rows;
};

export const getUserAndCheckExistsModel = async (username: string) => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return { exists: false, data: null };
    }
    return { exists: true, data: result.rows[0] };
  } catch (error) {
    console.error("error check user:", error);
    throw new Error("error check user");
  }
};


export const checkUserExistsModel = async (username: string) => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const result = await pool.query(query);
    return result.rows.length > 0;
  } catch (error) {
    console.error("error check user:", error);
    throw new Error("error check user");
  }
};

export const getUserAndIdModel = async (username: string) => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("error check user:", error);
    throw new Error("error check user");
  }
};


