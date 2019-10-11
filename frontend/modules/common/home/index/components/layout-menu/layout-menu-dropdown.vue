<template>
  <Dropdown
    :transfer="isRoot"
    :placement="isRoot ? 'right-start' : 'right'"
    @on-visible-change="onVisibleChange"
    @on-click="onSelectMenu"
    :class="`${clsPrefix}-nav-submenu-dropdown`"
  >
    <template>
      <div v-if="isRoot"></div>
      <DropdownItem v-else :class="dropItemCls" :name="menu.id">
        {{menu.name}}
        <Icon type="ios-arrow-right"></Icon>
      </DropdownItem>
    </template>
    <DropdownMenu
      ref="dropList"
      slot="list"
      @mouseover.native="onMouseOverChild"
      @mouseout.native="onMouseOutChild"
    >
      <template v-for="submenu in menu.children">
        <DropdownItem
          v-if="submenu.funcType === 'menu'"
          :key="`drop-${submenu.id}`"
          :name="submenu.id"
          :class="{[`${clsPrefix}-nav-submenu-drop-item-selected`]: (submenu.id === selectedMenu)}"
        >{{submenu.name}}</DropdownItem>
        <layout-menu-dropdown
          v-else-if="submenu.funcType === 'catalog'"
          :key="`drop-${submenu.id}`"
          :menu="submenu"
          :cls-prefix="clsPrefix"
          :selected-menu="selectedMenu"
        ></layout-menu-dropdown>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
  name: "LayoutMenuDropdown",

  props: {
    // 菜单数据
    menu: {
      type: Object,
      required: true
    },

    // 当前选中的菜单
    selectedMenu: {
      type: [Number, String, Boolean],
      required: true,
      default: 0
    },

    // 是否是根菜单节点
    isRoot: {
      type: Boolean,
      default: false
    },

    // 样式前缀
    clsPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      // 鼠标是否进入子菜单
      mouseover: false
    };
  },

  computed: {
    dropItemCls() {
      return {
        [`${this.clsPrefix}-nav-submenu-drop-item-expanded`]: this.mouseover,
        [`${this.clsPrefix}-nav-submenu-drop-item-selected`]:
          this.menu.id === this.selectedMenu
      };
    }
  },

  mounted() {
    this.overrideDefaultStyles();
  },

  updated() {
    // drop组件封装中，update组件时会重置transfer wrap的样式，因此这里需要再次设置
    this.$nextTick(() => {
      this.overrideDefaultStyles();
    });
  },

  methods: {
    onMouseOverChild() {
      this.mouseover = true;
      this.$emit("on-enter");
    },

    onMouseOutChild() {
      this.mouseover = false;
      this.$emit("on-leave");
    },

    onVisibleChange(visible) {
      // drop组件封装中，在切换显示时会重置transfer wrap的样式，因此这里需要再次设置
      this.$nextTick(() => {
        this.overrideDefaultStyles();
      });
    },

    onSelectMenu(id) {
      this.$emit("on-select", id);
    },

    overrideDefaultStyles() {
      // 下拉菜单悬浮部分添加样式，方便控制
      const cls = `${this.clsPrefix}-nav-submenu-drop`;
      const clsRoot = `${this.clsPrefix}-nav-submenu-drop-root`;

      const dropWarp = this.$refs.dropList.$el.parentElement;
      if (!dropWarp.classList.contains(cls)) {
        dropWarp.classList.add(cls);
      }
      if (this.isRoot && !dropWarp.classList.contains(clsRoot)) {
        dropWarp.classList.add(clsRoot);
      }
      // TODO windows firefox 弹出菜单位置错误
    }
  }
};
</script>

