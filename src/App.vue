<template>
  <div v-if="!this.$store.state.isLogged" class="flex-login">
    <loginForm />
  </div>
  <div v-else class="global-wrapper">
    <div class="logout btn">
      <a href="#" @click="doLogout">Logout</a>
    </div>
    <h2>Données eco2mix</h2>
    <div class="flex-row top-wrapper">
      <div class="map-wrapper">
        <MB_regions />
      </div>
      <div class="flex-col graph-wrapper">
        <eco2mixGraph class="graph" />
        <consoGraph class="graph" />
        <div class="top-bar">
          Sélection d'une catégorie (consomation / production) :
          <selectCategoryECO2Mix />
        </div>
      </div>
    </div>
    <div class="secondary-wrapper">
      <h2 class="alternative-h2">Quelques stats en plus</h2>
    </div>
    <div class="flex-row bot-wrapper">
      <region-frame />
      <consoTimer />
      <div class="bot-graph-wrapper">
        <tempGraph />
      </div>
    </div>
  </div>
</template>

<script>
import MB_regions from "./components/MB_regions.vue";
import regionFrame from "./components/regionFrame.vue";
import selectCategoryECO2Mix from "./components/selectCategoryECO2Mix.vue";
import eco2mixGraph from "./components/eco2mixGraph.vue";
import consoTimer from "./components/consoTimer.vue";
import tempGraph from "./components/tempGraph.vue";
import consoGraph from "./components/24hConsoGraph.vue";
import loginForm from "./components/loginForm.vue";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "App",
  components: {
    MB_regions,
    regionFrame,
    selectCategoryECO2Mix,
    eco2mixGraph,
    consoTimer,
    tempGraph,
    consoGraph,
    loginForm,
  },
  methods: {
    async doLogout() {
      console.log("Logout");
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style lang="scss">
@import "./css/mapbox.scss"; /* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
