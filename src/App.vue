<template>
  <div class="global-wrapper">
    <MB_regions />
    <br />
    <selectCategoryECO2Mix />
    <br />
    <region-frame />
    <br />
    <consoTimer />
    <br />
    <eco2mixGraph />

    <consoGraph />
    <br />
    <tempGraph />
    <br />
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
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
.global-wrapper {
  display: flex;
  flex-direction: column;
}
</style>
