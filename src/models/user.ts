import { Pool, QueryResult, QueryResultRow } from 'pg';
import pool from '../db/connection';

interface User {
    id: number;
    username: string;
    password: string;
}

async function query<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    const client = await pool.connect();
    try {
        const start = Date.now();
        const result = await client.query<T>(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        client.release();
    }
}

export async function findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users');
    return result.rows;
}

export async function findById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function findByUsername(username: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
}

export async function create(username: string, password: string): Promise<User> {
    const result = await query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, password]
    );
    return result.rows[0];
}

export async function update(id: number, data: Partial<User>): Promise<User | null> {
    const keys = Object.keys(data);
    const setString = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = Object.values(data);

    const result = await query(
        `UPDATE users SET ${setString} WHERE id = $1 RETURNING *`,
        [id, ...values]
    );
    return result.rows[0] || null;
}

// export async function remove(id: number): Promise<boolean> {
//     const result = await query('DELETE FROM users WHERE id = $1', [id]);
//     return result.rowCount > 0;
// }