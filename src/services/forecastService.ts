import { API } from './api';
import type { AxiosResponse } from 'axios';
import type { ForecastData, HourlyForecastData } from '@/stores/forecastStore/types.ts';
import type { CurrentLocation, Gridpoints } from '@/stores/userStore/types.ts';

interface ForecastResponse {
    properties: ForecastData;
    gridpoints: Gridpoints;
}

/*
    since hourly forecasts will always be rendered in the context of a normal forecast, we don't need
    to include gridpoints with them
 */
interface HourlyForecastResponse {
    properties: HourlyForecastData;
}

/*
    Given a lat/long, fetches a forecast. If provided gridpoint data, it will send the request with
    that information. Since the API call to NWS requires gridpoint data, we can save a round trip
    on the backend by providing that info here (from past requests using this function)
 */
export async function getForecastFromLocation(
    location: CurrentLocation,
    gridpoints?: Gridpoints,
): Promise<AxiosResponse<ForecastResponse>> {
    return await API.post('/weather/forecast', {
        latitude: location.latitude,
        longitude: location.longitude,
        ...(gridpoints && { gridpoints: gridpoints }),
    });
}

export async function getHourlyForecastFromLocation(
    location: CurrentLocation,
    gridpoints?: Gridpoints,
): Promise<AxiosResponse<HourlyForecastResponse>> {
    return await API.post('/weather/forecast/hourly', {
        latitude: location.latitude,
        longitude: location.longitude,
        ...(gridpoints && { gridpoints: gridpoints }),
    });
}
