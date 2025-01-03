import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY;
const app = express();
const port = process.env.PORT || 3000; // Use Vercel's dynamic port
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.render("index.ejs", { errorMessage: undefined });
    }

    const response = await axios.get(`${apiURL}&q=${city}&appid=${apiKey}`);
    const data = response.data;

    let weatherIcon;
    switch (data.weather[0].main) {
      case "Clouds":
        weatherIcon = "images/cloudy.png";
        break;
      case "Clear":
        weatherIcon = "images/clear.png";
        break;
      case "Rain":
        weatherIcon = "images/rain.png";
        break;
      case "Snow":
        weatherIcon = "images/snowing.png";
        break;
      case "Fog":
        weatherIcon = "images/fog.png";
        break;
      default:
        weatherIcon = "images/default.png";
    }

    res.render("index.ejs", {
      city: data.name,
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      weatherIcon: weatherIcon,
      errorMessage: undefined,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);

    let errorMessage =
      error.response && error.response.status === 404
        ? "City not found. Please enter a valid city name."
        : "Error fetching weather data. Please try again later.";

    res.render("index.ejs", { errorMessage: errorMessage });
  }
});

app.use((req, res) => {
  res.status(404).send("404: Page Not Found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
