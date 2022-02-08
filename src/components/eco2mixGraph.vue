<template>
  <BarChart :chartData="chartDataComp" :options="options" />
</template>

<script>
import { BarChart } from "vue-chart-3";
/*import { Chart, BarController } from "chart.js";
Chart.register(BarController);*/

export default {
  name: "eco2mixGraph",
  components: { BarChart },
  computed: {
    current_region: {
      get() {
        return this.$store.state.eco2mix_current_region;
      },
    },
    options() {
      return {
        responsive: true,

        scales: {
          x: {
            stacked: true,
            categoryPercentage: 0.5,
            barPercentage: 1,
          },

          y: {
            type: "logarithmic",
            stacked: true,
          },
        },
        plugins: {
          legend: {
            display: false,
            //position: "top",
          },
          title: {
            display: true,
            text: "Production par filière en " + this.current_region + "(MW)",
          },
        },
      };
    },
    chartDataComp: {
      get() {
        var ecoData = this.$store.state.eco2mix_data.get(this.current_region);

        var categories = this.$store.state.eco2mix_categories;
        const filtered = categories.filter((e) => e != "Total");
        var dataCat = [];
        var colors = ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"];

        var stacked = [...this.stackedCharData.values()];

        filtered.forEach((category) => {
          dataCat.push(ecoData[category]);
        });
        var dts = [
          {
            data: dataCat,
            backgroundColor: colors,
          },
          {
            data: stacked,
          },
        ];
        const res = {
          labels: filtered,
          datasets: dts,
        };
        return res;
      },
    },
    stackedCharData() {
      var ecoData = this.$store.state.eco2mix_data;
      var categories = this.$store.state.eco2mix_categories;
      const filtered = categories.filter((e) => e != "Total");
      var sumMap = new Map();
      filtered.forEach((cat) => {
        sumMap.set(cat, 0);
      });
      console.log(sumMap);
      console.log([...ecoData.entries()]);
      [...ecoData.entries()].forEach((el) =>
        Object.entries(el[1]).forEach((subCat) =>
          sumMap.has(subCat[0])
            ? sumMap.set(subCat[0], sumMap.get(subCat[0]) + subCat[1])
            : null
        )
      );

      // Nucléaire
      //sumMap.set("Nucléaire", 0);

      return sumMap;
    },
  },
  methods: {
    fetchData() {
      if (this.$store.state.current_region == null) {
        this.$store.dispatch("fetchCurrentRegion");
      }
      if (this.$store.state.eco2mix_data == null) {
        this.$store.dispatch("fetchECO2MIX");
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style>
</style>