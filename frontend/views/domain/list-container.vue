<template>
    <div>
        <component
			      v-bind:is="listComponent"
            v-bind:listItemComponent="listItemComponent"
			      v-bind:items="items"
            v-bind:listDelegator="listDelegator"
            v-bind:selections="listDataSource.selections"
            v-bind:idKey="idKey"
            >
		</component>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>
<script>
export default {
  props: {
    listComponent: {
      type: Object
    },
    listItemComponent: {
      type: Object
    },
    listDataSource: {
      type: Object
    },
    listDelegator: {
      type: Object
    },
    selection: {
      type: [String, Boolean]
    }
  },
  computed: {
    loading() {
      return this.listDataSource.loading
    },
    // 数据的唯一标识字段
    idKey() {
      return this.listDataSource.idKey
    }
  },
  watch: {
    listDataSource() {
      this.items = this.buildItems()
    }
  },
  data() {
    return {
      items: this.buildItems()
    };
  },
  methods: {
    buildItems() {
      const items = _.cloneDeep(this.listDataSource.result.content)
      return items
    }
  }
};
</script>