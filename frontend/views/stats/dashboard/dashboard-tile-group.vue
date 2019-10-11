<template>
  <card :bordered="false" :dis-hover="true">
    <tabs size="small" @on-click="onTile">
      <tab-pane v-for="it in tiles" :key="it.id" :label="it.title" :name="`${it.id}`"></tab-pane>
    </tabs>
    <component :is="activeTile.comp" :key="`comp-${activeTile.id}`" v-bind="activeTile.props"></component>
  </card>
</template>
<script>
export default {
  name: "dashboard-tile-group",
  props: {
    tiles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    activeTile() {
      return this.tiles[this.activeIndex];
    }
  },
  methods: {
    onTile(id) {
      this.activeIndex = this.tiles.findIndex(it => it.id === id);
    }
  }
};
</script>

