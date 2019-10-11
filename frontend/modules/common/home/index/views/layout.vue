<template>
  <Layout :class="clsPrefix">
    <Sider
      :class="`${clsPrefix}-sider`"
      ref="sider"
      v-model="isCollapsed"
      breakpoint="md"
      collapsible
      hide-trigger
      :width="230"
      :collapsed-width="80"
    >
      <div :class="`${clsPrefix}-title`" id="layout-side-title">
        <div v-if="site.logo" :style="{backgroundImage: `url(${site.logo})`}"></div>
        <h1 v-if="site.title">{{site.title}}</h1>
      </div>
      <div :class="`${clsPrefix}-nav-wrap-out`" id="layout-side-nav">
        <div :class="`${clsPrefix}-nav-wrap-in`">
          <layout-menu
            :cls-prefix="clsPrefix"
            :accordion="false"
            :init-unfold-all="true"
            :menus="sideNavMenus"
            :collapsed="isCollapsed"
          ></layout-menu>
        </div>
      </div>
    </Sider>
    <Layout style="overflow-y:hidden;">
      <Header :class="`${clsPrefix}-header`" id="layout-header">
        <Icon
          @click.native="onCollapseSider"
          :class="[`${clsPrefix}-trigger`, {[`${clsPrefix}-trigger-collapsed`]: isCollapsed}]"
          type="navicon-round"
          size="24"
        ></Icon>
        <div v-if="modules.length > 0" class="menus">
          <!--div ref="moduleMenus"-->
          <a
            v-for="m in modules"
            :class="{'menu-item': true, 'menu-item-active': currentModule && currentModule.name === m.name}"
            :key="`module_${m.name}`"
            @click="switchModule(m)"
          >
            <icon-font v-bind="m.icon || { name:'', value:'' }"/>
            {{m.name}}
          </a>
          <a v-if="enableUim" class="menu-item" @click="() => $refs.modalUim.open()">
            <icon-font v-bind="{ name:'iconfont', value:'e644' }"/>客服聊天
          </a>
          <!--/div-->
          <!--div class="active-bar" :style="activeBarStyle"></div-->
        </div>
        <div class="tools">
          <!--span class="action"><i class="fas fa-expand-arrows-alt"/></span-->
          <!-- <span class="action"><i type="md-card"/></span> -->
          <div class="action" v-if="config.qr_code_pay">
            <i @click="toPayment" class="fas fa-credit-card"/>
          </div>
          <!-- <span class="action"><i class="fas fa-bell"/><Badge dot class-name="badge"></Badge></span> -->
          <Dropdown class="action" transfer @on-click="onUserAction">
            <span>
              <Avatar size="small" icon="person" :src="user.avatar"></Avatar>
              <span class="name">{{user.nickname || ''}}</span>
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="settings">设置</DropdownItem>
              <DropdownItem name="logout" divided>退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Content
        :class="`${clsPrefix}-content-wrap`"
        v-resize="onResizeContentWrap"
        ref="contentWrap"
      >
        <layout-nav :menus="menus" :cls-prefix="clsPrefix" @on-urls="onNavUrls" id="layout-nav"></layout-nav>
        <div
          :class="`${clsPrefix}-content`"
          id="layout-content"
          :style="{ height: `${contentHeight}px` }"
        >
          <div class="content-loading" v-if="contentLoading">
            <div class="loading-wrap">
              <Spin fix size="large"></Spin>
            </div>
          </div>
          <multi-iframe-router-view
            v-if="$router.currentTarget === 'iframe'"
            :active-srcs="navUrls"
            @load-start="() => contentLoading = true"
            @load-complete="() => contentLoading = false"
          ></multi-iframe-router-view>
          <router-view v-else></router-view>
        </div>
        <dialog-view
          :cls-prefix="clsPrefixDialog"
          :layout="layoutDialog"
          :constraint="contentWrapSize"
          :minimized-width="dialogMinimizedWidth"
          :minimized-height="dialogMinimizedHeight"
        ></dialog-view>
      </Content>
      <!--Footer id="layout-footer" :class="`${clsPrefix}-footer`">
                <p class="copyright">{{site.copyright}}</p>
      </Footer-->
      <modal-uim ref="modalUim"></modal-uim>
    </Layout>
  </Layout>
</template>
<script>
import _ from "lodash";
import Cookies from "js-cookie";
import LayoutMenu from "../components/layout-menu/layout-menu.vue";
import LayoutNav from "../components/layout-nav/layout-nav.vue";
import { modalLayouts } from "../../../../../scripts/utils/ui";
import { parseUrl, stringifyUrl } from "../../../../../scripts/utils/url";
import AppRoutes from "../../../../../configs/AppRoutes";
import Personal from "../../../../../models/system/personal";
import Payment from "../../../../../models/ecommerse/payment";
import ModalUim from "../../../../../views/modals/uim/index.vue";
import Axios from "axios";

 

// 选取第一个菜单作为默认菜单
const getHeadMenu = menus => {
  return (
    menus
      .map(it => (it.funcType === "menu" ? it : getHeadMenu(it.children || [])))
      .filter(it => !!it)[0] || null
  );
};
const defaultMenu = getHeadMenu(App.data.menus || []);

// 模块菜单
const modules = App.data.menus.filter(it => it.funcType === "module");
// 模块默认菜单
const moduleHeadMenus = _.mapValues(_.keyBy(modules, "name"), it =>
  getHeadMenu(it.children)
);

// 菜单URL => 模块
const walkMenus = (menus, cb) => {
  menus.forEach(it => {
    cb(it);
    walkMenus(it.children || [], cb);
  });
};

const url2Modules = {};
modules.forEach(it => {
  walkMenus(it.children || [], menu => {
    if (menu.funcType === "menu") url2Modules[menu.url] = it;
  });
});

