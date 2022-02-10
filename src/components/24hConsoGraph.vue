<template>
  <LineChart ref="chart" :chartData="chartDataComp" :options="options" />
</template>



<script>
import { LineChart } from "vue-chart-3";

export default {
  name: "consoGraph",
  components: {
    LineChart,
  },
  computed: {
    current_category() {
      return this.$store.state.eco2mix_current_category;
    },
    current_region() {
      return this.$store.state.eco2mix_current_region;
    },
    ecoData() {
      return this.$store.state.eco2mix_24h;
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
              (this.current_category == "Total"
                ? "Consommation"
                : "Production " + this.current_category) +
              " en " +
              this.current_region +
              "(MW) ces dernières 24h",
          },
        },
      };
    },
    chartDataComp() {
      if (this.ecoData == null) return {};
      const data24 = this.ecoData;
      if (this.current_region == "Corse") return {};
      const dataFiltered = data24.filter(
        (e) => e["Région"] == this.current_region
      );
      //console.log(dataFiltered);

      var dataRes = [];
      var labelsRes = [];
      dataFiltered.forEach((el) => {
        dataRes.push(el[this.current_category]);
        labelsRes.push(el["DateHeure"].substr(11, 5));
      });

      var dts = [
        {
          data: dataRes,
          fill: true,
          label: this.current_category,
          backgroundColor: ["#77CEFF"],
        },
      ];
      const res = {
        datasets: dts,
        labels: labelsRes,
      };
      return res;
    },
  },
  created() {},
};
</script>

<style>
</style>