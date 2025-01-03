// Import necessary packages and modules
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Retrieve API key from environment variables
const apiKey = process.env.OPENWEATHER_API_KEY;

// Create an Express application
const app = express();
const port = 3000;
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

// Set up static files and body parser middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Handle GET requests to the root ("/") route
app.get("/", async (req, res) => {
  try {
    // Extract the city from the query parameter
    const city = req.query.city;

    // Check if the city is not provided
    if (!city) {
      // Render the view with no error message
      return res.render("index.ejs", {
        errorMessage: undefined,
      });
    }

    // Make an API request to OpenWeatherMap
    const response = await axios.get(`${apiURL}&q=${city}&appid=${apiKey}`);
    const data = response.data;

    // Determine the weather icon based on weather conditions
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
        weatherIcon = "images/default.png"; // Default image for unknown conditions
    }

    // Render the view with weather data and no error message
    res.render("index.ejs", {
      city: data.name,
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      weatherIcon: weatherIcon,
      errorMessage: undefined,
    });
  } catch (error) {
    // Handle errors during the API request
    console.error("Error fetching weather data:", error);

    // Determine and set the appropriate error message
    let errorMessage;
    if (error.response && error.response.status === 404) {
      errorMessage = "City not found. Please enter a valid city name.";
    } else {
      errorMessage = "Error fetching weather data. Please try again later.";
    }

    // Render the view with the error message
    res.render("index.ejs", {
      errorMessage: errorMessage,
    });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
