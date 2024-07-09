import express, { type Express } from "express";
import mainRoute from "./routes/mainRoute";
import { initDatabase } from "./db/connection";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app: Express = express();
const port = process.env.SERVER_PORT;
app.use(express.json());
app.use(cors());

app.use("/", mainRoute);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "Hacker?",
  });
});

app.listen(port, () => {
  initDatabase();
  console.log(`Server is running on port ${port}`);
});
