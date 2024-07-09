import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

export const initDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("Connect database success");
    client.release();
  } catch (error) {
    console.error("Fail to connect database:", error);
  }
};
