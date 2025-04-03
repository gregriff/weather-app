import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Forecast } from '@/stores/forecastStore/types.ts';
import { useUserStore } from '@/stores/userStore/userStore.ts';
import {
    getForecastFromLocation,
    getHourlyForecastFromLocation,
} from '@/services/forecastService.ts';

export const useForecastStore = defineStore('forecastStore', () => {
    const mainForecast = ref<Forecast>({ loading: true, hourlyLoading: true });
    const savedForecasts = ref<Forecast[]>([]);

    const locationFetchFailed = ref<boolean>(false);

    // actions

    /*
    Fetches both main forecast and main hourly forecast. Hourly forecast depends on main forecast being successfully retrieved,
    since they both depend on the same location data. This function handles obtaining the user's location if nessicary.
     */
    async function getMainForecast() {
        const userStore = useUserStore();
        if (!userStore.currentLocation) {
            try {
                await userStore.getCurrentLocation();
                locationFetchFailed.value = false;
            } catch {
                console.error('Location fetch failed');
                locationFetchFailed.value = true;
                mainForecast.value.loading = false;
                return;
            }
        }

        /*
            TODO:
            if store.mainForecast is already set, and little time has passed since it was last fetched, return.
            this will save unness API calls when user is switching tabs
         */

        try {
            const forecastResponse = await getForecastFromLocation(userStore.currentLocation!);
            mainForecast.value.data = forecastResponse.data.properties;
        } catch {
            // TODO: handle API error
            console.error('Error fetching forcast from location');
        } finally {
            mainForecast.value.loading = false;
        }

        try {
            const hourlyForecastResponse = await getHourlyForecastFromLocation(
                userStore.currentLocation!,
            );
            mainForecast.value.hourlyData = hourlyForecastResponse.data.properties;
        } catch {
            // TODO: handle API error
            console.error('Error fetching hourly forcast from location');
        } finally {
            mainForecast.value.hourlyLoading = false;
        }
    }

    function $reset() {
        mainForecast.value = { loading: true, hourlyLoading: true };
        savedForecasts.value = [];
        locationFetchFailed.value = false;
    }

    return {
        mainForecast,
        savedForecasts,
        locationFetchFailed,
        getMainForecast,
        $reset,
    };
});
