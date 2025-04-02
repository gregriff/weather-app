import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Forecast } from '@/stores/forecastStore/types.ts';
import { useUserStore } from '@/stores/userStore/userStore.ts';
import { getForecastFromLocation } from '@/services/forecastService.ts';

export const useForecastStore = defineStore('forecastStore', () => {
    const mainForecast = ref<Forecast>({ loading: true });
    const mainForecastLoaded = ref<boolean>(false);
    const savedForecasts = ref<Forecast[]>([]);

    const locationFetchFailed = ref<boolean>(false);

    // actions
    async function getMainForecast() {
        const userStore = useUserStore();
        if (!userStore.currentLocation) {
            try {
                await userStore.getCurrentLocation();
                locationFetchFailed.value = false;
            } catch {
                locationFetchFailed.value = true;
                mainForecast.value.loading = false;
                return;
            }
        }

        try {
            const forecastResponse = await getForecastFromLocation(userStore.currentLocation!);
            mainForecast.value.properties = forecastResponse.data.properties;
            mainForecastLoaded.value = true;
        } catch {
            // TODO: handle API error
            mainForecastLoaded.value = false;
        } finally {
            mainForecast.value.loading = false;
        }
    }

    function $reset() {
        mainForecast.value = { loading: true };
        mainForecastLoaded.value = false;
        savedForecasts.value = [];
        locationFetchFailed.value = false;
    }

    return {
        mainForecast,
        mainForecastLoaded,
        savedForecasts,
        locationFetchFailed,
        getMainForecast,
        $reset,
    };
});
