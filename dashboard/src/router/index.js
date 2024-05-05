import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router';

const isServer = typeof window === 'undefined';

let history = isServer ? createMemoryHistory() : createWebHistory();

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about/',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/how-it-works/',
    name: 'HowItWorks',
    component: () => import('../views/HowItWorks.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history,
  routes
});

export default router;
