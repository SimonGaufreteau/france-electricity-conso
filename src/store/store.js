import { createStore } from 'vuex'
//GeoJSON
import regions_json from "../assets/regions.json";

// UTILS
import { mapEcoData } from "../utils_js/eco2mix_utils";


// Create a new store instance.
export default createStore({
    state: {
        // GEODATA
        regions_geo: null,

        // USER
        prenom: null,
        nom: null,
        isLogged: false,
        currentJWT: null,
        current_region: 'Occitanie',
        headers: null,

        // ECO2MIX
        // Region selected on the map
        eco2mix_current_region: null,
        eco2mix_data: null,
        eco2mix_categories: null,
        eco2mix_current_category: null,
        eco2mix_prod_ratio: null,

        eco2mix_24h: null,

        // TEMPERATURE DATA
        temperature_data: null,
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
        },
        updateLoginStatus(state, logdata) {
            console.log(logdata);
            state.isLogged = true;
            state.currentJWT = logdata.token;
            state.headers = {
                "Authorization": "Bearer " + logdata.token,
                "Content-Type": "application/json",
            };
            state.current_region = logdata.region;
            state.eco2mix_current_region = logdata.region;
            state.nom = logdata.nom;
            state.prenom = logdata.prenom;
        },
        updateTemperatureData(state, data) {
            state.temperature_data = data;
        }
    },

    actions: {
        // Data --> {url:String,options:RequestOptions,hasres:boolean}
        async genericFetching(context, data) {
            const url = data["url"];
            const options = data["options"];
            const hasres = data["hasres"];

            console.log("Generic fetching on :", url, " / Options : ", options);
            return ((options != null && options != undefined) ? fetch(url, options) : fetch(url)).then(async response => {
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                //const second = response.clone();
                //console.log(await second.text());
                console.log("Finished generic fetching on :", url, " / Returning ? ", hasres);
                if (hasres)
                    return await response.json();
            })
                .catch(error => {
                    console.error('Error in generic fetching : ', error);
                    return Promise.reject(error);
                });
        },
        fetchRegionsGeo(context) {
            var geojson = regions_json;
            context.commit('updateRegionsGeo', geojson);
        },
        //TODO : fetch ratio from server
        fetchECO2MIXProdRatio(context) {
            context.commit('updateECO2MIXProdRatio', 0.1645);
        },
        fetchECO2MIX24h({ dispatch, state }) {
            const requestOptions = {
                headers: state.headers
            };
            const url = "/api/microservices/eco2mix/day"
            return dispatch('genericFetching', { url: url, hasres: true, options: requestOptions })

        },
        fetchECO2MIX({ dispatch, state }) {
            const requestOptions = {
                headers: state.headers
            };
            const url = "/api/microservices/eco2mix/hour"
            return dispatch('genericFetching', { url: url, hasres: true, options: requestOptions })
                .then((data) => mapEcoData(data))
        },
        // eslint-disable-next-line no-unused-vars
        async fetchTemperatureData({ dispatch, commit, state }) {
            const requestOptions = {
                headers: state.headers
            };
            const url = "/api/microservices/temperature/year/2021"
            return dispatch('genericFetching', { url: url, hasres: true, options: requestOptions });

        },
        // ALL FETCHER
        async fetchAllData({ dispatch, commit }) {
            dispatch('fetchTemperatureData').then((data) => commit('updateTemperatureData', data));
            dispatch('fetchECO2MIX24h').then(data => commit('updateECO2MIX24h', data));
            dispatch('fetchECO2MIX').then(data => commit('updateECO2MIX', data));
        },
        // logs : {login: String, password: String}
        async login({ dispatch, commit }, logs) {
            const jsonLogs = JSON.stringify(logs);

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonLogs
            };
            console.log("Got login request, params : " + requestOptions);

            return dispatch('genericFetching', { url: '/api/authentification/login', options: requestOptions, hasres: true })
                .then(data => commit('updateLoginStatus', data))
                .then(() => dispatch('fetchAllData'));

        },
        async register({ dispatch }, logs) {
            const jsonLogs = JSON.stringify(logs);

            console.log("Got register request, params : " + jsonLogs);
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonLogs
            }
            return dispatch('genericFetching', { url: '/api/authentification/register', options: requestOptions });

        },
    },
})