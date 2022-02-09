<template>
  <LineChart :chartData="chartDataComp" :options="options" />
</template>

<script>
import { LineChart } from "vue-chart-3";

export default {
  name: "tempGraph",
  components: {
    LineChart,
  },
  computed: {
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
              "Température en " +
              this.current_region +
              " au cours de l'année passée.",
          },
        },
      };
    },
    chartDataComp() {
      const dataTemp = this.$store.state.temperature_data;
      const dataFiltered = dataTemp.filter(
        (e) => e["région"] == this.current_region
      );
      var dataRes = [];
      var labelsRes = [];
      dataFiltered.forEach((el) => {
        dataRes.push(el["tmoy"]);
        labelsRes.push(el["date"].substr(5, 5));
      });
      console.log(this.current_region);
      console.log(dataRes);
      console.log(labelsRes);
      var dts = [
        {
          data: dataRes,
          label: "Température (°C)",
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
    async fetchData() {
      if (this.$store.state.current_region == null) {
        await this.$store.dispatch("fetchCurrentRegion");
      }
      if (this.$store.state.temperature_data == null) {
        this.$store.dispatch("fetchTemperatureData", this.current_region);
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