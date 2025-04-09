/*
    Returns the sprite SVG name for a given weather icon code
    reference: https://api.weather.gov/icons
 */
export function getForecastIcon(iconIdentifier: string, isDaytime: boolean): string {
    switch (iconIdentifier) {
        case 'skc':
        case 'few':
            return isDaytime ? 'sunny' : 'clear-night';
        case 'sct':
            return 'one-cloud';
        case 'bkn':
        case 'ovc':
            return 'two-clouds';
        case 'rain':
            return 'drizzle';
        case 'rain_showers':
            return 'rain';
        case 'rain_showers-hi':
            return 'rain-heavy';
        case 'tsra':
        case 'tsra_sct':
        case 'tsra_hi':
            return 'thunderstorm';
        case 'wind_skc':
        case 'wind_few':
            return 'windy';
        case 'wind_sct':
        case 'wind_bkn':
        case 'wind_ovc':
            return 'windy-cloudy';
        default:
            return 'question';
    }
}
