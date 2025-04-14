<script setup lang="ts">
import { useRoute } from 'vue-router';
import routes from '@/router/routes';
import SettingsComponent from '@/pages/settings/Settings.vue';

const currentRoute = useRoute();
</script>

<template>
    <div class="navbar sticky-top justify-content-evenly">
        <div class="col"></div>

        <ul class="navbar-nav nav-underline flex-row">
            <li
                v-for="(route, idx) in routes"
                :key="idx"
                class="nav-item"
            >
                <router-link
                    :to="route.meta?.defaultPath ?? route.path"
                    :class="['nav-link', { active: currentRoute.name === route.name }]"
                    >{{ route.meta?.navName! }}</router-link
                >
            </li>
        </ul>

        <div class="col text-end">
            <SettingsComponent />
        </div>
    </div>
</template>
