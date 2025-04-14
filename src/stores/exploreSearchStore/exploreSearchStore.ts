import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getPlaces,
    type Place,
    type SearchResults,
} from '@/services/geocodingService.ts';
import { useUserStore } from '@/stores/userStore/userStore.ts';
import type { Forecast } from '../forecastStore/types';
import {
    getForecastFromLocation,
    getHourlyForecastFromLocation,
} from '@/services/forecastService';

/*
    Data and functions needed to make the Explore search box work

 */
export const useExploreSearchStore = defineStore('exploreSearchStore', () => {
    /*
        We'll use these to ensure the API is not called twice for the same query
     */
    const pastSearches = ref<string[]>([]);
    const allResults = ref<SearchResults>({});

    /*
    These should be persisted to a cookie/sessionStorage (if user not logged in),
    or maybe their User DB record if logged in to prevent API abuse
     */
    const numAPICalls = ref<number>(0);
    const apiCallsDisabled = ref<boolean>(false);

    const resultForecastID = ref<string>('');
    const resultForecast = ref<Forecast>({ loading: true, hourlyLoading: true });

    /*
        Since the results are rendered with a `<datalist>`, we can just keep adding
        the results of each API call together. The datalist will do string matching on the
        array and only show the most relevant results
     */
    function mergeResults(results: SearchResults) {
        allResults.value = { ...allResults.value, ...results };
    }

    /*
        Make forward-geocoding API call if not a duplicate search
     */
    async function getGeocodeResults(searchText: string) {
        const userStore = useUserStore();

        if (pastSearches.value.includes(searchText)) {
            console.warn('Duplicate search', searchText);
            return;
        }

        numAPICalls.value += 1;
        pastSearches.value.push(searchText);
        try {
            const { data } = await getPlaces(searchText, userStore.currentLocation);
            console.log('200:', data.results);
            mergeResults(data.results);
        } catch (e) {
            console.error(e);
        }
    }

    /*
        Pretty much a copy of `forecastStore.getMainForecast`.
    */
    async function getForecastResult(placeID: string) {
        const selectedPlace: Place | undefined = allResults.value[placeID];
        if (selectedPlace === undefined) {
            console.error('selected place is undefined. this should not happen');
            return;
        }
        try {
            const { data } = await getForecastFromLocation(selectedPlace.coordinates);
            resultForecastID.value = placeID;
            resultForecast.value.data = data.properties;
            resultForecast.value.gridpoints = data.gridpoints;
        } catch {
            // TODO: handle API error
            console.error('Error fetching forcast from location');
        } finally {
            resultForecast.value.loading = false;
        }

        try {
            const hourlyForecastResponse = await getHourlyForecastFromLocation(
                selectedPlace.coordinates!,
            );
            resultForecast.value.hourlyData = hourlyForecastResponse.data.properties;
        } catch {
            // TODO: handle API error
            console.error('Error fetching hourly forcast from location');
        } finally {
            resultForecast.value.hourlyLoading = false;
        }
    }

    /*
        Used to ensure previous result forecast does not appear on screen when user searches for and loads a new
        forecast on the explore page
    */
    function resetStoredResultForecast() {
        resultForecastID.value = '';
        resultForecast.value = { loading: true, hourlyLoading: true };
    }

    function $reset() {
        pastSearches.value = [];
        allResults.value = {};
        resetStoredResultForecast();

        // access persistent storage here
        numAPICalls.value = 0;
        apiCallsDisabled.value = false;
    }

    return {
        pastSearches,
        allResults,
        numAPICalls,
        resultForecastID,
        resultForecast,
        apiCallsDisabled,
        getGeocodeResults,
        getForecastResult,
        resetStoredResultForecast,
        $reset,
    };
});
