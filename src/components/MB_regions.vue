<template>
  <div class="map-wrapper">
    <l-map ref="map" v-model:zoom="zoom" :center="[46.2276, 2.2137]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-geo-json :geojson="this.$store.state.regions_geo" :options="options" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

import chroma from "chroma-js";

export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data() {
    return {
      loading: false,
      show: true,
      zoom: 6,
      min_eco: null,
      max_eco: null,
    };
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
        style: this.styleFunction,
      };
    },
    styleFunction() {
      console.log("CHanging color");
      const scale = chroma.scale(["green", "red"]); //"Viridis"
      const max = [...this.$store.state.eco2mix_data.entries()].reduce((a, e) =>
        e[1]["Total"] > a[1]["Total"] ? e : a
      );
      const min = [...this.$store.state.eco2mix_data.entries()].reduce((a, e) =>
        e[1]["Total"] < a[1]["Total"] ? e : a
      );
      console.log(min, max);
      return (feature) => {
        const eco2mix_feat = this.$store.state.eco2mix_data.get(
          feature.properties.nom
        );
        if (eco2mix_feat == undefined) {
          console.log(feature.properties.nom);
          return {
            fillColor: "#FFFFFF",
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
          };
        }

        let scaledValue =
          (eco2mix_feat["Total"] - min[1]["Total"]) /
          (max[1]["Total"] - min[1]["Total"]);
        let color = scale(scaledValue).hex();
        return {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7,
        };
      };
    },
    onEachFeatureFunction() {
      return (feature, layer) => {
        const eco2mix_feat = this.$store.state.eco2mix_data.get(
          feature.properties.nom
        );
        if (eco2mix_feat == undefined) return null;
        layer.bindTooltip(
          "<div class='region_title'>Région : " +
            eco2mix_feat["Région"] +
            "</div><div class='total_conso'>Conso Totale (MW) : " +
            eco2mix_feat["Total"] +
            "</div><div><ul><div class='underlined'>Production (MW) :</div> " +
            "<li>Thermique : " +
            eco2mix_feat["Thermique"] +
            "</li><li>Nucléaire : " +
            eco2mix_feat["Nucléaire"] +
            "</li><li>Éolien : " +
            eco2mix_feat["Éolien"] +
            "</li><li>Solaire : " +
            eco2mix_feat["Solaire"] +
            "</li><li>Hydraulique : " +
            eco2mix_feat["Hydraulique"] +
            "</li><li>Bioénergies : " +
            eco2mix_feat["Bioénergies"] +
            "</li></ul></div>" +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    },
  },
  methods: {
    async fetchData() {
      try {
        // Only fetch articles / links / categories if not yet done
        if (this.$store.state.regions_geo == null) {
          this.$store.dispatch("fetchRegionsGeo");
        }
        if (this.$store.state.eco2mix_data == null) {
          this.$store.dispatch("fetchECO2MIX");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.loading = true;
    await this.fetchData();
    this.loading = false;
  },
};
</script>

<style>
.main-wrapper {
  display: flex;
}

.map-wrapper {
  height: 75vh;
  width: 75vh;
}

.region_title {
  font-size: 16px;
}

.total_conso {
  font-weight: bold;
}

.underlined {
  text-decoration: underline;
}

ul {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 0px;
  /* padding-left: 10px; */
  margin: 0px;
}

li {
  margin-left: 15px;
}
</style>