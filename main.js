"use strict";
const weatherContainer = document.querySelector(".weather");
const nameCity = document.querySelector(".city");
const searchInput = document.querySelector(".search__bar");
const searchBtn = document.querySelector(".search__btn");
const temp = document.querySelector(".temp");
const iconWeather = document.querySelector(".icon");
const weatherDescription = document.querySelector(".description");
const weatherHumidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind");
const errorMessage = document.querySelector(".error_message");
const apiKey = "9ce00bdfa13342d3aef105257230508";

function fetchWeather(city) {
  clearWeatherContainer();
  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      nameCity.innerText = `${data.location.name}, ${data.location.country}`;
      const tempCelsius = data.current.temp_c;
      const tempFahrenheit = data.current.temp_f;
      temp.innerText = `${tempCelsius} °C`;
      createConversionButton(tempCelsius, tempFahrenheit);

      iconWeather.src = `https:${data.current.condition.icon}`;
      weatherDescription.innerText = data.current.condition.text;
      iconWeather.style.visibility = "visible";
      weatherHumidity.innerText = `Humidity: ${data.current.humidity}%`;
      windSpeed.innerText = `Wind speed: ${data.current.wind_kph} km/h`;
      document.body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${city})`;
    })
    .catch((error) => {
      console.error(error);
      showError("Oops! No matching location found. Please try again.");
      if (btnConvert) {
        btnConvert.remove();
        btnConvert = null;
      }
    });
}

let btnConvert = null;

function createConversionButton(tempCelsius, tempFahrenheit) {
  if (!btnConvert) {
    btnConvert = document.createElement("button");
    btnConvert.classList.add("convert-btn");
    btnConvert.innerText = "Convert to Fahrenheit";
    let isFahrenheit = false;

    btnConvert.addEventListener("click", () => {
      if (isFahrenheit) {
        temp.innerText = `${tempCelsius} °C`;
        btnConvert.innerText = "Convert to Fahrenheit";
        isFahrenheit = false;
      } else {
        temp.innerText = `${tempFahrenheit} °F`;
        btnConvert.innerText = "Convert to Celsius";
        isFahrenheit = true;
      }
    });

    temp.insertAdjacentElement("afterend", btnConvert);
  }
}

function showError(message) {
  errorMessage.innerText = message;
  errorMessage.style.display = "block";
}

function clearWeatherContainer() {
  nameCity.innerText = "";
  temp.innerText = "";
  iconWeather.src = "";
  iconWeather.style.visibility = "hidden";
  weatherDescription.innerText = "";
  weatherHumidity.innerText = "";
  windSpeed.innerText = "";
  document.body.style.backgroundImage = `url("https://source.unsplash.com/1600x900/?landscape")`;
  errorMessage.style.display = "none";
}

searchBtn.addEventListener("click", () => {
  fetchWeather(searchInput.value);
  searchInput.value = "";
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchWeather(searchInput.value);
    searchInput.value = "";
  }
});
