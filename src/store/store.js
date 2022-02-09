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
        isLogged: false,
        currentJWT: null,
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
            console.log("Updating region : ", region);
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
        },
        updateLoginStatus(state, jwt) {
            state.isLogged = true;
            state.currentJWT = jwt.token;
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
        fetchCurrentRegion({ commit, state }) {
            var region = 'Auvergne-Rhône-Alpes';
            if (state.isLogged)
                region = 'Occitanie'

            commit('updateCurrentRegion', region);
            commit('updateECO2MIXCurrentRegion', region);
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
        },
        // logs : {login: String, password: String}
        async login(context, logs) {
            const jsonLogs = JSON.stringify(logs);

            console.log("Got login request, params : " + jsonLogs);
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonLogs
            }
            return fetch("http://localhost:8080/api/authentification/login", requestOptions).then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                context.commit('updateLoginStatus', data);
            })
                .catch(error => {
                    this.errorMessage = error;
                    console.error('There was an error!', error);
                });
        },
        async register(context, logs) {
            const jsonLogs = JSON.stringify(logs);

            console.log("Got register request, params : " + jsonLogs);
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonLogs
            }
            return fetch("http://localhost:8080/api/authentification/register", requestOptions).then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
                .catch(error => {
                    this.errorMessage = error;
                    console.error('There was an error!', error);
                });
        },
    },
})