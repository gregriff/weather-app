import type { RouteRecordRaw } from 'vue-router';
import MainForecastView from '@/pages/forecast/MainForecast.vue';
import ExploreView from '@/pages/explore/Explore.vue';
import SavedLocationsView from '@/pages/saved/SavedLocations.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/saved',
        name: 'savedLocations',
        component: SavedLocationsView,
        meta: {
            navName: 'Saved',
        },
    },
    {
        path: '/',
        name: 'forecast',
        component: MainForecastView,
        meta: {
            navName: 'Forecast',
        },
    },
    {
        path: '/explore/:id?',
        name: 'explore',
        component: ExploreView,
        meta: {
            navName: 'Explore',
            defaultPath: '/explore',
        },
    },
];

export default routes;
