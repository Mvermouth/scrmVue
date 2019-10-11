<template>
    <div>
        <page-header v-bind="headerProps"></page-header>
    </div>
</template>
<script>
import PageHeader from "../../../../../views/domain/retrieve/header.vue";

import header from "./header";

import Contact from "../../../../../models/im/contact";

export default {
  components: {
    PageHeader,
  },

  props: {
    contact: {
      type: Object,
      required: true
    }
  },

  data() {
    const headerProps = header(this.contact);

    return {
      headerProps
    };
  },
  methods: {
  }
};
</script>
