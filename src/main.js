import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from "./App.vue";
import "leaflet/dist/leaflet.css";

//GeoJSON
import regions_json from "./assets/regions.json";

//SAMPLE DATA
import sample_eco2mix from "./assets/eco2mix_sample.json";

// UTILS
import { mapEcoData } from "./utils_js/eco2mix_utils";

require('dotenv').config()

// Create a new store instance.
const store = createStore({
    state() {
        return {
            regions_geo: null,
            eco2mix_data: null,
        }
    },
    mutations: {
        updateRegionsGeo(state, regions) {
            state.regions_geo = regions;
        },
        updateECO2MIX(state, eco2mix) {
            state.eco2mix_data = eco2mix;
        }
    },

    actions: {
        fetchRegionsGeo(context) {
            var geojson = regions_json;
            context.commit('updateRegionsGeo', geojson);
        },
        fetchECO2MIX(context) {
            // TODO : replace this with fetch from server
            var eco2mix = mapEcoData(sample_eco2mix);
            context.commit('updateECO2MIX', eco2mix);
        }
    }
})


const app = createApp(App);
app.use(store);
app.mount("#app");