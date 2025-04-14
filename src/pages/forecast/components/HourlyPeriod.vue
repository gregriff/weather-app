<script setup lang="ts">
import type { HourlyForecastPeriod } from '@/stores/forecastStore/types.ts';
import RainBadge from '@/pages/forecast/components/badges/RainBadge.vue';
import { convertISO8601ToHHMM } from '@/utils/time.ts';
import { computed } from 'vue';
import { getForecastIcon } from '@/utils/icons.ts';

const { period } = defineProps<{
    period: HourlyForecastPeriod;
}>();

const svgHref = computed(
    () => `/sprite.svg#${getForecastIcon(period.iconName, period.isDaytime)}`,
);
</script>

<template>
    <div class="card text-center">
        <div class="card-img-top align-self-center mt-3">
            <svg class="daily-forecast-main-icon">
                <use :href="svgHref" />
            </svg>
        </div>
        <div class="card-body px-2">
            <h5 class="card-title mb-2">
                {{ convertISO8601ToHHMM(period.startTime) }}
            </h5>
            <RainBadge
                :precipitation-probability="period.probabilityOfPrecipitation.value"
            />
            <p class="card-text text-body-secondary mt-4">
                {{ period.shortForecast }}
            </p>
        </div>
    </div>
</template>
