// Weather icon mappings for different conditions during the day
export const ICON_MAP = new Map();

// Add mappings for various weather conditions during the day
addMapping(ICON_MAP, [0, 1], "sun");
addMapping(ICON_MAP, [2], "cloud-sun");
addMapping(ICON_MAP, [61, 63, 65], "cloud-rain");

addMapping(ICON_MAP, [3], "cloud");
addMapping(ICON_MAP, [45, 48], "smog");
addMapping(ICON_MAP, [51, 53, 55], "cloud-meatball");
addMapping(ICON_MAP, [56, 57, 66, 67, 80, 81, 82], "cloud-showers-heavy");
addMapping(ICON_MAP, [71, 73, 75, 77, 85, 86], "snowflake");
addMapping(ICON_MAP, [85, 86], "cloud-meatball");
addMapping(ICON_MAP, [95, 96, 99], "cloud-bolt");


// =================================================================================================================
// =================================================================================================================
// Weather icon mappings for different conditions during the night
export const ICON_MAP_NIGHT = new Map();

// Add mappings for various weather conditions during the night
addMapping(ICON_MAP_NIGHT, [0, 1], "moon");
addMapping(ICON_MAP_NIGHT, [2], "cloud-moon");
addMapping(ICON_MAP_NIGHT, [61, 63, 65], "cloud-moon-rain");


export const ICON_MAP_NEUTRAL = new Map();

addMapping(ICON_MAP_NEUTRAL, [3], "cloud");
addMapping(ICON_MAP_NEUTRAL, [45, 48], "smog");
addMapping(ICON_MAP_NEUTRAL, [51, 53, 55], "cloud-meatball");
addMapping(ICON_MAP_NEUTRAL, [56, 57, 66, 67, 80, 81, 82], "cloud-showers-heavy");
addMapping(ICON_MAP_NEUTRAL, [71, 73, 75, 77, 85, 86], "snowflake");
addMapping(ICON_MAP_NEUTRAL, [85, 86], "cloud-meatball");
addMapping(ICON_MAP_NEUTRAL, [95, 96, 99], "cloud-bolt");

// =================================================================================================================
// =================================================================================================================

// Function to add mappings to a specific map
function addMapping(targetMap, values, icons) {
    values.forEach((value, index) => {
        const icon = Array.isArray(icons) ? icons[index] : icons;
        targetMap.set(value, icon);
    });
}
