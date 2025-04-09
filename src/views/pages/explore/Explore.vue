<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { getPlaces, type Place } from '@/services/geocodingService.ts';
import { useUserStore } from '@/stores/userStore/userStore.ts';

const userStore = useUserStore();

const searchBoxPlaceholder = 'Find City...';
// let timeOfLastKeypress: Date | undefined = undefined;
let timeOfLastAPICall: number | undefined = undefined;
const INITIAL_API_CALL_PAUSE_MS = 500;
const MAX_PAUSE_MS = INITIAL_API_CALL_PAUSE_MS * 2;
let frequencyPenaltyMultiplier = 1.0;
let totalCharsTyped = 0;

const searchText = ref<string>('');
const matchedPlaces = ref<Place[]>([]);

const numAPICalls = ref<number>(0); // ref for debugging
const apiCallsDisabled = ref<boolean>(false);

function toggleSearchBoxPlaceholder(e: FocusEvent) {
    const input = e.target as HTMLInputElement;
    input.placeholder = input.placeholder ? '' : searchBoxPlaceholder;
}

async function getGeocodeResults(searchText: string) {
    numAPICalls.value += 1;
    try {
        const { data } = await getPlaces(searchText, userStore.currentLocation);
        console.log('200:', data.places);
        matchedPlaces.value = data.places;
    } catch (e) {
        console.error(e);
    }
}

// this effectively runs onkeyup
watch(searchText, (newSearchText, oldSearchText) => {
    console.log(newSearchText);
    const currentTime = new Date().getTime();

    if (newSearchText.length < oldSearchText.length) return;

    // const timeOfThisKeypress = new Date().getTime();
    // const timeSinceLastKeypress = timeOfThisKeypress - (timeOfLastKeypress ?? 0);
    if (newSearchText.length < 2) {
        // TODO: send api call if user hasnt typed in a while (setTimeout?)
        return;
    }
    totalCharsTyped += newSearchText.length - oldSearchText.length;

    if (newSearchText.length > 8) return;

    if (timeOfLastAPICall === undefined) {
        timeOfLastAPICall = currentTime;
        getGeocodeResults(searchText.value); // await or fire and forget?
        return;
    }

    const pauseBetweenRequests = INITIAL_API_CALL_PAUSE_MS * frequencyPenaltyMultiplier;

    if (currentTime - timeOfLastAPICall < pauseBetweenRequests) {
        console.log(
            `DENIED, time since last api call: ${currentTime - timeOfLastAPICall}, penMult:${frequencyPenaltyMultiplier}`,
        );
        return;
    }
    // give user 3 quick API calls, slow down after that, up to a maximum delay
    if (numAPICalls.value >= 3 && pauseBetweenRequests < MAX_PAUSE_MS)
        frequencyPenaltyMultiplier *= 1.4;

    if (numAPICalls.value > 20) {
        alert('Stop spamming the search box');
        apiCallsDisabled.value = true; // todo: save to sessionStorage
    }

    timeOfLastAPICall = currentTime;
    getGeocodeResults(searchText.value);
});

// todo: ensure this value is empty when user navigates to page so that they aren't penalized for searching for a new city
onMounted(() =>
    console.log(`Mounted, totalchars typed is: ${totalCharsTyped}, apiCalls: ${numAPICalls.value}`),
);

// todo: store this in session storage to avoid API abuse
onUnmounted(() => console.log('Total chars typed:', totalCharsTyped));

// TODO:
// - have search fuzzy match to some list of cities, maybe loaded with an API onmount of app.
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
                :disabled="apiCallsDisabled"
                :placeholder="apiCallsDisabled ? 'Temporarily Disabled' : searchBoxPlaceholder"
            />
            <datalist id="citySearchOptions">
                <option
                    v-for="(place, idx) in matchedPlaces"
                    :key="idx"
                    :value="`${place.place_name} ${place.region_code}`"
                ></option>
            </datalist>
        </div>
    </div>
</template>
