<template>
  <div class="timer-wrapper">
    <div class="timer-text">
      Conso dans votre région depuis votre arrivée sur le site ({{ dateSince }})
      :
    </div>
    <div class="timer-value">{{ prettyConso }} MW</div>
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

<style lang="scss">
@import "../css/mapbox.scss";

.timer-wrapper {
  @extend %card-wrapper;
  display: flex;
  flex-direction: column;
}

.timer-value {
  font-weight: bold;
  font-size: 1.5rem;
  margin: 1rem;
}
</style>