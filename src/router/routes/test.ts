export default {
  dashboard: {
    path: '/dashboard',
    name: 'DashboardIndex',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '控制面板',
      permission: 'dashboard',
    },
  },
};
