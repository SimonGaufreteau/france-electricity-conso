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
      const scale = chroma.scale("Viridis");
      const values = this.geojson.features.map((feat) => feat.properties.code);
      const min = Math.min(...values);
      const max = Math.max(...values);
      return (feature) => {
        let scaledValue = (feature.properties.code - min) / (max - min);
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
        layer.bindTooltip(
          "<div>code:" +
            feature.properties.code +
            "</div><div>nom: " +
            feature.properties.nom +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
    },
  },
  async created() {
    this.loading = true;
    this.geojson = regions_json;
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