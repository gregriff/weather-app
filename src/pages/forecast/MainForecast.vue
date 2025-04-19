<script setup lang="ts">
import MainLayout from '@/layout/MainLayout.vue';
import ForecastComponent from './components/Forecast.vue';
import { useForecastStore } from '@/stores/forecastStore/forecastStore.ts';
import { onBeforeMount } from 'vue';
import { ref } from 'vue';
import { isAxiosError } from 'axios';

const forecastStore = useForecastStore();

const error = ref<string | undefined>(undefined);
const hourlyNotAvailable = ref<boolean>(false);

async function getMainForecast() {
    error.value = undefined;
    hourlyNotAvailable.value = false;
    try {
        await forecastStore.getMainForecast();
    } catch (e) {
        if (!isAxiosError(e)) {
            error.value = 'Unknown Error';
            return;
        }
        if (forecastStore.mainForecast.data && !forecastStore.mainForecast.hourlyData) {
            hourlyNotAvailable.value = true;
            return;
        }
        error.value = `${e.status}: ${e.response?.statusText}`;
    }
}

// TODO: this condition will need to be better in the future
onBeforeMount(() => {
    if (!forecastStore.mainForecast.data) getMainForecast();
});
</script>

<template>
    <MainLayout>
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
            v-if="!forecastStore.mainForecast.data"
            class="row justify-content-center"
        >
            <div class="col-auto">
                <button
                    v-if="forecastStore.locationFetchFailed"
                    @click="getMainForecast()"
                    class="btn btn-primary"
                >
                    Allow Location Access
                </button>
                <div
                    v-else-if="forecastStore.mainForecast.loading"
                    class="spinner-grow"
                    role="status"
                >
                    <span class="visually-hidden">Loading...</span>
                </div>
                <button
                    v-else
                    @click="forecastStore.getMainForecast()"
                    class="btn btn-danger"
                >
                    Retry
                </button>
            </div>
        </div>

        <ForecastComponent
            v-else
            :forecast="forecastStore.mainForecast.data"
            :hourly-forecast="forecastStore.mainForecast.hourlyData"
            :gridpoints="forecastStore.mainForecast.gridpoints!"
            :hourly-not-available="hourlyNotAvailable"
        />
    </MainLayout>
</template>
