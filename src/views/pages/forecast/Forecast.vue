<script setup lang="ts">
import type { ForecastData, HourlyForecastData } from '@/stores/forecastStore/types.ts';
import { computed } from 'vue';
import { convertISO8601ToHHMM } from '@/utils/time.ts';
import type { Gridpoints } from '@/stores/userStore/types.ts';

const { forecast, hourlyForecast, gridpoints } = defineProps<{
    forecast: ForecastData;
    hourlyForecast?: HourlyForecastData;
    gridpoints: Gridpoints;
}>();

const currentData = computed(() => forecast.periods[0]);

// There are always 7 daytime periods. For better html layout, reduce to 6
const sixDayPeriods = computed(() =>
    forecast.periods.filter((data) => data.isDaytime).slice(0, -1),
);

const nextSixHours = computed(() => hourlyForecast?.periods.slice(0, 6));
</script>

<template>
    <div class="row justify-content-center mb-3">
        <div class="col-9">
            <div class="card main-card">
                <div class="card-body">
                    <div class="d-flex justify-content-start align-items-center gap-4">
                        <h1 class="display-4 card-title">
                            {{ gridpoints.city }}
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
                <div v-if="hourlyForecast">
                    <hr />
                    <div class="row justify-content-evenly mt-2">
                        <div
                            v-for="(period, idx) in nextSixHours"
                            :key="idx"
                            class="col-6 col-sm-2 my-2"
                        >
                            <div class="card text-center">
                                <div class="card-body">
                                    <h5 class="card-title mb-2">
                                        {{ convertISO8601ToHHMM(period.startTime) }}
                                    </h5>
                                    <h6
                                        v-if="period.probabilityOfPrecipitation.value"
                                        class="card-subtitle"
                                    >
                                        <span class="badge rounded-pill text-bg-info mb-1"
                                            >{icon} {{ period.probabilityOfPrecipitation.value }}%
                                        </span>
                                    </h6>
                                    <p class="card-text text-body-secondary mt-4">
                                        {{ period.shortForecast }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    </div>

    <div class="row justify-content-center mb-3">
        <h4 class="text-center mb-4">Daily</h4>
        <div class="col-9">
            <div class="container">
                <div class="row justify-content-evenly">
                    <div
                        v-for="(period, idx) in sixDayPeriods"
                        :key="idx"
                        class="col-12 col-sm-4 mb-3"
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
                                <div class="row justify-content-center card-subtitle mb-1">
                                    <div
                                        v-if="period.probabilityOfPrecipitation.value"
                                        class="col-auto"
                                    >
                                        <span class="badge rounded-pill text-bg-info"
                                            ><svg class="daily-forecast-badge-icon">
                                                <use href="/sprite.svg#rain" />
                                            </svg>
                                            {{ period.probabilityOfPrecipitation.value }}%
                                        </span>
                                    </div>
                                </div>

                                <p class="card-text">
                                    {{ period.shortForecast }}
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
