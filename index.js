import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;
const app = express();
const port = 3000;
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const city = req.query.city;
    // Check if the city is not provided
    if (!city) {
      return res.render("index.ejs", {
        errorMessage: undefined,
      });
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
        weatherIcon = "images/default.png"; // Default image for unknown conditions
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

    let errorMessage;
    if (error.response && error.response.status === 404) {
      errorMessage = "City not found. Please enter a valid city name.";
    } else {
      errorMessage = "Error fetching weather data. Please try again later.";
    }

    res.render("index.ejs", {
      errorMessage: errorMessage,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// const apiKey = "3534bb8e7c749b354c4d78a76a2b94bd";
// const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=pretoria";

// const searchBox = document.querySelector(".search input");
// const searchBtn = document.querySelector(".search button");
// const weatherIcon = document.querySelector(".weather-icon");

// async function checkWeather(city) {
//   const response = await fetch(`${apiURL}&q=${city}&appid=${apiKey}`);
//   const data = await response.json();

//   console.log(data);

//   document.querySelector(".city").innerHTML = data.name;
//   document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
//   document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
//   document.querySelector(".wind").innerHTML = data.wind.speed + "Km/h";

//   if (data.weather[0].main == "Clouds") {
//     weatherIcon.src = "images/cloudy.png";
//   }
//   else if (data.weather[0].main == "Clear") {
//     weatherIcon.src = "images/clear.png";
//   }
//   else if (data.weather[0].main == "Rain") {
//     weatherIcon.src = "images/rain.png";
//   }
//   else if (data.weather[0].main == "Thunder") {
//     weatherIcon.src = "images/thunder.png";
//   }
//   else if (data.weather[0].main == "Fog") {
//     weatherIcon.src = "images/fog.png";
//   }
// }


// searchBtn.addEventListener("click", ()=>{
//   checkWeather(searchBox.value);
// })
