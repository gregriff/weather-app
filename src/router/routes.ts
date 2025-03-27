import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'dashboard',
        alias: '/dashboard',
        component: () => import('@/views/dashboard/DashboardView'),
    },
];

export default routes;
