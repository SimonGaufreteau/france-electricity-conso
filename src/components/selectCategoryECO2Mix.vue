<template>
  <select v-model="current_eco2mix_category">
    <option disabled value="">Please select one</option>
    <option v-for="category in eco2mix_categories" v-bind:key="category">
      {{ category }}
    </option>
  </select>
</template>

<script>
export default {
  name: "selectCategoryECO2Mix",
  computed: {
    eco2mix_categories: {
      get() {
        return this.$store.state.eco2mix_categories;
      },
    },

    current_eco2mix_category: {
      get() {
        return this.$store.state.eco2mix_current_category;
      },
      set(value) {
        this.$store.commit("updateECO2MIXCurrentCategory", value);
      },
    },
  },
  methods: {
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
  async created() {
    this.fetchData();
  },
};
</script>

<style>
</style>