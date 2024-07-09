import * as dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.HOST;
const SERVER_PORT = process.env.SERVER_PORT;

export const BASE_URL: string = `${HOST}:${SERVER_PORT}`;
