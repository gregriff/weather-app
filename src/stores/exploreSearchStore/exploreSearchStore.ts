import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getPlaces,
    type Place,
    type SearchResults,
} from '@/services/geocodingService.ts';
import { useUserStore } from '@/stores/userStore/userStore.ts';

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

    function $reset() {
        pastSearches.value = [];
        allResults.value = {};

        // access persistent storage here
        numAPICalls.value = 0;
        apiCallsDisabled.value = false;
    }

    return {
        pastSearches,
        allResults,
        numAPICalls,
        apiCallsDisabled,
        getGeocodeResults,
        $reset,
    };
});
