import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(data => {
//     console.log(data)
// })

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch(e => {
        console.log(e)
        alert("Error getting weather info.")
    })

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    // renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-high", current.hightFL)
    setValue("current-fl-low", current.lowFL)
    setValue("current-wind", current.windSpeed)
    setValue("current-precip", current.precip)
}

const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    // daily.forEach(day => {
    //     const element = dayCardTemplate.contentEditable.cloneNode(true)
    // });
}