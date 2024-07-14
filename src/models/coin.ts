import { pool } from "../db/connection";

export const fetchCoinData = async (cryptoIds: string) => {
  const response = await fetch(`http://localhost:8080/coins/${cryptoIds}`);
  if (!response.ok) {
    throw new Error("Failed to fetch coin data");
  }
  return response.json();
};

export const addCoinUserModel = async (
  id: number,
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

    const result = await client.query(query, [user_id, quantity, id]);
    await client.query("COMMIT");
    return result.rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteCoinModel = async (crypto_id: number, username: number) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const userQuery = 'SELECT id FROM users WHERE username = $1';
    const userResult = await client.query(userQuery, [username]);

    if (userResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    
    const user_id = userResult.rows[0].id;
     const checkQuery = 'SELECT * FROM portfolio WHERE crypto_id = $1 AND user_id = $2';
     const checkResult = await client.query(checkQuery, [crypto_id, user_id]);
     
     if (checkResult.rowCount === 0) {
       await client.query('ROLLBACK');
       return false;
     }

    const deleteQuery = 'DELETE FROM portfolio WHERE crypto_id = $1 AND user_id = $2';
    const deleteResult = await client.query(deleteQuery, [crypto_id, user_id]);
    
    await client.query('COMMIT');
    return deleteResult.rowCount;
    
  } catch (error) {
    await client.query('ROLLBACK');
    return false;
  } finally {
    client.release();
  }
}
