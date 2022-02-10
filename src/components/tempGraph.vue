<template>
  <LineChart class="alt-graph" :chartData="chartDataComp" :options="options" />
</template>

<script>
import { LineChart } from "vue-chart-3";

export default {
  name: "tempGraph",
  components: {
    LineChart,
  },
  computed: {
    isLogged() {
      return this.$store.state.isLogged;
    },
    current_region() {
      return this.$store.state.eco2mix_current_region;
    },
    options() {
      return {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            //position: "top",
          },
          title: {
            display: true,
            text:
              "Température en " +
              this.current_region +
              " au cours de l'année passée.",
          },
        },
      };
    },
    chartDataComp() {
      // eslint-disable-next-line no-unused-vars
      const lg = this.isLogged;
      if (this.$store.state.temperature_data == null) {
        return {};
      }
      const dataTemp = this.$store.state.temperature_data;
      const dataFiltered = dataTemp.filter(
        (e) => e["région"] == this.current_region
      );
      var dataRes = [];
      var labelsRes = [];
      var i = 0;
      var n = 5;
      dataFiltered.forEach((el) => {
        if (i % n == 0) {
          dataRes.push(el["tmoy"]);
          labelsRes.push(el["date"].substr(5, 5));
        }
        i++;
      });
      var dts = [
        {
          data: dataRes,
          label: "Température (°C)",
          backgroundColor: ["#5595E8"],
        },
      ];

      const res = {
        datasets: dts,
        labels: labelsRes,
      };

      return res;
    },
  },
  methods: {
    async fetchData() {},
  },
  created() {
    //this.fetchData();
  },
};
</script>

<style lang="scss">
@import "../css/mapbox.scss";

.alt-graph {
  background-color: $third-blue;
  height: 80%;
  width: 100%;
  outline: 0.25rem solid $main-orange;
  border-radius: 5%;
}
</style>