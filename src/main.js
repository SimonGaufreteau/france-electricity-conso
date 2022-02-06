import { createApp } from 'vue'
import App from "./App.vue";
import "leaflet/dist/leaflet.css";
import store from './store/store.js'

require('dotenv').config()

const app = createApp(App);
app.use(store);
app.mount("#app");