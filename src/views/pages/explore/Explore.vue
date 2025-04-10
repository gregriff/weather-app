<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useExploreSearchStore } from '@/stores/exploreSearchStore/exploreSearchStore.ts';

const exploreSearchStore = useExploreSearchStore();

const searchBoxPlaceholder = 'Find City...';
// let timeOfLastKeypress: Date | undefined = undefined;

// stuff to try to avoid excessive API usage
let timeOfLastAPICall: number | undefined = undefined;
const INITIAL_API_CALL_PAUSE_MS = 500;
const MAX_PAUSE_MS = INITIAL_API_CALL_PAUSE_MS * 2;
let frequencyPenaltyMultiplier = 1.0;

const searchText = ref<string>('');

function toggleSearchBoxPlaceholder(e: FocusEvent) {
    const input = e.target as HTMLInputElement;
    input.placeholder = input.placeholder ? '' : searchBoxPlaceholder;
}

/*
    Determines when to attempt an API call for search completion
    this effectively runs onkeyup
 */
watch(searchText, (newSearchText, oldSearchText) => {
    console.log(newSearchText);
    const currentTime = new Date().getTime();

    if (newSearchText.length < oldSearchText.length) return;

    // const timeOfThisKeypress = new Date().getTime();
    // const timeSinceLastKeypress = timeOfThisKeypress - (timeOfLastKeypress ?? 0);

    // min chars typed to trigger API call
    if (newSearchText.length < 2) {
        // TODO: send api call if user hasnt typed in a while (setTimeout?)
        return;
    }

    if (newSearchText.length > 8) return;

    if (timeOfLastAPICall === undefined) {
        timeOfLastAPICall = currentTime;
        exploreSearchStore.getGeocodeResults(searchText.value); // await or fire and forget?
        return;
    }

    // 3 chars should be enough to get a match, so allow a quick second request here
    if (newSearchText.length === 3) {
        timeOfLastAPICall = currentTime;
        exploreSearchStore.getGeocodeResults(searchText.value);
    }

    const pauseBetweenRequests = INITIAL_API_CALL_PAUSE_MS * frequencyPenaltyMultiplier;

    if (currentTime - timeOfLastAPICall < pauseBetweenRequests) {
        console.log(
            `DENIED, time since last api call: ${currentTime - timeOfLastAPICall}, penMult:${frequencyPenaltyMultiplier}`,
        );
        return;
    }
    // give user 3 quick API calls, slow down after that, up to a maximum delay
    if (exploreSearchStore.numAPICalls >= 3 && pauseBetweenRequests < MAX_PAUSE_MS)
        frequencyPenaltyMultiplier *= 1.4;

    if (exploreSearchStore.numAPICalls > 20) {
        alert('Stop spamming the search box');
        exploreSearchStore.apiCallsDisabled = true; // todo: save to sessionStorage
    }

    timeOfLastAPICall = currentTime;
    exploreSearchStore.getGeocodeResults(searchText.value);
});

// todo: ensure this value is empty when user navigates to page so that they aren't penalized for searching for a new city
onMounted(() => console.log(`Mounted, apiCalls: ${exploreSearchStore.numAPICalls}`));

// TODO:
// - have close matches preload NWS geopoints info to prepare for weather API calls
// - have couple closest match fetch weather data, after a reasonable onkeyup timeout
</script>

<template>
    <div class="row justify-content-center mt-2">
        <div class="col-6 text-center">
            <input
                @focus="toggleSearchBoxPlaceholder"
                @blur="toggleSearchBoxPlaceholder"
                v-model="searchText"
                class="form-control text-center"
                list="citySearchOptions"
                :disabled="exploreSearchStore.apiCallsDisabled"
                :placeholder="
                    exploreSearchStore.apiCallsDisabled
                        ? 'Temporarily Disabled'
                        : searchBoxPlaceholder
                "
            />
            <datalist id="citySearchOptions">
                <option
                    v-for="(place, idx) in exploreSearchStore.allResults"
                    :key="idx"
                    :value="`${place.place_name} ${place.region_code}`"
                ></option>
            </datalist>
        </div>
    </div>
</template>
