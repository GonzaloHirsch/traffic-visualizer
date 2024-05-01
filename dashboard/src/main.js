import { createApp, provide, h } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';

let configPromise = undefined;

createApp({
  created() {
    if (!configPromise) configPromise = require(`../${process.env.NODE_ENV === "production" ? '' : '../'}viz.config.json`).default
    provide("viz", configPromise)
  },
  render: () => h(App)
}
)
  .use(router)
  .mount('#app');
