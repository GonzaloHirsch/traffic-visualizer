import { createApp } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';
import config from '../../viz.config.json';

createApp(App, {
  port: config.http.port
})
  .use(router)
  .mount('#app');
