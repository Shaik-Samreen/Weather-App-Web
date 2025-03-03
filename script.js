const apiKey = "ce8771886c13c040cedb9eebffebb891"; 

document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    if (city) {
        fetchWeather(city);
    }
});

document.getElementById("location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                alert("Geolocation permission denied. Please enter a city manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherUI(data);
        } else {
            alert("City not found!");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherUI(data);
        } else {
            alert("Location not found!");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function updateWeatherUI(data) {
    document.getElementById("weather-info").classList.remove("hidden");
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("weather-description").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = data.main.temp;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind-speed").textContent = data.wind.speed;

    // Store temperature in Celsius for conversion
    document.getElementById("temperature").dataset.celsius = data.main.temp;
    document.getElementById("temperature").dataset.fahrenheit = (data.main.temp * 9/5 + 32).toFixed(2);

    // Reset temperature unit to Celsius
    document.getElementById("temp-unit").textContent = "°C";
    document.getElementById("toggle-unit").textContent = "Convert to °F";
}

document.getElementById("toggle-unit").addEventListener("click", () => {
    const tempElement = document.getElementById("temperature");
    const tempUnitElement = document.getElementById("temp-unit");
    const toggleBtn = document.getElementById("toggle-unit");

    if (tempUnitElement.textContent === "°C") {
        tempElement.textContent = tempElement.dataset.fahrenheit;
        tempUnitElement.textContent = "°F";
        toggleBtn.textContent = "Convert to °C";
    } else {
        tempElement.textContent = tempElement.dataset.celsius;
        tempUnitElement.textContent = "°C";
        toggleBtn.textContent = "Convert to °F";
    }
});