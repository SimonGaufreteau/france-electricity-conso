<template>
  <div class="flex-col flex-center">
    <div class="your-region">Votre région : {{ current_region }}</div>
    <div class="flex-col card-extended">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "regionFrame",
  computed: {
    ecoData() {
      return this.$store.state.eco2mix_data;
    },
    current_region() {
      const region = this.$store.state.current_region;
      console.log("Updating region frame", region);

      if (region == undefined || region == null) return {};
      return region;
    },
    current_eco2mix_data() {
      console.log("Updating frame  :", this.ecoData);
      const reg = this.current_region;
      if (this.ecoData == null) return {};
      return this.$store.state.eco2mix_data.get(reg);
    },
  },
  methods: {
    fetchData() {
      if (this.$store.state.eco2mix_data == null) {
        this.$store.dispatch("fetchECO2MIX");
      }
    },
  },
  created() {},
};
</script>

<style lang="scss">
@import "../css/mapbox.scss";

.card-extended {
  @extend %card-wrapper;
}

.flex-center {
  align-items: center;
}
.your-region {
  color: $third-blue;
  font-size: 1.75rem;
  text-align: center;
  margin-top: 4rem;
}

.total_conso {
  font-weight: bold;
  margin: 1rem;
}

ul {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  // padding: 0px;
  // /* padding-left: 10px; */
  // margin: 0px;
}

.underlined {
  text-decoration: underline;
}
</style>