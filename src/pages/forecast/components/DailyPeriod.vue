<script setup lang="ts">
import type { ForecastPeriod } from '@/stores/forecastStore/types.ts';
import RainBadge from '@/pages/forecast/components/badges/RainBadge.vue';
import { computed } from 'vue';
import { getForecastIcon } from '@/utils/icons.ts';

const { period } = defineProps<{
    period: ForecastPeriod;
}>();

const svgHref = computed(
    () => `/sprite.svg#${getForecastIcon(period.iconName, period.isDaytime)}`,
);
</script>

<template>
    <div class="card text-center">
        <div class="row d-flex flex-row align-items-center mx-2 my-3">
            <div class="col-3 col-lg-auto">
                <svg class="daily-forecast-main-icon">
                    <use :href="svgHref" />
                </svg>
            </div>
            <div class="col-6 col-lg-auto">
                <h5 class="card-title m-0">{{ period.name }}</h5>
            </div>
            <div class="col-3 col-lg-auto">
                <h5 class="text-body-secondary m-0">{{ period.temperature }}&deg;</h5>
            </div>
            <RainBadge
                :precipitation-probability="period.probabilityOfPrecipitation.value"
            />
            <div class="col-12 col-lg-auto">
                <p class="card-text">
                    {{ period.shortForecast }}
                </p>
            </div>
        </div>
    </div>
</template>
