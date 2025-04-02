<script setup lang="ts">
import type { ForecastData } from '@/stores/forecastStore/types.ts';
import { computed } from 'vue';

// so we don't always need to check for undefined
// requires our logic that determines whether the data is loaded is perfect!
const { forecast } = defineProps<{ forecast: ForecastData }>();

const currentData = computed(() => forecast.periods[0]);
const sixDayPeriods = computed(() =>
    forecast.periods.filter((data) => data.isDaytime).slice(0, -1),
);
</script>

<template>
    <div class="row justify-content-center mb-3">
        <div class="col-9">
            <div class="card main-card">
                <div class="card-body">
                    <div class="d-flex justify-content-start align-items-center gap-4">
                        <h1 class="display-4 card-title">
                            {{ forecast.city }}
                        </h1>
                        <h1 class="display-6 text-body-secondary">
                            {{ currentData.temperature }}&deg;
                            <small>{{ currentData.temperatureUnit }}</small>
                        </h1>
                    </div>
                    <h6 class="card-subtitle mb-2 text-body-secondary">
                        {{ currentData.shortForecast }}
                    </h6>
                    <p class="card-text">
                        {{ currentData.detailedForecast }}
                    </p>
                </div>
            </div>
            <hr />
        </div>
    </div>

    <div class="row justify-content-center">
        <h4 class="text-center mb-4">Daily</h4>
        <div class="col-9">
            <div class="container">
                <div class="row justify-content-evenly">
                    <div
                        v-for="(period, idx) in sixDayPeriods"
                        :key="idx"
                        class="col-4 mb-3"
                    >
                        <div class="card text-center">
                            <img
                                src=""
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title">{{ period.name }}</h5>
                                <h6 class="card-subtitle mb-2 text-body-secondary">
                                    {{ period.temperature }}&deg;
                                </h6>
                                <h6
                                    v-if="period.probabilityOfPrecipitation.value"
                                    class="card-subtitle"
                                >
                                    <span class="badge rounded-pill text-bg-info mb-1"
                                        >{icon} {{ period.probabilityOfPrecipitation.value }}%
                                    </span>
                                </h6>
                                <p class="card-text">
                                    {{ period.detailedForecast }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-card {
    border-color: transparent;
}
</style>
