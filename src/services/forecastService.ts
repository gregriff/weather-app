import { API } from './api';
import type { AxiosResponse } from 'axios';
import type { ForecastData } from '@/stores/forecastStore/types.ts';
import type { CurrentLocation } from '@/stores/userStore/types.ts';

interface ForecastResponse {
    properties: ForecastData;
}

export async function getForecastFromLocation(
    location: CurrentLocation,
): Promise<AxiosResponse<ForecastResponse>> {
    return await API.post('/weather/forecast', {
        latitude: location.latitude,
        longitude: location.longitude,
    });
}
