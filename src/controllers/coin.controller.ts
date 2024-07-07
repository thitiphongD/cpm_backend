import { Request, Response } from "express";
import dotenv from "dotenv";
import { PortfolioData } from "./user.controller";
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

        const result = await response.json();

        res.json(result);
    } catch (error) {
        console.error('Error fetch data from CoinMarketCap API:', error);
        res.status(500).json({ error: 'Failed to fetch data from CoinMarketCap API' });
    }
};

export const coinList = async (req: Request, res: Response) => {
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

        const result = await response.json();
        const coinData = result.data.map((row: any) => {
            return {
                id: row.id,
                name: row.name,
                symbol: row.symbol,
            };
        });

        res.status(200).json({
            data: coinData
        })
    } catch (error) {
        console.error('Error fetch data from CoinMarketCap API:', error);
        res.status(500).json({ error: 'Failed to fetch data from CoinMarketCap API' });
    }
};

export const getCoin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info';

    if (!id) {
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


export const getCoinsByUser = async (req: Request, res: Response) => {
    const { ids } = req.params;
    const apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';

    if (!apiKey) {
        console.error('API key not found in env');
        return res.status(500).json({ error: 'API key not found' });
    }

    const url = `${apiUrl}?id=${ids}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Failed to fetch data: ${errorData.status?.error_message || 'Unknown error'}`);
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
};