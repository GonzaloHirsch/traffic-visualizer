import { createApp } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';

let config = undefined;

createApp(App, {
  port: async () => {
    if (!config) config = await import('../../viz.config.json')
    return config.http.port
  }
})
  .use(router)
  .mount('#app');
