<script setup lang="ts">
import type {
    HourlyForecastPeriod,
    ForecastData,
    ForecastPeriod,
    HourlyForecastData,
} from '@/stores/forecastStore/types.ts';
import { computed } from 'vue';
import type { Gridpoints } from '@/stores/userStore/types.ts';
import DailyPeriodComponent from '@/pages/forecast/components/DailyPeriod.vue';
import HourlyPeriodComponent from '@/pages/forecast/components/HourlyPeriod.vue';
import { Modal } from 'bootstrap';
import { ref, useTemplateRef, onMounted, onUnmounted } from 'vue';

const { forecast, hourlyForecast, gridpoints, hourlyNotAvailable } = defineProps<{
    forecast: ForecastData;
    hourlyForecast?: HourlyForecastData;
    gridpoints: Gridpoints;
    hourlyNotAvailable: boolean;
}>();

const modalElement = useTemplateRef<HTMLDivElement | null>('hourlyModal');
const modalInstance = ref<Modal | null>(null);
const selectedDay = ref<ForecastPeriod | undefined>(undefined);
const selectedDayHourPeriods = ref<HourlyForecastPeriod[] | undefined>(undefined);

const currentData = computed(() => forecast.periods[0]);

// There are always 7 daytime periods including today. For better html layout, reduce to 6
const nextSixDays = computed(() =>
    forecast.periods.filter((data) => data.isDaytime).slice(1),
);

const nextSixHours = computed(() => hourlyForecast?.periods.slice(0, 6));

// set data needed for modal to render hourly data for a selected day
function openModal(index: number) {
    selectedDay.value = nextSixDays.value[index];

    // TODO: subtract by current time
    const hourStartIndex = index === 0 ? 0 : 24 * index;
    selectedDayHourPeriods.value = hourlyForecast?.periods.slice(
        hourStartIndex,
        hourStartIndex + 24,
    );
    modalInstance.value?.show();
}

function closeModal() {
    selectedDay.value = undefined;
    selectedDayHourPeriods.value = undefined;
    modalInstance.value?.hide();
}

onMounted(() => {
    modalInstance.value = Modal.getOrCreateInstance(modalElement.value!);
});

onUnmounted(() => modalInstance.value?.dispose());
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
                        <h3 class="display-6 text-body-secondary m-0">
                            {{ currentData.temperature }}&deg;
                            <small>{{ currentData.temperatureUnit }}</small>
                        </h3>
                        <p
                            class="lead hourly-unavailable m-0"
                            v-if="hourlyNotAvailable"
                        >
                            Hourly Forecast Unavailable
                        </p>
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
                        v-for="(day, idx) in nextSixDays"
                        :key="idx"
                        @click="hourlyNotAvailable ? () => {} : openModal(idx)"
                        class="col-12 mb-3"
                    >
                        <DailyPeriodComponent :period="day" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        class="modal fade"
        id="hourlyModal"
        ref="hourlyModal"
        tabindex="-1"
        aria-labelledby="hourlyModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1
                        class="modal-title fs-5"
                        id="hourlyModalLabel"
                    >
                        {{ selectedDay?.name }}
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        @click="closeModal()"
                    ></button>
                </div>
                <div class="modal-body">
                    <div
                        v-if="hourlyForecast"
                        class="row justify-content-evenly mt-2"
                    >
                        <div
                            v-for="(hour, idx) in selectedDayHourPeriods"
                            :key="idx"
                            class="col-6 col-sm-4 my-2"
                        >
                            <HourlyPeriodComponent :period="hour" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                        @click="closeModal()"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-card {
    border-color: transparent;
}

.hourly-unavailable {
    color: var(--bs-danger);
}
</style>
