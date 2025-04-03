import { API } from './api';
import type { AxiosResponse } from 'axios';
import type { ForecastData, HourlyForecastData } from '@/stores/forecastStore/types.ts';
import type { CurrentLocation } from '@/stores/userStore/types.ts';

interface ForecastResponse {
    properties: ForecastData;
}

interface HourlyForecastResponse {
    properties: HourlyForecastData;
}

export async function getForecastFromLocation(
    location: CurrentLocation,
): Promise<AxiosResponse<ForecastResponse>> {
    return await API.post('/weather/forecast', {
        latitude: location.latitude,
        longitude: location.longitude,
    });
}

export async function getHourlyForecastFromLocation(
    location: CurrentLocation,
): Promise<AxiosResponse<HourlyForecastResponse>> {
    return await API.post('/weather/forecast/hourly', {
        latitude: location.latitude,
        longitude: location.longitude,
    });
}
