<script setup lang="ts">
import type { ForecastPeriod } from '@/stores/forecastStore/types.ts';

const { precipitationProbability } = defineProps<{
    precipitationProbability: ForecastPeriod['probabilityOfPrecipitation']['value'];
}>();
</script>

<template>
    <div
        v-if="precipitationProbability"
        class="col-auto"
    >
        <span class="badge rounded-pill text-bg-info"
            ><svg class="daily-forecast-badge-icon">
                <use href="/sprite.svg#raindrop" />
            </svg>
            {{ precipitationProbability }}%
        </span>
    </div>
</template>
