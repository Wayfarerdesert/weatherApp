import axios from "axios";

export function getWeather(lat, lon, timezone) {
    return axios.get("https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,cloud_cover&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,sunrise,sunset&timeformat=unixtime&current=is_day", {
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
        },
    }
    ).then(({ data }) => {
        // return data
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data),
        }
    })
}

function parseCurrentWeather({ current, daily }) {
    const {
        apparent_temperature: currentTemp,
        wind_speed_10m: windSpeed,
        weather_code: iconCode,
        relative_humidity_2m: humidity,
        cloud_cover: cloudCover
    } = current

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFL],
        apparent_temperature_min: [minFL],
        precipitation_sum: [precip],
        sunrise: [sunrise],
        sunset: [sunset]
    } = daily

    return {
        currentTemp: currentTemp,
        cloudCover: cloudCover,
        humidity: humidity,
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        hightFL: Math.round(maxFL),
        lowFL: Math.round(minFL),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        sunrise: sunrise,
        sunset: sunset,
        iconCode,
    }
}

function parseDailyWeather({ daily, hourly }) {
    return daily.time.map((time, index) => {
        const dayHourlyHumidity = hourly.relative_humidity_2m.slice(index * 24, (index + 1) * 24);
        return {
            timestamp: time * 1000,
            iconCode: daily.weather_code[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            humidity: Math.max(...dayHourlyHumidity),
        }
    })
}

function parseHourlyWeather({ hourly, current }) {
    return hourly.time.map((time, index) => {
        // Check if the current index is a multiple of 3
        if (index % 3 === 0) {
            return {
                timestamp: time * 1000,
                iconCode: hourly.weather_code[index],
                temp: Math.round(hourly.temperature_2m[index]),
                humidity: Math.round(hourly.relative_humidity_2m[index]),
                feelsLike: Math.round(hourly.apparent_temperature[index]),
                windSpeed: Math.round(hourly.wind_speed_10m[index]),
                precip: Math.round(hourly.precipitation[index] * 100) / 100,
            };
        } else {
            return null; // Skip this entry if not a multiple of 3
        }
    }).filter(Boolean) // Filter out null entries
        .filter(({ timestamp }) => timestamp >= current.time * 1000);
}
