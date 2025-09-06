const WEATHER_API_KEY = "6164f47729434b4dca9bbb9baa5e2472";
const CITY = "Kerala";

const alarmSound = document.getElementById("alarmSound");
const statusText = document.getElementById("status");
const infoBox = document.getElementById("info");
const weatherText = document.getElementById("weather");
const quoteText = document.getElementById("quote");
const ampmSelect = document.getElementById("ampm");
const ampmDisplay = document.getElementById("ampmDisplay");

// Show selected AM/PM under the dropdown
ampmDisplay.textContent = ampmSelect.value;
ampmSelect.addEventListener("change", () => {
  ampmDisplay.textContent = ampmSelect.value;
});

let alarmTime = null;
let alarmSet = false;

// Unlock audio and set alarm
document.getElementById("setAlarmBtn").addEventListener("click", () => {
  const hour = parseInt(document.getElementById("alarmHour").value);
  const minute = parseInt(document.getElementById("alarmMinute").value);
  const ampm = ampmSelect.value;

  if (isNaN(hour) || isNaN(minute) || hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    alert("Please enter a valid time!");
    return;
  }

  alarmTime = `${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")} ${ampm}`;
  alarmSet = true;
  statusText.textContent = `Alarm set for ${alarmTime}`;

  // Unlock audio for mobile
  alarmSound.play().then(()=>{ 
      alarmSound.pause(); 
      alarmSound.currentTime = 0; 
  }).catch(err=>console.log("Audio unlock failed:", err));
});

// Stop alarm
document.getElementById("stopAlarmBtn").addEventListener("click", () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  statusText.textContent = "Alarm stopped!";
});

// Check alarm every second
setInterval(() => {
  if (!alarmSet) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const currentAMPM = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const currentTime = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")} ${currentAMPM}`;

  if (currentTime === alarmTime) {
    ringAlarm();
    alarmSet = false;
  }
}, 1000);

// Ring alarm
function ringAlarm() {
  statusText.textContent = "⏰ Alarm ringing!";
  alarmSound.loop = true;
  alarmSound.play();
  infoBox.classList.remove("hidden");
  fetchWeather();
  fetchQuote();
}

// Fetch weather
async function fetchWeather(){
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    weatherText.textContent = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
  } catch {
    weatherText.textContent = "Could not fetch weather 😢";
  }
}

// Fetch quote
async function fetchQuote(){
  try {
    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
    if(!res.ok) throw new Error("Quote fetch failed");
    const data = await res.json();
    const parsed = JSON.parse(data.contents);
    quoteText.textContent = `"${parsed[0].q}" — ${parsed[0].a}`;
  } catch {
    quoteText.textContent = "Could not fetch quote 😢";
  }
}

// Load a quote immediately
fetchQuote();
