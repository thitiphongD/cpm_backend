import pool from "../db/connection";
import { UserLogin } from "../interface/interface";

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

// export const createUser = async (username: string, password: string): Promise<User> => {
//     const query = {
//       text: "INSERT INTO users(username, password) VALUES($1, $2) RETURNING *",
//       values: [username, password],
//     };

//     try {
//       const result = await pool.query(query);
//       return result.rows[0] as User;
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw error;
//     }
//   };

//   export const updateUserPassword = async (userId: number, newPassword: string): Promise<void> => {
//     const query = {
//       text: "UPDATE users SET password = $1 WHERE id = $2",
//       values: [newPassword, userId],
//     };

//     try {
//       await pool.query(query);
//     } catch (error) {
//       console.error('Error updating user password:', error);
//       throw error;
//     }
//   };
