<script setup lang="ts">
import MainLayout from '@/views/layout/MainLayout.vue';
import ForecastComponent from './Forecast.vue';
import { useForecastStore } from '@/stores/forecastStore/forecastStore.ts';
import { onBeforeMount } from 'vue';

const forecastStore = useForecastStore();

onBeforeMount(() => forecastStore.getMainForecast());
</script>

<template>
    <MainLayout>
        <div
            v-if="!forecastStore.mainForecast.data"
            class="row justify-content-center"
        >
            <div class="col-auto">
                <button
                    v-if="forecastStore.locationFetchFailed"
                    @click="forecastStore.getMainForecast()"
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
        />
    </MainLayout>
</template>
