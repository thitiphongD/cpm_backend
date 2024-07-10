import { pool } from "../db/connection";

export const fetchCoinData = async (cryptoIds: string) => {
  const coinsResponse = await fetch(`http://localhost:8080/coins/${cryptoIds}`);
  if (!coinsResponse.ok) {
    throw new Error("Failed to fetch coin data");
  }
  return coinsResponse.json();
};

export const addCoinUser = async (
  crypto_id: number,
  quantity: number,
  user_id: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const query = `
      WITH upsert AS (
        UPDATE portfolio 
        SET quantity = quantity + $2, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND crypto_id = $3
        RETURNING *
      )
      INSERT INTO portfolio (user_id, crypto_id, quantity)
      SELECT $1, $3, $2
      WHERE NOT EXISTS (SELECT * FROM upsert);
    `;

    const result = await client.query(query, [user_id, quantity, crypto_id]);
    await client.query("COMMIT");
    return result.rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
