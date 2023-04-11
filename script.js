// Get DOM elements by their IDs
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const input = document.querySelector(".search-bar");
const button = document.querySelector("#search-btn");
console.log(button);
let latValue;
let lonValue;
let cityname;

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
input.addEventListener("change", async () => {
  const cityName = input.value;
  const url = `https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    latValue = data[0].lat;
    lonValue = data[0].lon;
    fetchWeatherData(latValue, lonValue);
  }
});

button.addEventListener("click", async () => {
  cityName = input.value;
  const url = `https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    latValue = data[0].lat;
    lonValue = data[0].lon;
    getWeatherData(latValue, lonValue);
  }
});
// Define arrays for days and months
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// API key for OpenWeatherMap API
const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

let hourIn12HourFormat;
function updateCurrentTime(timezone) {
  // Update time element with new time
  const time = new Date();
  const timeOptions = { hour12: true, timeZone: timezone };
  const hourIn12HourFormat = time.toLocaleString("en-US", timeOptions);
  timeEl.innerHTML = hourIn12HourFormat;
}
function fetchWeatherData(latitude, longitude) {
  // Fetch weather data using OpenWeatherMap API
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      const timezone = data.timezone;
      // Get the current date and time based on the selected city's timezone
      console.log(data.current);
      const time = new Date(data.current.dt * 1000);
      const timeOptions = { hour12: true, timeZone: timezone };
      const dateOptions = {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: timezone,
      };
      const day = time.toLocaleString("en-US", { weekday: "long" });
      const date = new Date(data.current.dt * 1000);
      const hour = time
        .toLocaleString("en-US", timeOptions)
        .split(",")[1]
        .trim()
        .slice(0, -3);
      data.current.day = day;
      data.current.date = date;
      data.current.hour = hour;

      const timeString = data.current.hour;
      const timeParts = timeString.split(":");
      const dateObj = new Date();
      dateObj.setHours(timeParts[0]);
      dateObj.setMinutes(timeParts[1]);
      dateObj.setSeconds(timeParts[2]);
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      console.log(formattedTime);
      const dates = new Date(data.current.dt * 1000);
      const dateString = dates.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      timeEl.innerHTML = formattedTime;
      dateEl.innerHTML = dateString;

      showWeatherData(data);
    });
}

// Get weather data using navigator.geolocation.getCurrentPosition() and OpenWeatherMap API
getWeatherData();
function getWeatherData(latitude, longitude) {
  if (!latitude || !longitude) {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;
      fetchWeatherData(latitude, longitude);
    });
  } else {
    fetchWeatherData(latitude, longitude);
    updateCurrentTime();
  }
}
// Update the page with weather data
function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  console.log(data);

  // Update timezone and country elements with weather data
  if (input.value) {
    timezone.innerHTML = capitalizeWords(input.value);
  } else {
    timezone.innerHTML = data.timezone;
  }
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";

  // Update currentWeatherItemsEl with weather data
  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    
    
    `;
  // create an empty string variable to store the forecast HTML for each day
  let otherDayForcast = "";
  // loop through each day in the daily weather data
  data.daily.forEach((day, idx) => {
    // if this is the first day in the loop (today's weather), update the current temperature HTML element
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    } else {
      // if this is not the first day in the loop, add the forecast HTML to the otherDayForcast variable
      otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
    }
  }),
    // set the HTML content of the weather forecast element to the otherDayForcast variable
    (weatherForecastEl.innerHTML = otherDayForcast);
}
