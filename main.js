import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

let lat;
let lon;
let locations;

// ==============================================================
// ==============================================================

const apiKey = '221cd05a32243b58e1861dc190b7e406';

const userLocationContainer = document.querySelector("[data-location-container]")
const userLocation = document.querySelector("[data-location]")
const searchInput = document.querySelector("[data-search")

searchInput.addEventListener('input', handleInput);

// Function to obtain locations from the API, according to user input
function handleInput() {
    const location = searchInput.value.toLowerCase();

    if (!location) {
        // Clear the list if the input is empty
        userLocationContainer.innerHTML = '';
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            userLocationContainer.innerHTML = ''; // Clear previous results
            locations = data.map(placeData => {
                const place = userLocation.content.cloneNode(true).children[0];
                const city = place.querySelector("[data-city]");
                const country = place.querySelector("[data-country]");
                city.textContent = placeData.name;
                country.textContent = placeData.country;

                const { lat, lon } = placeData;
                // console.log(lat, lon)

                userLocationContainer.append(place);

                return { city: placeData.name, country: placeData.country, element: place, lat, lon };
            });
            // console.log(locations);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to obtain name, country, latitude and longitude of the city chosen by the user
function handleLocation(event) {
    const clickedElement = event.target.closest('.mainPlace-template');
    // userLocation.innerHTML = '';
    if (clickedElement) {
        // Remove all results except the clicked one
        const resultsContainer = document.querySelector('.locations[data-location-container]');
        resultsContainer.innerHTML = ''; // Clear all results

        // Replace the class of the clicked element
        clickedElement.classList.remove('mainPlace-template');
        clickedElement.classList.add('mainPlace');

        // Append only the clicked element back to the container
        resultsContainer.appendChild(clickedElement);

        // Get the values from the clicked element
        const city = clickedElement.querySelector("[data-city]").textContent;
        const country = clickedElement.querySelector("[data-country]").textContent;

        // Extract lat and lon from the corresponding array
        const { lat: extractedLat, lon: extractedLon } = locations.find(location => location.element === clickedElement);

        // Update global variables with lat and lon
        lat = extractedLat;
        lon = extractedLon;

        // Clear the input value
        if (searchInput) {
            searchInput.value = '';
        }

        console.log({ city, country, lat, lon });

        // Update the weather information by calling getWeather again
        updateWeather();
    }
}

// This function updates the weather information on the page based on the current latitude and longitude values.
function updateWeather() {
    // Call the getWeather function with current latitude, longitude, and time zone
    getWeather(lat, lon, Intl.DateTimeFormat().resolvedOptions().timeZone)
        // If the weather data is successfully fetched, render it on the page
        .then(renderWeather)
        // If there is an error during the process, log the error and show an alert
        .catch(e => {
            console.log(e)
            alert("Error getting weather info.", e)
        })
}

// Retrieves the user's geolocation coordinates (latitude and longitude) using the Geolocation API.
function getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Update global variables with the user's coordinates
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                // Trigger a refresh of weather information
                updateWeather();
            },
            error => {
                console.error("Error getting location: ", error);
                alert("There was an error getting your location.\nPlease allow us to use your location and refresh the page.\nor type your desired location in the search bar")
            }
        )
    } else {
        console.error("Geolocation is not supported by this browser");
    }
}

// Attach the click event listener to the userLocationContainer
userLocationContainer.addEventListener('click', handleLocation);

getGeoLocation()

// ==============================================================
// ==============================================================

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    var elements = document.querySelectorAll('.blurred');

    elements.forEach(function (element) {
        element.classList.remove('blurred');
    });
}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const DAY_LIGHT = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })
const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-cloud-cover", current.cloudCover)
    setValue("current-humidity", current.humidity)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-high", current.hightFL)
    setValue("current-fl-low", current.lowFL)
    setValue("current-wind", current.windSpeed)
    setValue("current-precip", current.precip)
    setValue("current-sunrise", DAY_LIGHT.format(new Date(current.sunrise * 1000)))
    setValue("current-sunset", DAY_LIGHT.format(new Date(current.sunset * 1000)))
}

// function to return date in format dd/mm/YYYY
function formatDayMonthYear(date) {
    const dayFormatter = new Intl.DateTimeFormat(undefined, { day: "2-digit" });
    const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "2-digit" });
    const yearFormatter = new Intl.DateTimeFormat(undefined, { year: "numeric" });

    const day = dayFormatter.format(date);
    const month = monthFormatter.format(date);
    const year = yearFormatter.format(date);

    return `${day}.${month}.${year}`;
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp, { parent: element })
        setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })

        const formattedDate = formatDayMonthYear(day.timestamp);
        setValue("day", formattedDate, { parent: element });
        setValue("humidity", day.humidity, { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    });
}


const DAY_FORMATTER_ROW = new Intl.DateTimeFormat(undefined, { weekday: "short" })
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: false })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = "";
    let currentBgClass = "hour-row";
    let currentDate = null;

    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        const formattedDate = formatDayMonthYear(hour.timestamp);

        // Check if the date has changed
        if (formattedDate !== currentDate) {
            // Update the current background class for the new day
            currentBgClass = (currentBgClass === "hour-row-day") ? "hour-row" : "hour-row-day";
            currentDate = formattedDate;
        }

        setValue("temp", hour.temp, { parent: element });
        setValue("humidity", hour.humidity, { parent: element });
        setValue("fl-temp", hour.feelsLike, { parent: element });
        setValue("wind", hour.windSpeed, { parent: element });
        setValue("precip", hour.precip, { parent: element });
        setValue("date", DAY_FORMATTER_ROW.format(hour.timestamp), { parent: element });
        setValue("day", formattedDate, { parent: element });
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });

        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
        element.querySelector(".hour-row").classList.add(currentBgClass);

        hourlySection.append(element)
    });
}
