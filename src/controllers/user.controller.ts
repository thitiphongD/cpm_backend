import { Request, Response } from "express";
import pool from '../db/connection'

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    console.log(username, password);
    
    try {
        const query = {
            text: 'SELECT * FROM users WHERE username = $1 AND password = $2',
            values: [username, password],
        };

        const result = await pool.query(query);
        if (result.rows.length > 0) {
            // Authentication successful
            res.status(200).json({ message: 'Login successful' });
        } else {
            // Authentication failed
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json({
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch users",
        });
    }
};
