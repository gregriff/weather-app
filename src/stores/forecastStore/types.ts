// models response objects from the API
export interface PrecipitationObject {
    unitCode: string;
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

export interface Forecast {
    properties?: ForecastData;
    loading?: boolean;
}
