<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useForecastStore } from '@/stores/forecastStore/forecastStore.ts';

const forecastStore = useForecastStore();

onBeforeMount(() => forecastStore.getMainForecast());
</script>

<template>
    <div class="row justify-content-center">
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
                v-else-if="!forecastStore.mainForecast.properties"
                @click="forecastStore.getMainForecast()"
                class="btn btn-danger"
            >
                Retry
            </button>
            <div
                v-else
                class="container"
            >
                <div class="row justify-content-center">
                    <div class="col-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">
                                    {{ forecastStore.mainForecast.properties.city }}:
                                    {{ forecastStore.mainForecastCurrentData.temperature }}&deg;
                                    <small>{{
                                        forecastStore.mainForecastCurrentData.temperatureUnit
                                    }}</small>
                                </h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">
                                    {{ forecastStore.mainForecastCurrentData.shortForecast }}
                                </h6>
                                <p class="card-text">
                                    {{ forecastStore.mainForecastCurrentData.detailedForecast }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
