<script setup lang="ts">
import { useExploreSearchStore } from '@/stores/exploreSearchStore/exploreSearchStore';
import ForecastComponent from '@/pages/forecast/components/Forecast.vue';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const exploreSearchStore = useExploreSearchStore();

const error = ref<string | undefined>(undefined);

async function getForecast(placeID: string) {
    error.value = undefined;
    try {
        await exploreSearchStore.getForecastResult(placeID);
    } catch (e) {
        if (!isAxiosError(e)) {
            error.value = 'Unknown Error';
            return;
        }
        error.value = `${e.status}: ${e.response?.statusText}`;
    }
}

onBeforeMount(async () => {
    // this happens when the user refreshes this page. The store is reset, so we should send user to the search box
    if (!Object.keys(exploreSearchStore.allResults).length) {
        await router.push('/explore');
    }
    // ensures previously-viewed forecasts do not show on the screen as a new one loads
    exploreSearchStore.resetStoredResultForecast();
    await getForecast(route.params.id! as string);
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <div
                v-if="error"
                class="alert alert-warning my-3"
                role="alert"
            >
                {{ error }}
            </div>
        </div>
    </div>
    <div
        v-if="!exploreSearchStore.resultForecast.data"
        class="row justify-content-center"
    >
        <div class="col-auto">
            <div
                v-if="exploreSearchStore.resultForecast.loading"
                class="spinner-grow"
                role="status"
            >
                <span class="visually-hidden">Loading...</span>
            </div>
            <button
                v-else
                @click="getForecast(route.params.id! as string)"
                class="btn btn-danger"
            >
                Retry
            </button>
        </div>
    </div>
    <ForecastComponent
        v-else
        :forecast="exploreSearchStore.resultForecast.data"
        :hourly-forecast="exploreSearchStore.resultForecast.hourlyData"
        :gridpoints="exploreSearchStore.resultForecast.gridpoints!"
    />
</template>
