import { createStore } from 'vuex'
//GeoJSON
import regions_json from "../assets/regions.json";

//SAMPLE DATA
import sample_eco2mix from "../assets/eco2mix_sample.json";

// UTILS
import { mapEcoData } from "../utils_js/eco2mix_utils";


// Create a new store instance.
export default createStore({
    state: {
        regions_geo: null,
        // User region
        current_region: null,
        // Region selected on the map
        eco2mix_current_region: null,
        eco2mix_data: null,
        eco2mix_categories: null,
        eco2mix_current_category: null,
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
        }
    },
})