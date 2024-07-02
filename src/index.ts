import express from "express";
import mainRoute from "./routes/mainRoute";

const app = express();
const port = 8080;

app.use("/", mainRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
