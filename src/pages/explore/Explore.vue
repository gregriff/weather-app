<script setup lang="ts">
import MainLayout from '@/layout/MainLayout.vue';
import SearchBoxComponent from './components/SearchBox.vue';
import ForecastLoaderComponent from './components/ForecastLoader.vue';
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';

/*
    This view will show the search box by default, but when an ID url param is given, it will load and show
    a forecast for the Place in `exploreStore.allResults` with the key of the url param
*/

const route = useRoute();
const currentRouteID = ref(route.params.id);

// needed to react to url param changes because component is reused
watch(
    () => route.params.id,
    (newId) => {
        currentRouteID.value = newId;
    },
);
</script>

<template>
    <MainLayout
        ><template v-if="!currentRouteID"><SearchBoxComponent /></template>
        <template v-else><ForecastLoaderComponent /></template
    ></MainLayout>
</template>
