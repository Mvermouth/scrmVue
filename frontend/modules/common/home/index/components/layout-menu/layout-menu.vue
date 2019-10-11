<template>
  <Menu
    ref="menu"
    :class="menuClasses"
    width="auto"
    :open-names="openedMenus"
    @on-select="onSelectMenu"
    @toggle-opened="onMenuOpenedChange"
  >
    <layout-menu-item
      v-for="menu in menus"
      :key="menu.id"
      :menu="menu"
      :cls-prefix="clsPrefix"
      :opened-menus="openedMenus"
      :selected-menu="selectedMenu"
      :collapsed="collapsed"
      @on-select="onSelectMenu"
    ></layout-menu-item>
  </Menu>
</template>
<script>
import LayoutMenuItem from "./layout-menu-item.vue";
import { parseUrl, stringifyUrl } from "../../../../../../scripts/utils/url";

const walkMenu = (menus, cb) => {
  menus.forEach(it => {
    cb(it);
    walkMenu(it.children || [], cb);
  });
};

const getMenusMap = (menus, map) => {
  walkMenu(menus, it => (map[it.id] = it));
  return map;
};

const getMenusParentMap = (menus, parentId, map) => {
  menus.forEach(it => {
    map[it.id] = parentId || 0;
    getMenusParentMap(it.children || [], it.id, map);
  });
  return map;
};

const getMenusPathMap = (menus, map) => {
  walkMenu(menus, it => {
    if (it.funcType === "menu") map[normalizeUrl(it.url)] = it.id;
  });
  return map;
};

const normalizeUrl = url => {
  const { path, query, hash } = parseUrl(url, true);
  delete query._tgt;
  return stringifyUrl({ path, query, hash });
};

export default {
  name: "LayoutMenu",

  components: {
    LayoutMenuItem
  },

  props: {
    // 菜单数据
    menus: {
      type: Array,
      required: true
    },
    // 是否折叠
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    // 手风琴模式
    accordion: {
      type: Boolean,
      required: false,
      default: true
    },
    // 初始时菜单全部展开
    initUnfoldAll: {
      type: Boolean,
      required: false,
      default: true
    },
    // 样式前缀
    clsPrefix: {
      type: String,
      required: true
    }
  },

  data() {
    const openedMenus = [];
    if (this.initUnfoldAll) {
      walkMenu(
        this.menus,
        it => it.funcType === "catalog" && openedMenus.push(it.id)
      );
    }

    return {
      // 菜单预处理 menu id => menu
      menusMap: getMenusMap(this.menus, {}),
      // 数据预处理 menu id => parent menu id
      menusParentMap: getMenusParentMap(this.menus, 0, {}),
      // 数据预处理 menu path => menu id
      menusPathMap: getMenusPathMap(this.menus, {}),
      // 展开的菜单项
      openedMenus,
      // 折叠导航前展开的菜单项
      openedMenusBeforeCollapsed: [],
      // 选中的菜单项
      selectedMenu: 0,
      // 禁用菜单动画
      disableCollapseTransition: true
    };
  },

  computed: {
    menuClasses() {
      return {
        [`${this.clsPrefix}-nav`]: true,
        [`${this.clsPrefix}-nav-after`]: true,
        // iview 写死菜单折叠动画，当切换module时需要直接展开禁用动画
        "disable-collapse-transition": this.disableCollapseTransition
      };
    }
  },

  watch: {
    // 菜单数据变化
    menus() {
      const openedMenus = [];
      if (this.initUnfoldAll) {
        walkMenu(
          this.menus,
          it => it.funcType === "catalog" && openedMenus.push(it.id)
        );
      }
      this.menusMap = getMenusMap(this.menus, {});
      this.menusParentMap = getMenusParentMap(this.menus, 0, {});
      this.menusPathMap = getMenusPathMap(this.menus, {});
      this.openedMenus = openedMenus;
      this.openedMenusBeforeCollapsed;
      this.selectedMenu = 0;

      // 菜单数据变化临时禁用动画
      this.disableCollapseTransition = true;
      setTimeout(() => (this.disableCollapseTransition = false), 0);
    },

    // 菜单折叠/打开
    collapsed(newVal) {
      if (newVal) {
        // 折叠菜单，记录当前打开的菜单项用于恢复
        this.openedMenusBeforeCollapsed = this.openedMenus;
        this.openedMenus = [];
        this.$nextTick(() => {
          this.$refs.menu.updateOpened();
        });
      } else {
        // 打开菜单，恢复之前展开的菜单项
        this.openedMenus = this.openedMenusBeforeCollapsed;
        this.openedMenusBeforeCollapsed = [];
        this.$nextTick(() => {
          this.$refs.menu.updateOpened();
        });
      }
    },

    // 监听页面跳转
    $route: function() {
      const id = this.menusPathMap[normalizeUrl(this.$route.fullPath)];
      if (!id) return;

      const menu = this.menusMap[id];
      if (!menu) return;

      // 选中对应菜单
      if (this.selectedMenu !== id) this.selectedMenu = id;

      // 高亮菜单直接展开
      if (!this.collapsed) {
        if (this.openedMenus.indexOf(id) < 0) {
          this.onMenuOpenedChange(id);
        }
      }
    }
  },

  methods: {
    // 关闭自己和所有子菜单
    foldMenu(id) {
      const menu = this.menusMap[id];
      if (menu) {
        walkMenu([menu], it => {
          const idx = this.openedMenus.indexOf(it.id);
          if (idx >= 0) this.openedMenus.splice(idx, 1);
        });
      }
    },

    // 打开菜单 - 所有父菜单都要打开
    unfoldMenu(id) {
      let menu = this.menusMap[id];
      while (menu) {
        if (
          menu.funcType === "catalog" &&
          this.openedMenus.indexOf(menu.id) < 0
        )
          this.openedMenus.push(menu.id);
        menu = this.menusMap[this.menusParentMap[menu.id]];
      }
    },

    // 展开菜单项目变化
    onMenuOpenedChange(id) {
      if (this.openedMenus.indexOf(id) >= 0) {
        this.foldMenu(id);
      } else {
        if (this.accordion) {
          // 手风琴模式 - 关闭同级菜单和所有父菜单的同级菜单
          let menu = this.menusMap[id];
          while (menu) {
            const parentMenu = this.menusMap[this.menusParentMap[menu.id]];
            (parentMenu ? parentMenu.children : this.menus).forEach(
              it => it.id !== menu.id && this.foldMenu(it.id)
            );
            menu = parentMenu;
          }
        }
        this.unfoldMenu(id);
      }
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    },

    // 选中菜单项目
    onSelectMenu(id) {
      const menu = this.menusMap[id];
      if (menu && menu.funcType === "menu") {
        this.$router.push(menu.url);
        this.selectedMenu = id;
      }
    }
  }
};
</script>

