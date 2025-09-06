const WEATHER_API_KEY = "6164f47729434b4dca9bbb9baa5e2472"; // OpenWeather API key
const CITY = "Kerala"; // Change city

const alarmSound = document.getElementById("alarmSound");
const statusText = document.getElementById("status");
const infoBox = document.getElementById("info");
const weatherText = document.getElementById("weather");
const quoteText = document.getElementById("quote");

let alarmTime = null;
let alarmSet = false;

// Unlock audio for mobile
document.getElementById("setAlarmBtn").addEventListener("click", () => {
  const input = document.getElementById("alarmTime").value;
  if (!input) {
    alert("Please select a valid time!");
    return;
  }

  alarmTime = input;
  alarmSet = true;
  statusText.textContent = `Alarm set for ${alarmTime}`;

  // Attempt to play audio to comply with mobile browser restrictions
  alarmSound.play().catch(error => {
    console.log("Audio play failed:", error);
  });
});


// Check alarm every second
setInterval(() => {
  if (alarmSet && alarmTime) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    if (currentTime === alarmTime) {
      ringAlarm();
      alarmSet = false; // reset
    }
  }
}, 1000);

// Ring alarm
function ringAlarm() {
  statusText.textContent = "⏰ Alarm ringing!";
  alarmSound.play();
  infoBox.classList.remove("hidden");
  fetchWeather();
  fetchQuote();
}

// Fetch weather from OpenWeather
async function fetchWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const data = await res.json();
    weatherText.textContent = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
  } catch (err) {
    weatherText.textContent = "Could not fetch weather 😢";
    console.error("Weather fetch error:", err);
  }
}

async function fetchQuote() {
  try {
    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
    if (!res.ok) throw new Error("Failed to fetch quote");
    const data = await res.json();
    const parsed = JSON.parse(data.contents);
    quoteText.textContent = `"${parsed[0].q}" — ${parsed[0].a}`;
  } catch (err) {
    quoteText.textContent = "Could not fetch quote 😢";
    console.error("Quote fetch error:", err);
  }
}


// Load a quote immediately on page load
fetchQuote();
