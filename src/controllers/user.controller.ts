import { Request, Response } from "express";
import pool from '../db/connection'

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
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

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password, confirmPassword } = req.body;

    try {
        // Check if username already exists

        if (password !== confirmPassword) {
            res.status(400).json({ error: 'Passwords do not match' });
            return;
        }
        
        const checkQuery = {
            text: 'SELECT * FROM users WHERE username = $1',
            values: [username],
        };
        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.length > 0) {
            // Username already exists
            res.status(400).json({ error: 'Username already exists' });
            return;
        }

        // Insert new user into database
        const insertQuery = {
            text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
            values: [username, password],
        };
        await pool.query(insertQuery);

        // Registration successful
        res.status(201).json({ message: 'User register success' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

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
