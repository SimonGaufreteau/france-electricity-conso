import { createApp } from 'vue'
import App from "./App.vue";
import "leaflet/dist/leaflet.css";

require('dotenv').config()

const app = createApp(App);
app.mount("#app");