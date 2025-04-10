import type { CurrentLocation } from '@/stores/userStore/types.ts';
import type { AxiosResponse } from 'axios';
import { API } from '@/services/api.ts';

export interface Place {
    place_name: string;
    region_name: string;
    region_code: string;
    coordinates: { longitude: number; latitude: number };
}

export type SearchResults = { [key: string]: Place };

// places are indexed by their ID
interface ForwardGeocodeResponse {
    results: SearchResults;
}

/*
    Given search text from the user, returns up to 5 locations from Mapbox's forward geocoding service.
    If the user has allowed access to their location, this will be included to increase result relevance
 */
export async function getPlaces(
    search_text: string,
    location?: CurrentLocation,
): Promise<AxiosResponse<ForwardGeocodeResponse>> {
    return await API.post('/geocode/place', {
        search_text: search_text,
        ...(location && { latitude: location.latitude, longitude: location.longitude }),
    });
}
