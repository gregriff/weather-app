// models forecast objects stored in Pinia
export interface PrecipitationObject {
    unitCode: string;
    minValue: number;
    maxValue: number;
    value: number | string | null;
}

export interface ForecastPeriod {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: number;
    temperatureUnit: string;
    temperatureTrend: string;
    probabilityOfPrecipitation: PrecipitationObject;
    windSpeed: string;
    windDirection: string;
    shortForecast: string;
    detailedForecast: string;
}

export interface ForecastData {
    city: string;
    state: string;
    generatedAt: string;
    updatedTime: string;
    periods: ForecastPeriod[];
}

export interface HourlyForecastPeriod {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: number;
    temperatureUnit: string;
    temperatureTrend: string;
    probabilityOfPrecipitation: PrecipitationObject;
    windDirection: string;
    shortForecast: string;
    detailedForecast: string;
}

export interface HourlyForecastData {
    generatedAt: string;
    updatedTime: string;
    periods: HourlyForecastPeriod[];
}

export interface Forecast {
    data?: ForecastData;
    hourlyData?: HourlyForecastData;

    loading?: boolean;
    hourlyLoading?: boolean;
}
