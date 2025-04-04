import type { RouteRecordRaw } from 'vue-router';
import MainForecastView from '@/views/pages/forecast/MainForecastView.vue';
import ExploreView from '@/views/pages/explore/ExploreView.vue';
import SavedLocationsView from '@/views/pages/saved/SavedLocationsView.vue';

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
        path: '/explore',
        name: 'explore',
        component: ExploreView,
        meta: {
            navName: 'Explore',
        },
    },
];

export default routes;
