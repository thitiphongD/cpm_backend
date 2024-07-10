import express, { type Express, type Request, type Response, type NextFunction } from "express";
import mainRoute from "./routes/mainRoute";
import { initDatabase } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
import { notFound } from "./helpers/Response";
dotenv.config();
const app: Express = express();
const port = process.env.SERVER_PORT;
app.use(express.json());
app.use(cors());

app.use("/", mainRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  notFound(res)
});

app.listen(port, () => {
  initDatabase();
  console.log(`Server is running on port ${port}`);
});
