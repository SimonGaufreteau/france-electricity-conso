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
        eco2mix_data: null,
        eco2mix_categories: null,
        eco2mix_current_category: null,

    },
    mutations: {
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
        }
    },
})