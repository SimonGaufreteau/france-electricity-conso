<template>
  <div class="map-wrapper">
    <l-map ref="map" v-model:zoom="zoom" :center="[46.2276, 2.2137]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-geo-json :geojson="geojson" :options="options" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import regions_json from "../assets/regions.json";
import chroma from "chroma-js";
import sample_eco2mix from "../assets/eco2mix_sample.json";
import { mapEcoData } from "../utils_js/eco2mix_utils";

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
      geojson: null,
      eco2mix_data: null,
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
      const max = [...this.eco2mix_data.entries()].reduce((a, e) =>
        e[1]["Total"] > a[1]["Total"] ? e : a
      );
      const min = [...this.eco2mix_data.entries()].reduce((a, e) =>
        e[1]["Total"] < a[1]["Total"] ? e : a
      );
      console.log(min, max);
      return (feature) => {
        const eco2mix_feat = this.eco2mix_data.get(feature.properties.nom);
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
        const eco2mix_feat = this.eco2mix_data.get(feature.properties.nom);
        if (eco2mix_feat == undefined) return null;
        layer.bindTooltip(
          "<div>Région : " +
            eco2mix_feat["Région"] +
            "</div><div>Conso Totale : " +
            eco2mix_feat["Total"] +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    },
  },
  async created() {
    this.loading = true;
    this.geojson = regions_json;
    this.eco2mix_data = mapEcoData(sample_eco2mix);
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
</style>