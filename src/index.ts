import express from "express";
import mainRoute from "./routes/mainRoute";
import { initDatabase } from "./db";
import cors from 'cors';

const app = express();
initDatabase();
const port = 8080;
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
  console.log(`Server is running on port ${port}`);
});
