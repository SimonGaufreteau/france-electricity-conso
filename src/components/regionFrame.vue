<template>
  <div>Current region is : {{ current_region }}</div>
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
  },
  methods: {
    fetchData() {
      if (this.$store.state.current_region == null) {
        this.$store.dispatch("fetchCurrentRegion");
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