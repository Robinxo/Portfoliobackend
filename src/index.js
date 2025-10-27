import express from "express";
import connectDB from "./Database.js";

const app = express();
const port = 3000;

connectDB();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  res.json({ message: "WORK PWEASE", ip });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