const normalizeUrl = url => {
  const { path, query, hash } = parseUrl(url, true);
  delete query._tgt;
  return stringifyUrl({ path, query, hash });
};

export default {
  components: {
    LayoutMenu,
    LayoutNav,
    ModalUim
  },

  data() {
    return {
      // 导航菜单是否折叠
      isCollapsed: false,
      // 网站配置
      config: App.data.config || {},
      // 是否开启客服聊天
      enableUim: App.data.enableUim,
      // 网站信息
      site: App.data.site || {},
      // 网站菜单配置
      menus: App.data.menus || [],
      // 登录用户信息
      user: App.data.user || {},
      // 模块导航
      modules,
      // 模块首页
      moduleHeadMenus,
      // 当前页面所属模块
      currentModule: null,
      // 侧边导航的菜单
      sideNavMenus: [],
      // 当前打开的链接
      navUrls: [],
      // 内容区域自适应高度
      contentHeight: 0,
      // 内容容器大小
      contentWrapSize: {
        width: 0,
        height: 0
      },
      // 内容加载中
      contentLoading: true,
      // 样式前缀
      clsPrefix: `${App.options.styles.prefix}layout`,
      clsPrefixDialog: `${App.options.styles.prefix}dialog`,
      // 对话框布局配置
      layoutDialog: modalLayouts(),
      // 对话框最小化宽度
      dialogMinimizedWidth: Math.floor(App.options.styles.fontSizeBase * 15),
      // 对话框最小化高度
      dialogMinimizedHeight: Math.floor(App.options.styles.fontSizeBase * 2.5)
      // activeBarLeft: 0,
      // activeBarWidth: 0
    };
  },

  mounted() {
    // 进入初始页
    const initUrl = App.data.referer || (defaultMenu && defaultMenu.url);
    if (initUrl) {
      this.$router.replace(initUrl);
    }

    // 自适应布局
    window.addEventListener("resize", this.onResize.bind(this), true);

    // 初始计算内容高度
    this.$nextTick(() => {
      this.onResize();
    });

    // 模块菜单高亮
    // setTimeout(() => this.updateModuleMenuActiveBar(), 0);
  },

  computed: {
    // activeBarStyle() {
    //   const scaleX = this.activeBarWidth || 1;
    //   return {
    //     transform: `scaleX(${scaleX}) translateX(${(
    //       this.activeBarLeft / scaleX
    //     ).toFixed(2)}px)`
    //   };
    // }
  },

  methods: {
    // 切换模块，打开模块默认菜单
    switchModule(module) {
      const url = this.moduleHeadMenus[module.name].url;
      App.push(url);
    },

    // 导航菜单折叠切换
    onCollapseSider() {
      this.$refs.sider.toggleCollapse();
    },

    // 跳转到支付页面
    toPayment() {
      App.push(AppRoutes.Payment.createQR());
    },

    // 当前导航的url
    onNavUrls(urls) {
      this.navUrls = urls;
    },

    // 窗口大小变化，内容高度自适应
    onResize() {
      // 侧边栏
      const sideTitleH = document.getElementById("layout-side-title")
        .clientHeight;
      const sideNavH = document.getElementById("layout-side-nav").clientHeight;
      // 内容
      const headerH = document.getElementById("layout-header").clientHeight;
      const footerH = 0; // document.getElementById('layout-footer').clientHeight
      const navH = document.getElementById("layout-nav").clientHeight;
      this.contentHeight = sideTitleH + sideNavH - headerH - footerH - navH;
    },

    // 内容容器范围变化
    onResizeContentWrap() {
      const wrap = this.$refs.contentWrap.$el;
      this.contentWrapSize = {
        width: wrap.clientWidth,
        height: wrap.clientHeight
      };
    },

    onUserAction(name) {
      switch (name) {
        case "logout": {
          // 退出登录
          const url = encodeURIComponent(window.location.href);
          window.location.href = `/auth/logout?url=${url}`;
          break;
        }
        case "settings": {
          // 跳转个人中心
          App.push(AppRoutes.User.home(this.user.nickname));
          break;
        }
        default: {
          break;
        }
      }
    },
    enterPersonal() {}

    // updateModuleMenuActiveBar() {
    //   if (!this.currentModule) return;
    //   const anchors = Array.prototype.slice.call(
    //     this.$refs.moduleMenus.childNodes
    //   );
    //   const anchor = anchors[this.modules.indexOf(this.currentModule)];
    //   this.activeBarLeft = anchor.offsetLeft;
    //   this.activeBarWidth = anchor.offsetWidth;
    // }
  },

  watch: {
    // 页面切换时调整module
    $route: function() { 
      const url = normalizeUrl(this.$route.fullPath);
      let mod = url2Modules[url];
      // 根据功能配置找到对应module
      if (mod) {
        this.currentModule = mod;
        this.sideNavMenus = mod.children || [];
        Cookies.set("_module", mod.id);
        return;
      }
      // 查看url是否指定了模块
      const { query } = parseUrl(this.$route.fullPath, true);
      if (query._module) {
        mod = this.menus.filter(it => it.id === query._module);
        if (mod) {
          this.currentModule = mod;
          this.sideNavMenus = mod.children || [];
          Cookies.set("_module", mod.id);
          return;
        }
      }
      // 继续使用之前页面的module
      if (this.currentModule) {
        return;
      }
      // 默认使用第一个module
      mod = this.modules[0];
      if (mod) {
        this.currentModule = mod;
        this.sideNavMenus = mod.children || [];
        Cookies.set("_module", mod.id);
        return;
      }
      // 没有配置模块
      this.sideNavMenus = this.menus;

      //this.updateModuleMenuActiveBar();
    }
  }
};
</script>