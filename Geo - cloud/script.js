// ** IMPORTANT: Get your free API key from a service like OpenWeatherMap
const apiKey = "3f3e6e4048338cb67f15b163c4aa8cf1";
// Using the 'weather' endpoint for current data, which includes 'timezone' offset
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&'; 

// Get DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherContent = document.getElementById('weather-content');
const errorMsg = document.getElementById('error-msg');

const locationName = document.getElementById('location-name');
const currentDateTime = document.getElementById('current-datetime');
const weatherIconImg = document.getElementById('weather-icon-img');
const temperatureDisplay = document.getElementById('temperature-display');
const weatherDescription = document.getElementById('weather-description');
const windSpeedDisplay = document.getElementById('wind-speed-display');
const humidityDisplay = document.getElementById('humidity-display');
const cloudinessDisplay = document.getElementById('cloudiness-display');

/**
 * Converts a UTC time (in milliseconds) and a timezone offset (in seconds) 
 * to a localized date and time string for the target location.
 * @param {number} utcTime - The current UTC time in milliseconds.
 * @param {number} timezoneOffset - The timezone offset in seconds (from the API).
 * @returns {string} The formatted local date and time string.
 */
function getLocalTime(utcTime, timezoneOffset) {
    // Convert API offset (seconds) to minutes
    const offsetInMinutes = timezoneOffset / 60;
    
    // Create a new Date object from the UTC time
    const localDate = new Date(utcTime + (offsetInMinutes * 60 * 1000));

    // Format the date/time string
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true // e.g., 03:30 PM
    };
    
    // We use UTC string formatting to prevent the browser's local timezone from interfering
    return localDate.toLocaleString('en-US', {...options, timeZone: 'UTC' });
}

/**
 * Fetches and displays weather data for a given city.
 * @param {string} city - The name of the city to search for.
 */
async function checkWeather(city) {
    // Hide previous displays
    weatherContent.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
        const response = await fetch(apiUrl + `q=${city}` + `&appid=${apiKey}`);

        if (response.status == 404) {
            errorMsg.style.display = 'block';
            return;
        }

        const data = await response.json();
        
        // --- 1. HANDLE DATE & TIME ---
        const utcTime = new Date().getTime(); // Current time in your location
        const timezoneOffset = data.timezone; // Offset for the searched location
        currentDateTime.innerHTML = getLocalTime(utcTime, timezoneOffset);


        // --- 2. UPDATE WEATHER DATA ---
        
        // Location 
        const fullLocation = `${data.name}, ${data.sys.country}`;
        locationName.innerHTML = fullLocation;
        
        // Main Info
        temperatureDisplay.innerHTML = `${Math.round(data.main.temp)}°C`;
        weatherDescription.innerHTML = data.weather[0].description;
        
        // Details Grid
        windSpeedDisplay.innerHTML = `${data.wind.speed.toFixed(1)} m/s`;
        humidityDisplay.innerHTML = `${data.main.humidity}%`;
        cloudinessDisplay.innerHTML = `${data.clouds.all}%`;

        // Weather Icon (You should host a default image, but using OpenWeatherMap's icon URL here)
        const iconCode = data.weather[0].icon;
        weatherIconImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        weatherIconImg.alt = data.weather[0].main;
        
        weatherContent.style.display = 'block';

    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> An error occurred while fetching data.`;
        errorMsg.style.display = 'block';
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        checkWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Initial load (you can remove this if you prefer a blank start)
// checkWeather("London");