<template>
  <component
    :is="displayComponent"
    :type="type"
    :loading="loading"
    :display="display"
    :data-sources="dataSources"
    :values="values"
    :error="error"
    @query-change="onQueryChange"
    @refresh="fetchStats"
    @export="onExport"
  ></component>
</template>
<script>
import { fetchStats, exportStats } from "./fetch-stats";
export default {
  name: "dashboard-tile",
  props: {
    dashboardId: {
      type: [String, Number],
      required: true
    },
    tileId: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    display: {
      type: Object,
      required: true
    },
    dataSources: {
      type: Array,
      required: true
    },
    baseUrl: {
      type: String,
      required: true
    },
    displayComponent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      values: [],
      query: null,
      error: null
    };
  },
  watch: {
    query() {
      this.fetchStats();
    }
  },
  methods: {
    async fetchStats() {
      try {
        this.loading = true;
        this.values = await fetchStats(
          this.dashboardId,
          this.tileId,
          this.dataSources,
          this.query,
          this.baseUrl
        );
        this.loading = false;
        this.error = null;
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.error = e.response && e.response.data;
      }
    },
    onQueryChange(query) {
      this.query = query;
    },
    onExport(query) {
      exportStats(
        this.dashboardId,
        this.tileId,
        this.dataSources,
        query,
        this.baseUrl
      );
    }
  }
};
</script>

