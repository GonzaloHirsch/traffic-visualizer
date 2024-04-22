import { createWebHashHistory, createRouter } from 'vue-router';

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
  history: createWebHashHistory(),
  routes
});

export default router;
