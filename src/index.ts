import express from "express";
import mainRoute from "./routes/mainRoute";
import userRoute from "./routes/userRoute";
import bodyParser from 'body-parser'
import { initDatabase } from "./db";
const app = express();
initDatabase();
const port = 8080;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use("/", mainRoute);
app.use("/api", userRoute);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: "Hacker?",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
