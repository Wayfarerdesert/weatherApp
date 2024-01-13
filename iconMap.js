export const ICON_MAP = new Map()

addMapping([0, 1], "sun")
addMapping([2], "cloud-sun")
addMapping([3], "cloud")
addMapping([45, 48], "smog")
addMapping([51, 53, 55], "cloud-meatball")
addMapping(
    [56, 57, 66, 67, 80, 81, 82],
    "cloud-showers-heavy"
)
addMapping([61, 63, 65], "cloud-rain")
addMapping([71, 73, 75, 77, 85, 86], "snowflake")
addMapping([85, 86], "cloud-meatball")
addMapping([95, 96, 99], "cloud-bolt")

function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP.set(value, icon)
    });
}