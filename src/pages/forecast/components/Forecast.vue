<script setup lang="ts">
import type { ForecastData, HourlyForecastData } from '@/stores/forecastStore/types.ts';
import { computed } from 'vue';
import type { Gridpoints } from '@/stores/userStore/types.ts';
import DailyPeriodComponent from '@/pages/forecast/components/DailyPeriod.vue';
import HourlyPeriodComponent from '@/pages/forecast/components/HourlyPeriod.vue';

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
                <div class="card-body py-1">
                    <div
                        class="d-flex justify-content-start align-items-center gap-4 my-1"
                    >
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
                            v-for="(hour, idx) in nextSixHours"
                            :key="idx"
                            class="col-6 col-sm-2 my-2"
                        >
                            <HourlyPeriodComponent :period="hour" />
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
                        v-for="(day, idx) in sixDayPeriods"
                        :key="idx"
                        class="col-12 col-sm-4 mb-3"
                    >
                        <DailyPeriodComponent :period="day" />
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
