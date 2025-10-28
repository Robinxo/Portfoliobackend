import express from "express";
import connectDB from "./Database.js";

const app = express();
const port = 3000;

connectDB();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

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

const ipreq = async (req) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  return ip;
};

app.get("/", async (req, res) => {
  const ip = ipreq(req);
  try {
    const location = await fetch(`http://ipwho.is/${ip}`).then((r) => r.json());
    const lat = location.latitude;
    const long = location.longitude;
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`,
    ).then((r) => r.json());
    const current = weather.current_weather?.weathercode;
    const actual = simplifyWeather(current);
    res.json({ message: "yahallo", ip, actual });
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
