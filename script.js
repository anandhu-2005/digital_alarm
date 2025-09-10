const WEATHER_API_KEY = "6164f47729434b4dca9bbb9baa5e2472";
const CITY = "Kerala";

const alarmSound = document.getElementById("alarmSound");
const statusText = document.getElementById("status");
const infoBox = document.getElementById("info");
const weatherText = document.getElementById("weather");
const quoteText = document.getElementById("quote");
const ampmSelect = document.getElementById("ampm");
const ampmDisplay = document.getElementById("ampmDisplay");

// Live AM/PM display
ampmDisplay.textContent = ampmSelect.value;
ampmSelect.addEventListener("change", () => {
  ampmDisplay.textContent = ampmSelect.value;
});

let alarmTime = null;
let alarmSet = false;
let audioUnlocked = false;

// Set Alarm
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

  // Unlock audio on mobile
  if (!audioUnlocked) {
    alarmSound.play().then(() => {
      audioUnlocked = true;
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }).catch(err => console.log("Audio unlock failed:", err));
  }
});

// Stop Alarm
document.getElementById("stopAlarmBtn").addEventListener("click", () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  statusText.textContent = "Alarm stopped!";
});

// Check Alarm every second
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

// Ring Alarm
function ringAlarm() {
  statusText.textContent = "⏰ Alarm ringing!";
  alarmSound.loop = true;
  alarmSound.play();
  infoBox.classList.remove("hidden");

  fetchWeather();
  fetchQuote();
  fetchSpotifySong(); // 🎵 Spotify added
}

// Fetch Weather
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

// Fetch Quote (fixed for mobile)
async function fetchQuote(){
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    if(!res.ok) throw new Error("Quote fetch failed");
    const data = await res.json();
    quoteText.textContent = `"${data[0].q}" — ${data[0].a}`;
  } catch (err) {
    console.log(err);
    quoteText.textContent = "Could not fetch quote 😢";
  }
}


// Spotify Songs (Track IDs from Spotify)
const spotifyTracks = [
  "4uLU6hMCjMI75M1A2tKUQC", // Eminem - Lose Yourself
  "0VjIjW4GlUZAMYd2vXMi3b", // The Weeknd - Blinding Lights
  "3tjFYV6RSFtuktYl3ZtYcq", // Lewis Capaldi - Someone You Loved
  "2XU0oxnq2qxCpomAAuJY8K", // Dua Lipa - Don't Start Now
  "7ouMYWpwJ422jRcDASZB7P"  // Ed Sheeran - Shape of You
];

function fetchSpotifySong(){
  const randomTrack = spotifyTracks[Math.floor(Math.random() * spotifyTracks.length)];
  const embedUrl = `https://open.spotify.com/embed/track/${randomTrack}?utm_source=generator`;
  document.getElementById("spotifyPlayer").innerHTML = `
    <iframe style="border-radius:12px" 
      src="${embedUrl}" 
      width="100%" height="152" frameBorder="0" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy">
    </iframe>`;
}

// Load quote immediately
fetchQuote();
