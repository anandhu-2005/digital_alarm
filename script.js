// Replace with your own OpenWeather API key
const WEATHER_API_KEY = "6164f47729434b4dca9bbb9baa5e2472";
const CITY = "Kerala"; // you can change to your city

const alarmSound = document.getElementById("alarmSound");
const statusText = document.getElementById("status");
const infoBox = document.getElementById("info");
const weatherText = document.getElementById("weather");
const quoteText = document.getElementById("quote");

let alarmTime = null;
let alarmSet = false;

document.getElementById("setAlarmBtn").addEventListener("click", () => {
  const input = document.getElementById("alarmTime").value;
  if (!input) {
    alert("Please select a valid time!");
    return;
  }

  alarmTime = input;
  alarmSet = true;
  statusText.textContent = `Alarm set for ${alarmTime}`;
});

function checkAlarm() {
  if (alarmSet && alarmTime) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // format HH:MM

    if (currentTime === alarmTime) {
      ringAlarm();
      alarmSet = false; // reset
    }
  }
}

function ringAlarm() {
  statusText.textContent = "⏰ Alarm ringing!";
  alarmSound.play();
  fetchWeather();
  fetchQuote();
  infoBox.classList.remove("hidden");
}

// Fetch weather from OpenWeather
async function fetchWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherText.textContent = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
  } catch (err) {
    weatherText.textContent = "Could not fetch weather 😢";
  }
}

// Fetch quote from ZenQuotes using AllOrigins proxy
async function fetchQuote() {
  try {
    const res = await fetch(
      "https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random")
    );
    const data = await res.json();
    const parsed = JSON.parse(data.contents);
    quoteText.textContent = `"${parsed[0].q}" — ${parsed[0].a}`;
  } catch (err) {
    quoteText.textContent = "Could not fetch quote 😢";
  }
}

fetchQuote();

// Check alarm every second
setInterval(checkAlarm, 1000);
