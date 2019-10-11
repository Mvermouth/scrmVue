<template>
  <div>
    <tabs v-if="dashboardItems.length > 1" size="small" @on-click="onDashboardItem">
      <tab-pane v-for="it in dashboardItems" :key="it.id" :label="it.title" :name="`${it.id}`"></tab-pane>
    </tabs>
    <row :gutter="10">
      <i-col v-for="it in tiles" :key="it.id" v-bind="it.size" class="mb10">
        <component :is="it.comp" v-bind="it.props"></component>
      </i-col>
    </row>
  </div>
</template>
<script>
import _ from "lodash";
import DashboardTile from "./dashboard-tile.vue";
import DashboardTileGroup from "./dashboard-tile-group.vue";
import DisplayComponents from "../components";

const Sizes = {
  small: { xs: 24, sm: 12, md: 12, lg: 6 },
  normal: { xs: 24, sm: 24, md: 24, lg: 12 },
  large: { xs: 24, sm: 24, md: 24, lg: 24 }
};
export default {
  name: "dashboard",
  components: {
    DashboardTile
  },
  props: {
    dashboard: {
      type: Array,
      required: true
    },
    customComponents: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      activeIndex: 0
    };
  },

  computed: {
    dashboardItems() {
      return this.dashboard
        .map((it, idx) => {
          it.id = idx;
          return it;
        })
        .filter(it => !it.module || _.includes(App.data.modules, it.module));
    },
    activeItem() {
      return this.dashboardItems[this.activeIndex];
    },
    tiles() {
      const tileData = (activeItem, tile, idx) => {
        tile.id = idx;
        const displayComponent =
          _.get(DisplayComponents, tile.type.split("/")[0]) ||
          this.customComponents[tile.type];
        const size = tile.size || displayComponent.size || "normal";
        return {
          comp: DashboardTile,
          id: `${activeItem.id}-${tile.id}`,
          title: tile.title,
          props: {
            type: tile.type,
            dashboardId: activeItem.id,
            tileId: tile.id,
            dataSources: tile.dataSources,
            baseUrl: activeItem.url,
            display: tile.display,
            displayComponent
          },
          size: typeof size === "string" ? Sizes[size] : size
        };
      };
      let idx = 0;
      return this.activeItem.tiles.map(it => {
        if (_.isArray(it)) {
          // tab切换
          const tiles = it.map(it2 => tileData(this.activeItem, it2, idx++));
          const size = tiles.sort((it1, it2) => {
            if (it1.size.lg !== it2.size.lg) return it2.size.lg - it1.size.lg;
            if (it1.size.md !== it2.size.md) return it2.size.md - it1.size.md;
            if (it1.size.sm !== it2.size.sm) return it2.size.sm - it1.size.sm;
            return it2.size.xs - it1.size.xs;
          })[0].size;
          return {
            comp: DashboardTileGroup,
            props: {
              tiles
            },
            size
          };
        } else {
          return tileData(this.activeItem, it, idx++);
        }
      });
    }
  },
  methods: {
    onDashboardItem(id) {
      this.activeIndex = this.dashboardItems.findIndex(
        it => it.id === parseInt(id)
      );
    }
  }
};
</script>

