<template>
  <div class="map-wrapper">
    <l-map ref="map" v-model:zoom="zoom" :center="[46.2276, 2.2137]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-geo-json
        @add="afterMapLoad"
        ref="geojson"
        :geojson="this.$store.state.regions_geo"
        :options="options"
      />
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
      previous_options: null,
    };
  },
  computed: {
    current_eco2mix_category: {
      get() {
        return this.$store.state.eco2mix_current_category;
      },
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
      };
    },
    onEachFeatureFunction() {
      // eslint-disable-next-line no-unused-vars
      const st = this.current_eco2mix_category;
      return (feature, layer) => {
        if (
          feature == undefined ||
          feature == null ||
          feature.properties == undefined
        )
          return null;
        layer.on("mouseover", () => {
          console.log("Mouseover : ", feature.properties);
          this.$store.commit(
            "updateECO2MIXCurrentRegion",
            feature.properties.nom
          );
        });
        layer.on("mouseout", () => {
          layer.setStyle(this.getStyleForRegion(feature.properties.nom));
          this.$store.commit("resetECO2MIXCurrentRegion");
        });
        //this.tooltip();
      };
    },
  },
  methods: {
    getStyleForRegion(region) {
      const scale = chroma.scale(["green", "red"]);
      var category = this.$store.state.eco2mix_current_category;
      var ecodata = this.$store.state.eco2mix_data;
      if (category == null || ecodata == null) return null;
      const max = [...ecodata.entries()].reduce((a, e) =>
        e[1][category] > a[1][category] ? e : a
      );
      const min = [...ecodata.entries()].reduce((a, e) =>
        e[1][category] < a[1][category] ? e : a
      );
      const eco2mix_feat = this.$store.state.eco2mix_data.get(region);
      if (eco2mix_feat == undefined) {
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
        (eco2mix_feat[category] - min[1][category]) /
        (max[1][category] - min[1][category]);

      let color = scale(scaledValue).hex();
      return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },
    tooltip(layer, region) {
      var eco2mix_feat = null;
      console.log(this.$store.state.eco2mix_data);

      if (this.$store.state.eco2mix_data == null) eco2mix_feat = {};
      else eco2mix_feat = this.$store.state.eco2mix_data.get(region);
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
    },
    updateECO2MIXStyles() {
      this.$nextTick(() => {
        if (this.$refs.geojson && this.$refs.geojson.leafletObject) {
          console.log(this.$refs.geojson.leafletObject);
          this.$refs.geojson.leafletObject.eachLayer((layer) => {
            console.log(layer);
            var region = layer.feature.properties["nom"];
            // eslint-disable-next-line no-unused-vars
            layer.setStyle(this.getStyleForRegion(region));
            this.tooltip(layer, region);

            //layer.remove();
          });
          //this.$refs.geojson.leafletObject._map.invalidateSize(true);
        }
      });
    },
    afterMapLoad() {
      this.updateECO2MIXStyles();
    },
    async fetchData() {
      try {
        // Only fetch articles / links / categories if not yet done
        if (this.$store.state.regions_geo == null) {
          this.$store.dispatch("fetchRegionsGeo");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    current_eco2mix_category() {
      this.updateECO2MIXStyles();
    },
  },
  async created() {
    this.loading = true;
    console.log("Fetching geo data in REGIONS");
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