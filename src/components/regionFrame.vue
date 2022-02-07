<template>
  <div>Current region is : {{ current_region }}</div>
  <div class="total_conso">
    Conso Totale (MW) : {{ current_eco2mix_data["Total"] }}
  </div>
  <div>
    <ul>
      <div class="underlined">Production (MW) :</div>
      <li>Thermique : {{ current_eco2mix_data["Thermique"] }}</li>
      <li>Nucléaire : {{ current_eco2mix_data["Nucléaire"] }}</li>
      <li>Éolien : {{ current_eco2mix_data["Éolien"] }}</li>
      <li>Solaire : {{ current_eco2mix_data["Solaire"] }}</li>
      <li>Hydraulique : {{ current_eco2mix_data["Hydraulique"] }}</li>
      <li>Bioénergies : {{ current_eco2mix_data["Bioénergies"] }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "regionFrame",
  computed: {
    current_region: {
      get() {
        return this.$store.state.current_region;
      },
    },
    current_eco2mix_data: {
      get() {
        return this.$store.state.eco2mix_data.get(this.current_region);
      },
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