import { Request, Response } from "express";
import pool from '../db/connection'
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.CMC_API_KEY;

export const coinMarketCapAPI = async (req: Request, res: Response) => {
    const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

    if (!apiKey) {
        console.error('API key not found in env');
        return res.status(500).json({ error: 'API key not found' });
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from CoinMarketCap API');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetch data from CoinMarketCap API:', error);
        res.status(500).json({ error: 'Failed to fetch data from CoinMarketCap API' });
    }
};

export const getCoin = async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log('Requested cryptocurrency ID:', id);

    const apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';

    if (!id) {
        console.error('API key not found in env');
        return res.status(500).json({ error: 'coin not found' });
    }

    if (!apiKey) {
        console.error('API key not found in env');
        return res.status(500).json({ error: 'API key not found' });
    }
    const url = `${apiUrl}?id=${id}`;
    const response = await fetch(url, {
        headers: {
            'X-CMC_PRO_API_KEY': apiKey,
            'Accept': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
}