<script setup lang="ts">
import { Offcanvas } from 'bootstrap';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import ExploreSettings from './ExploreSettings.vue';
import ForecastSettings from './ForecastSettings.vue';

const offcanvasElement = useTemplateRef<HTMLDivElement | null>('settingsMenu');
const offcanvasInstance = ref<Offcanvas | null>(null);

onMounted(() => {
    offcanvasInstance.value = new Offcanvas(offcanvasElement.value!);
});

onUnmounted(() => offcanvasInstance.value?.dispose());
</script>

<template>
    <button
        class="btn btn-secondary"
        type="button"
        @click="() => offcanvasInstance?.show()"
    >
        Settings
    </button>

    <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        ref="settingsMenu"
    >
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">Settings</h5>
            <button
                type="button"
                class="btn-close"
                @click="() => offcanvasInstance?.hide()"
            ></button>
        </div>
        <div class="offcanvas-body">
            <div class="container p-0">
                <ExploreSettings />
                <ForecastSettings />
            </div>
        </div>
    </div>
</template>
