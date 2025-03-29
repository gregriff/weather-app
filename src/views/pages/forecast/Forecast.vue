<script setup lang="ts">
import { requestUserLocation } from '@/services/locationService';
import { ref } from 'vue';

const lat = ref<number | null>(null);
const long = ref<number | null>(null);

async function getUserLocation() {
    const { latitude, longitude } = await requestUserLocation();
    lat.value = latitude;
    long.value = longitude;
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-auto">
            <button
                @click="getUserLocation"
                class="btn btn-primary"
            >
                Use Current Location
            </button>
        </div>
        <div class="row justify-content-center">
            <div class="col-auto">
                <p>{{ `${lat ?? ''} ${long ?? ''}` }}</p>
            </div>
        </div>
    </div>
</template>
