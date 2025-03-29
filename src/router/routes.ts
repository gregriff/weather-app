import type { RouteRecordRaw } from 'vue-router';
import ForecastView from '@/views/pages/forecast/ForecastView.vue';
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
        component: ForecastView,
        meta: {
            navName: 'My Forecast',
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
