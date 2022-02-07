<template>
  <div>
    Conso dans votre région depuis votre arrivée sur le site ({{ dateSince }}) :
    {{ prettyConso }} MW
  </div>
</template>

<script>
export default {
  name: "consoTimer",
  data: function () {
    return {
      conso: 0,
      timer_cum: 0,
      tickTimer: 100,
    };
  },
  computed: {
    dateSince() {
      return new Date(this.timer_cum * 1000).toISOString().substr(11, 8);
    },
    prettyConso() {
      return +this.conso.toFixed(2);
    },
  },

  methods: {
    updateConso() {
      this.conso +=
        this.$store.state.eco2mix_prod_ratio * (this.tickTimer / 1000);
      this.timer_cum += this.tickTimer / 1000;
    },
    fetchData() {
      if (this.$store.state.eco2mix_prod_ratio == null) {
        this.$store.dispatch("fetchECO2MIXProdRatio");
      }
    },
  },
  created() {
    this.fetchData();
    setInterval(this.updateConso, this.tickTimer);
  },
};
</script>

<style>
</style>