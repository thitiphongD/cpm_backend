import { pool } from "../db/connection";
import { UserLogin, UserRegister } from "../interface/interface";

export const loginModel = async (
  username: string,
  password: string,
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
  password: string,
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

export const fetchPortfolioData = async (username: string) => {
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

export const checkUserExists = async (username: string) => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const result = await pool.query(query);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking user:", error);
    throw new Error("Error checking user");
  }
};

export const checkUserByID = async (username: string) => {
  try {
    const query = {
      text: "SELECT id, username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Error checking user:", error);
    throw new Error("Error checking user");
  }
};

export const getUserAndID = async (username: string) => {
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
    console.error("Error checking user:", error);
    throw new Error("Error checking user");
  }
};

export const updateQuantity = async (
  quantity: number,
  username: string,
  crypto_id: number,
) => {
  try {
    const query = {
      text: `
        UPDATE portfolio
        SET quantity = GREATEST(0, quantity + $1)
        WHERE user_id = (SELECT id FROM users WHERE username = $2)
        AND crypto_id = $3
        RETURNING quantity
      `,
      values: [quantity, username, crypto_id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      throw new Error("No matching portfolio entry found");
    }

    const updatedQuantity = result.rows[0].quantity;
    return updatedQuantity;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw new Error("Failed to update quantity");
  }
};
