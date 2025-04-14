<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useExploreSearchStore } from '@/stores/exploreSearchStore/exploreSearchStore.ts';
import { useRouter } from 'vue-router';
import { useTemplateRef } from 'vue';

const router = useRouter();
const exploreSearchStore = useExploreSearchStore();

const searchBoxPlaceholder = 'Find City...';

// stuff to try to avoid excessive API usage
let timeOfLastAPICall: number | undefined = undefined;
const INITIAL_API_CALL_PAUSE_MS = 500;
const MAX_PAUSE_MS = INITIAL_API_CALL_PAUSE_MS * 2;
let frequencyPenaltyMultiplier = 1.0;

const datalistElement = useTemplateRef<HTMLDataListElement | null>('datalistElement');
const searchText = ref<string>('');

function toggleSearchBoxPlaceholder(e: FocusEvent) {
    const input = e.target as HTMLInputElement;
    input.placeholder = input.placeholder ? '' : searchBoxPlaceholder;
}

/*
    Intended to trigger the loading of the forecast of the location that the user selects from the datalist.
    datalist <option> children are a bit tricky to work with since they cannot have onclick listeners.

    This could probably be improved by checking for some more things about the event. Currently, this will run
    every time the input box changes, so if the user types in an exact match of a datalist option, the forecast
    will load, which is unintended.
*/
function triggerReroute(e: Event) {
    if (!e.target) return;

    const target = e.target as HTMLInputElement;
    if (!target.value) return;

    const selectedResult = Object.entries(exploreSearchStore.allResults).find(
        ([, { place_name, region_code }]) =>
            `${place_name} ${region_code}` === target.value,
    );
    if (!selectedResult) return;
    const resultKey = selectedResult[0];

    router.push({ name: 'explore', params: { id: resultKey } });
}

/*
    Determines when to attempt an API call for search completion
    this effectively runs onkeyup
 */
watch(searchText, (newSearchText, oldSearchText) => {
    const currentTime = new Date().getTime();

    if (newSearchText.length < oldSearchText.length) return;

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
                @input="triggerReroute"
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
            <datalist
                id="citySearchOptions"
                ref="datalistElement"
            >
                <option
                    v-for="(place, key) in exploreSearchStore.allResults"
                    :key="key"
                    :value="`${place.place_name} ${place.region_code}`"
                    :id="key.toString()"
                ></option>
            </datalist>
        </div>
    </div>
</template>
