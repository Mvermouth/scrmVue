<template>
  <Submenu v-if="menu.funcType === 'catalog'" :name="menu.id" :class="submenuCls">
    <div
      ref="submenuTitle"
      :class="submenuTitleCls"
      :style="{paddingLeft: menuPaddingLeft}"
      slot="title"
      @click="onClickSubmenu"
    >
      <span class="icon">
        <icon-font v-bind="menu.icon || defaults.menu.icon"/>
      </span>
      <span class="name">{{menu.name}}</span>
      <layout-menu-dropdown
        v-if="collapsed && depth === 1"
        is-root
        class="drop-menu"
        :menu="menu"
        :selected-menu="selectedMenu"
        :cls-prefix="clsPrefix"
        @on-enter="onEnterSubmenuDropdown"
        @on-leave="onLeaveSubmenuDropdown"
        @on-select="onSelectMenu"
      ></layout-menu-dropdown>
    </div>
    <layout-menu-item
      v-for="submenu in menu.children"
      :key="submenu.id"
      :menu="submenu"
      :collapsed="collapsed"
      :opened-menus="openedMenus"
      :selected-menu="selectedMenu"
      :cls-prefix="clsPrefix"
      :depth="depth + 1"
    ></layout-menu-item>
  </Submenu>
  <menu-item
    v-else-if="menu.funcType === 'menu'"
    :style="{paddingLeft: '0px'}"
    :name="menu.id"
    :class="menuItemCls"
  >
    <div :style="{paddingLeft: menuPaddingLeft}">
      <span class="icon">
        <icon-font v-bind="menu.icon || defaults.menu.icon"/>
      </span>
      <span class="name">{{menu.name}}</span>
    </div>
  </menu-item>
</template>
<script>
import LayoutMenuDropdown from "./layout-menu-dropdown.vue";
import { findComponentUpward } from "../../../../../../scripts/utils/ui";

export default {
  name: "LayoutMenuItem",

  components: {
    LayoutMenuDropdown
  },

  props: {
    // 菜单信息
    menu: {
      type: Object,
      required: true
    },

    // 导航是否折叠
    collapsed: {
      type: Boolean,
      required: true
    },

    // 菜单层级深度
    depth: {
      type: Number,
      required: false,
      default: 1
    },

    // 展开的菜单
    openedMenus: {
      type: Array,
      required: false,
      default: []
    },

    // 选择的菜单
    selectedMenu: {
      type: [Number, String, Boolean],
      required: false,
      default: ""
    },

    // 样式前缀
    clsPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      // 鼠标进入了dropdown菜单
      inDropdown: false,

      // 默认值
      defaults: {
        menu: {
          icon: {
            name: "",
            value: ""
          }
        }
      }
    };
  },

  computed: {
    // 菜单是否展开
    isOpened() {
      return this.openedMenus.indexOf(this.menu.id) >= 0;
    },

    // 菜单是否选中
    isSelected() {
      return this.isMenuSelected(this.menu);
    },

    // submenu 样式
    submenuCls() {
      return [
        `${this.clsPrefix}-nav-item`,
        `${this.clsPrefix}-nav-submenu`,
        {
          [`${this.clsPrefix}-nav-submenu-opened`]: this.isOpened,
          [`${this.clsPrefix}-nav-submenu-selected`]: this.isSelected
        }
      ];
    },

    submenuTitleCls() {
      return [
        `${this.clsPrefix}-nav-submenu-title`,
        {
          [`${this.clsPrefix}-nav-submenu-title-collapsed`]: this.collapsed,
          [`${this.clsPrefix}-nav-submenu-title-expanded`]: this.inDropdown
        }
      ];
    },

    // menu-item样式
    menuItemCls() {
      return [
        `${this.clsPrefix}-nav-item`,
        `${this.clsPrefix}-nav-menu-item`,
        {
          [`${this.clsPrefix}-nav-menu-item-normal`]: !this.isSelected,
          [`${this.clsPrefix}-nav-menu-item-selected`]: this.isSelected,
          [`${this.clsPrefix}-nav-menu-item-collapsed`]:
            this.collapsed && this.depth === 1
        }
      ];
    },

    menuPaddingLeft() {
      return this.collapsed ? "30px" : this.depth * 24 + "px";
    }
  },

  mounted() {
    this.overrideDefaultStyles();
  },

  methods: {
    onClickSubmenu(e) {
      // iview submenu下无法挂载submenu形成多级菜单，因此这里屏蔽默认行为自己处理
      e.preventDefault();
      e.stopPropagation();
      // submenu折叠事件
      if (!this.collapsed) {
        const $menu = findComponentUpward(this, "Menu");
        $menu.$emit("toggle-opened", this.menu.id);
      }
    },

    // 递归检查菜单及其子菜单是否选中
    isMenuSelected(menu) {
      if (this.selectedMenu === menu.id) {
        return true;
      }
      return menu.children.some(it => {
        return this.isMenuSelected(it);
      });
    },

    // 重置默认样式
    overrideDefaultStyles() {
      if (this.menu.funcType === "catalog") {
        // iview中嵌套的submenu会自动缩进，这里重置
        this.$refs.submenuTitle.parentElement.removeAttribute("style");
      }
    },

    onEnterSubmenuDropdown() {
      this.inDropdown = true;
    },

    onLeaveSubmenuDropdown() {
      this.inDropdown = false;
    },

    onSelectMenu(id) {
      this.$emit("on-select", id);
    }
  }
};
</script>
