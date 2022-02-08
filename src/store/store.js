import { createStore } from 'vuex'
//GeoJSON
import regions_json from "../assets/regions.json";

//SAMPLE DATA
import sample_eco2mix from "../assets/eco2mix_sample.json";
import eco_24 from '../assets/eco2mix_24h.json';

// UTILS
import { mapEcoData } from "../utils_js/eco2mix_utils";


// Create a new store instance.
export default createStore({
    state: {
        // GEODATA
        regions_geo: null,

        // USER
        current_region: null,

        // ECO2MIX
        // Region selected on the map
        eco2mix_current_region: null,
        eco2mix_data: null,
        eco2mix_categories: null,
        eco2mix_current_category: null,
        eco2mix_prod_ratio: null,

        eco2mix_24h: null,

        // TEMPERATURE DATA
        temperature_year_data: null,
        temperature_day_data: null,
    },
    mutations: {
        updateCurrentRegion(state, region) {
            state.current_region = region;
        },
        updateECO2MIXCurrentRegion(state, region) {
            state.eco2mix_current_region = region;
        },
        resetECO2MIXCurrentRegion(state) {
            state.eco2mix_current_region = state.current_region;
        },
        updateECO2MIXProdRatio(state, ratio) {
            state.eco2mix_prod_ratio = ratio;
        },
        updateRegionsGeo(state, regions) {
            state.regions_geo = regions;
        },
        updateECO2MIXCurrentCategory(state, category) {
            state.eco2mix_current_category = category;
        },
        updateECO2MIX(state, eco2mix) {
            state.eco2mix_data = eco2mix;
            state.eco2mix_categories = ["Total", "Bioénergies", "Hydraulique", "Nucléaire", "Solaire", "Thermique", "Éolien"];
            state.eco2mix_current_category = "Total";
        },
        updateECO2MIX24h(state, data) {
            state.eco2mix_24h = data;
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
        },
        //TODO : Fetch current region
        fetchCurrentRegion(context) {
            var region = 'Auvergne-Rhône-Alpes';
            context.commit('updateCurrentRegion', region);
            context.commit('updateECO2MIXCurrentRegion', region);
        },
        //TODO : fetch ratio from server
        fetchECO2MIXProdRatio(context) {
            context.commit('updateECO2MIXProdRatio', 0.1645);
        },
        //TODO : fetch temperature from server
        fetchTemperature(context) {
            var temperature = undefined;
            context.commit('updateTemperature', temperature);
        },
        //TODO : fetch 24h data from server
        fetchECO2MIX24h(context) {
            var h24 = eco_24;
            context.commit('updateECO2MIX24h', h24);
        }
    },
})