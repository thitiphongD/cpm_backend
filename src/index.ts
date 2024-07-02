import express from "express";
import mainRoute from "./routes/mainRoute";

const app = express();
const port = 8080;

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
