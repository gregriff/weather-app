<script setup lang="ts">
import NavBar from '@/views/layout/NavBar.vue';
import SettingsView from '@/views/pages/settings/SettingsView.vue';
</script>

<template>
    <div class="container-fluid mb-4">
        <div class="row justify-content-between mt-2">
            <div class="col"></div>
            <div class="col">
                <div class="col d-flex justify-content-center"><NavBar /></div>
            </div>
            <div class="col text-end">
                <SettingsView />
            </div>
        </div>
    </div>

    <div class="container py-4 mx-auto"><slot /></div>
</template>
