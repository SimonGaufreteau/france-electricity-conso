<template>
  <LineChart :chartData="chartDataComp" :options="options" />
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
      return this.$store.state.current_region;
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
      const data24 = this.$store.state.eco2mix_24h;

      const dataFiltered = data24.filter(
        (e) => e["Région"] == this.current_region
      );

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
  methods: {
    fetchData() {
      if (this.$store.state.eco2mix_24h == null) {
        this.$store.dispatch("fetchECO2MIX24h");
      }
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