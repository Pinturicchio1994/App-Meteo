const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const localTimeElement = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const favBtn = document.getElementById('fav-btn');
const favoritesList = document.getElementById('favorites-list');

const apiKey = 'efd983e3c7bd6d3db72c0cfb78fd8660'; 

let favorites = [];

function getCityTime(timezoneOffsetInSeconds) {
    const d = new Date();
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
    const cityDate = new Date(utcTime + (timezoneOffsetInSeconds * 1000));
    const hours = String(cityDate.getHours()).padStart(2, '0');
    const minutes = String(cityDate.getMinutes()).padStart(2, '0');
    return `Ora locale: ${hours}:${minutes}`;
}

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Città non trovata");
        }

        const data = await response.json();
        
        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        localTimeElement.textContent = getCityTime(data.timezone);
        
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // SFONDO PIÙ CHIARO E VIVIDO (rgba modificato a 0.35)
        document.body.style.backgroundImage = `linear-gradient(135deg, rgba(15, 32, 39, 0.35), rgba(44, 83, 100, 0.35)), url('https://picsum.photos/1600/900?random=${data.name}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        weatherCard.classList.remove('hidden');

    } catch (error) {
        alert(error.message);
    }
}

function removeFavorite(cityToRemove) {
    favorites = favorites.filter(city => city !== cityToRemove);
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(city => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = city;
        nameSpan.addEventListener('click', () => {
            getWeather(city);
            cityInput.value = city; 
        });

        const removeSpan = document.createElement('span');
        removeSpan.textContent = "×";
        removeSpan.className = "remove-btn";
        removeSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(city);
        });

        li.appendChild(nameSpan);
        li.appendChild(removeSpan);
        favoritesList.appendChild(li);
    });
}

function loadFavorites() {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        renderFavorites(); 
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city === "") {
        alert("Per favore, inserisci il nome di una città!");
        return;
    }
    getWeather(city);
});

favBtn.addEventListener('click', () => {
    const currentCity = cityName.textContent;

    if (!favorites.includes(currentCity)) {
        favorites.push(currentCity); 
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        renderFavorites();
    } else {
        alert("Questa città è già nei tuoi preferiti!");
    }
});

loadFavorites();