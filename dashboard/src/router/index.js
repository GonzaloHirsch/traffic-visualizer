import { createMemoryHistory, createRouter } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import HowItWorks from '../views/HowItWorks.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/how-it-works',
    component: HowItWorks
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes
});

export default router;
