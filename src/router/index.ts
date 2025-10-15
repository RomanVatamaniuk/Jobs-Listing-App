import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'JobsFeed',
      component: () => import('@/pages/JobsFeedPage.vue'),
    },
    {
      path: '/create-vacancy',
      name: 'CreateVacancy',
      component: () => import('@/pages/CreateVacancyPage.vue'),
    },
    {
      path: '/:id',
      name: 'Job',
      component: () => import('@/pages/JobPage.vue'),
    },
    {
      path: '/edit-vacancy/:id',
      name: 'EditVacancy',
      component: () => import('@/pages/EditVacancyPage.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/pages/AboutPage.vue'),
    },
  ],
})

export default router
