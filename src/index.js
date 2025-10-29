import express from "express";
import connectDB from "./Database.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3000;

connectDB();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

function simplifyWeather(code) {
  if ([0].includes(code)) return "Sunny";
  if ([1, 2].includes(code)) return "Partly Cloudy";
  if ([3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57, 66, 67].includes(code)) return "Freezing Rain";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Stormy";
  return "Unknown";
}

const Data = mongoose.model(
  "dataSave",
  new mongoose.Schema(
    {
      ip: { type: String, unique: true },
      actual: String,
      city: String,
    },
    { timestamps: true },
  ),
);

app.get("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

  try {
    const location = await fetch(`http://ipwho.is/${ip}`).then((r) => r.json());
    const lat = location.latitude;
    const long = location.longitude;
    const city = location.city;

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`,
    ).then((r) => r.json());
    const current = weather.current_weather?.weathercode;
    const actual = simplifyWeather(current);

    const visitedUser = await Data.findOne({ ip });

    if (visitedUser) {
      return res.json({ message: "yahallo", ip, actual, city });
    }

    const doc = new Data({ ip, actual, city });
    await doc.save();
    console.log("✅ Data saved:", doc);

    res.json({ message: "yahallo", ip, actual, city });
  } catch (error) {
    console.error("❌ Error in / route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
