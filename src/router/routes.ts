import type { RouteRecordRaw } from 'vue-router';
import ForecastView from '@/views/pages/forecast/ForecastView.vue';
import ExploreView from '@/views/pages/explore/ExploreView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'forecast',
        component: ForecastView,
    },
    {
        path: '/explore',
        name: 'explore',
        component: ExploreView,
    },
];

export default routes;
