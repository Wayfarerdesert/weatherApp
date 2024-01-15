import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
    getWeather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
        .then(renderWeather)
        .catch(e => {
            console.log(e)
            alert("Error getting weather info.")
        })
}

function positionError() {
    alert("There was an error getting your location. Please allow us to use your location and refesh the page.")
}

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(data => {
//     console.log(data)
// })

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
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


// setValue("time", HOUR_FORMATER.format(sunrise.timestamp), { parent: element })

const DAY_FORMATER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const DATE_FORMATER = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp, { parent: element })
        setValue("date", DAY_FORMATER.format(day.timestamp), { parent: element })
        setValue("day", DATE_FORMATER.format(day.timestamp), { parent: element })
        setValue("humidity", day.humidity, { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    });
}

const HOUR_FORMATER = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: false })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element })
        setValue("humidity", hour.humidity, { parent: element })
        setValue("fl-temp", hour.feelsLike, { parent: element })
        setValue("wind", hour.windSpeed, { parent: element })
        setValue("precip", hour.precip, { parent: element })
        setValue("day", DAY_FORMATER.format(hour.timestamp), { parent: element })
        setValue("time", HOUR_FORMATER.format(hour.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    });
}