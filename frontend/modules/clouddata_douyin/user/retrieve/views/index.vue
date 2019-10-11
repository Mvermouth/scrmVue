<template>
  <div>
    <page-header v-bind="headerProps" @on-tab="onTab"></page-header>
    <card v-show="tab === 'post'">
      <!-- domain-page :form-props="postFormProps" :table-props="postTableProps" v-bind="postProps"></domain-page -->
      <domain-page v-bind="postProps"></domain-page>
    </card>
  </div>
</template>
<script>
import PageHeader from "../../../../../views/domain/retrieve/header.vue";
import DomainPage from "../../../../../views/domain/page.vue";
import TabsPage from "../../../../../views/domain/tabs-page.vue";

import User from "../../../../../models/clouddata/douyin/user";
import Post from "../../../../../models/clouddata/douyin/post";

import PostForm from "../post_list/form-items";
import PostColumns from "../post_list/columns";
import defaultAvatar from "../../../../../images/default-avatar.png";

import PostListItem from "../components/post_list_item/index.vue";

export default {
  components: {
    PageHeader,
    DomainPage,
    TabsPage,
    PostListItem
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    const headerProps = {
      title: `用户 ${this.user.nickname || "未知"}`,
      logo: this.user.avatar_thumb.url_list[0] || defaultAvatar,
      content: [
        { 抖音号: this.user.short_id },
        { 微信: this.user.wechat },
        { 签名: this.user.signature },
        { region: this.user.region },
        { 国家: this.user.country },
        { 省份: this.user.province },
        { 城市: this.user.city },
        { 定位: this.user.location },
        { 生日: this.user.birthday },
        { status: this.user.status },
        { user_rate: this.user.user_rate },
        { 是否认证: this.user.is_verified ? "是" : "否" },
        { 是否卖家: this.user.live_commerce ? "是" : "否" },
        { 作品数: this.user.aweme_count },
        { 获赞数: this.user.total_favorited },
        { 喜欢数: this.user.favoriting_count },
        { 粉丝数: this.user.follower_count },
        { 关注数: this.user.following_count }
      ],
      extra: [
        // { '订单总数': 0 },
      ],
      actions: [
        {
          编辑: () => {
            alert("修改备注/微信号");
            /*App.push(
              AppRoutes.Profile.update(profile[Profile.primaryKey], profileName)
            );
            */
          }
        }
      ],
      tabs: [{ 作品: "post" }]
    };

    const defaultSort = [
      {
        property: "ctime",
        type: "DSC"
      }
    ];

    return {
      tab: "",
      headerProps,
      postProps: {
        domain: Post,
        display: "grid",
        formItems: PostForm,
        columns: PostColumns,
        defaultCriterias: [
          {
            filterType: "$eq",
            property: "uid",
            value: this.user.id
          }
        ],
        defaultSort: [
          {
            property: "mtime",
            type: "DSC"
          }
        ],
        renderGrid: (h, ctx, $grid) => {
          h = this.$root.$createElement;
          return <PostListItem item={ctx.row} />;
        }
      }
    };
  },
  computed: {
    postFormProps() {
      return {
        visible: this.tab === "post",
        labelWidth: 120
      };
    },
    postTableProps() {
      return {
        visible: this.tab === "post"
      };
    }
  },

  methods: {
    onTab(name) {
      this.tab = name;
    }
  }
};
</script>
