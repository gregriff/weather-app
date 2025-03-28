<script setup lang="ts">
import { useRoute } from 'vue-router';
import routes from '@/router/routes';

const currentRoute = useRoute();

function upperCaseFirstLetter(str: string) {
    return str[0].toUpperCase() + str.substring(1);
}
</script>
<template>
    <ul class="nav nav-underline">
        <li
            v-for="(route, idx) in routes"
            :key="idx"
            class="nav-item"
        >
            <router-link
                :to="route.path"
                :class="['nav-link', { active: currentRoute.name === route.name }]"
                >{{ upperCaseFirstLetter(route.name) }}</router-link
            >
        </li>
    </ul>
</template>
