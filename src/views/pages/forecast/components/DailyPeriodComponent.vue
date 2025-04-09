<script setup lang="ts">
import type { ForecastPeriod } from '@/stores/forecastStore/types.ts';
import RainBadge from '@/views/pages/forecast/components/badges/RainBadge.vue';
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
        <div class="card-img-top align-self-center mt-3">
            <svg class="daily-forecast-main-icon">
                <use :href="svgHref" />
            </svg>
        </div>
        <div class="card-body">
            <h5 class="card-title">{{ period.name }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">
                {{ period.temperature }}&deg;
            </h6>

            <p class="card-text">
                {{ period.shortForecast }}
            </p>
            <div class="row justify-content-center card-subtitle">
                <RainBadge
                    :precipitation-probability="period.probabilityOfPrecipitation.value"
                />
            </div>
        </div>
    </div>
</template>
