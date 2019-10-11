<template>
  <div>
    <page-header v-bind="headerProps" @on-tab="onTab"></page-header>
    <card v-if="authorizedTabs.includes('relation')" v-show="tab === 'relation'">
      <!-- <domain-page :form-props="relationFormProps" :table-props="relationTableProps" v-bind="relationProps"></domain-page> -->
      <tabs-page
        :form-props="relationFormProps"
        :table-props="relationTableProps"
        v-bind="relationProps"
      ></tabs-page>
    </card>
    <card v-if="authorizedTabs.includes('message')" v-show="tab === 'message'">
      <domain-page
        :form-props="messageFormProps"
        :table-props="messageTableProps"
        v-bind="messageProps"
      ></domain-page>
    </card>
    <!-- <card v-if="authorizedTabs.includes('order')" v-show="tab === 'order'">
			<domain-page :form-props="orderFormProps" :table-props="orderTableProps" v-bind="orderProps"></domain-page>
    </card>-->
    <card v-if="authorizedTabs.includes('session')" v-show="tab === 'session'">
      <domain-page
        :form-props="sessionFormProps"
        :table-props="sessionTableProps"
        v-bind="sessionProps"
      ></domain-page>
    </card>
    <card v-if="authorizedTabs.includes('fund')" v-show="tab === 'fund'">
      <domain-page :form-props="fundFormProps" :table-props="fundTableProps" v-bind="fundProps"></domain-page>
    </card>
    <card v-if="authorizedTabs.includes('group')" v-show="tab === 'group'">
      <domain-page :form-props="groupFormProps" :table-props="groupTableProps" v-bind="groupProps"></domain-page>
    </card>
    <card v-if="authorizedTabs.includes('timeline')" v-show="tab === 'timeline'">
      <domain-page
        :form-props="timelineFormProps"
        :table-props="timelineTableProps"
        v-bind="timelineProps"
      ></domain-page>
    </card>
    <!-- <card v-if="authorizedTabs.includes('log')" v-show="tab === 'log'">
			<domain-page :form-props="actionFormProps" :table-props="actionTableProps" v-bind="actionProps"></domain-page>
    </card>-->
  </div>
</template>
<script>
import PageHeader from "../../../../../views/domain/retrieve/header.vue";
import DomainPage from "../../../../../views/domain/page.vue";
import TabsPage from "../../../../../views/domain/tabs-page.vue";

// import FundForm from '../funTable/form-items'
import FundColumns from "../funTable/columns";
import Fund from "../../../../../models/im/fund";

import AuditColumns from "../../../audit/page/table/columns";
import Audit from "../../../../../models/im/audit";

import GroupColumns from "../groupTable/columns";
import Group from "../../../../../models/im/group";

// import TimelineForm from '../timelineTable/form-items'
import TimelineColumns from "../timelineTable/columns";
import Timeline from "../../../../../models/im/timeline";

import OrderColumns from "../../../../ecommerse/order/page/table/columns";
import OrderForm from "../../../../ecommerse/order/page/table/form-items";
import Order from "../../../../../models/ecommerse/order";

import RelationForm from "../relationTable/form-items";
import RelationColumns from "../relationTable/columns";
import RequestColumns from "../relationTable/requestColumns";
import Relation from "../../../../../models/im/relation";

import SessionForm from "../sessionTable/form-items";
import SessionColumns from "../sessionTable/columns";

import messageForm from "../messageTable/form-items";
import messageColumns from "../messageTable/columns";

import Profile from "../../../../../models/im/profile";
import Session from "../../../../../models/im/session";
import header from "./header";
import Constant from "../../../../../configs/constant";
import Message from "../../../../../models/im/message";
export default {
  components: {
    PageHeader,
    DomainPage,
    TabsPage
  },

  props: {
    profile: {
      type: Object,
      required: true
    }
  },

  data() {
    const headerProps = header(this.profile);
    const authorizedTabs = headerProps.tabs.map(it => Object.values(it)[0]);

    // 自定义加载数据
    const actionLoadPage = async (pageNo, pageSize, filter, sort) => {
      // 微信号的搜索转换成wxId的搜索
      let platformUid;
      if (!_.isEmpty(filter)) {
        filter.forEach(it => {
          if (it.property === "platformUid") platformUid = it.value;
        });
      }
      return await Audit.page(platformUid, pageNo, pageSize, -1);
    };
    const defaultSort = [
      {
        ignoreCase: false,
        property: "ctime",
        type: "DSC"
      }
    ];
    return {
      authorizedTabs,
      tab: "",
      headerProps,
      relationProps: {
        domain: Relation,
        formItems: RelationForm,
        tabs: [
          {
            name: "contact",
            label: "好友",
            columns: RelationColumns,
            defaultCriterias: [
              {
                filterType: "EQ",
                property: "profile.id",
                value: this.profile.id
              },
              {
                filterType: "EQ",
                property: "contact.type",
                value: 0
              },

              {
                filterType: "EQ",
                property: "status",
                value: Constant.ImRelationStatus.Contact.value
              },
              {
                filterType: "NE",
                property: "blacklistByContact",
                value: 1
              },
              {
                filterType: "NE",
                property: "blacklistByAccount",
                value: 1
              }
            ],
            defaultSort
          },
          {
            name: "deleted_contact",
            label: "已删除好友",
            columns: RelationColumns,
            loadPage: Relation.pageDelete.bind(Relation),
            defaultCriterias: [
              {
                filterType: "EQ",
                property: "profile.id",
                value: this.profile.id
              },
              {
                filterType: "EQ",
                property: "contact.type",
                value: 0
              }
            ],
            defaultSort
          },
          {
            name: "request_contact",
            label: "好友请求",
            columns: RequestColumns,
            defaultCriterias: [
              {
                filterType: "EQ",
                property: "profile.id",
                value: this.profile.id
              },
              {
                filterType: "EQ",
                property: "contact.type",
                value: 0
              },
              {
                filterType: "EQ",
                property: "status",
                value: Constant.ImRelationStatus.RequestAccount.value
              }
            ],
            defaultSort: [
              {
                ignoreCase: false,
                property: "requestTime",
                type: "DSC"
              }
            ]
          }
        ]
      },
      sessionProps: {
        domain: Session,
        formItems: SessionForm,
        columns: SessionColumns,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "fromContact.id",
            value: this.profile.contactID
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "syncTime",
            type: "DSC"
          }
        ]
      },
      messageProps: {
        domain: Message,
        formItems: messageForm,
        columns: messageColumns,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "profileContactID",
            value: this.profile.contactID
          },
          {
            filterType: "EQ",
            property: "sessionType",
            value: 1
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "sendTime",
            type: "DSC"
          }
        ]
      },
      fundProps: {
        domain: Fund,
        // formItems: FundForm,
        columns: FundColumns,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "profile.id",
            value: this.profile.id
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "sendTime",
            type: "DSC"
          }
        ]
      },
      groupProps: {
        domain: Group,
        columns: GroupColumns,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "profile.id",
            value: this.profile.id
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "ctime",
            type: "DSC"
          }
        ]
      },
      timelineProps: {
        domain: Timeline,
        columns: TimelineColumns,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "publisher.id",
            value: this.profile.contactID
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "publishTime",
            type: "DSC"
          }
        ]
      },
      orderProps: {
        domain: Order,
        columns: OrderColumns,
        //formItems:OrderForm,
        loadPage: async (pageNo, pageSize, filter, sort) => {
          return await Order.pageNoAuth(pageNo, pageSize, filter, sort);
        },
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "orderExtStr4",
            value: this.profile.contactID
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "ctime",
            type: "DSC"
          }
        ]
      },
      actionProps: {
        domain: Audit,
        columns: AuditColumns,
        loadPage: actionLoadPage,
        defaultCriterias: [
          {
            filterType: "EQ",
            property: "platformUid",
            value: this.profile.platformUid
          }
        ],
        defaultSort: [
          {
            ignoreCase: false,
            property: "ctime",
            type: "DSC"
          }
        ],
        actions: ["view"]
      }
    };
  },

  computed: {
    timelineUrl() {
      return `${Profile.baseUrl}/timeline/${this.profile.contactID}`;
    },

    relationFormProps() {
      return {
        visible: this.tab === "relation",
        labelWidth: 120
      };
    },

    relationTableProps() {
      return {
        visible: this.tab === "relation"
      };
    },

    sessionFormProps() {
      return {
        visible: this.tab === "session",
        labelWidth: 120
      };
    },

    sessionTableProps() {
      return {
        visible: this.tab === "session"
      };
    },
    messageFormProps() {
      return {
        visible: this.tab === "message",
        labelWidth: 120
      };
    },

    messageTableProps() {
      return {
        visible: this.tab === "message"
      };
    },
    fundFormProps() {
      return {
        visible: this.tab === "fund",
        labelWidth: 120
      };
    },

    fundTableProps() {
      return {
        visible: this.tab === "fund"
      };
    },

    groupFormProps() {
      return {
        visible: this.tab === "group"
      };
    },

    groupTableProps() {
      return {
        visible: this.tab === "group"
      };
    },

    timelineFormProps() {
      return {
        visible: this.tab === "timeline"
      };
    },

    timelineTableProps() {
      return {
        visible: this.tab === "timeline"
      };
    },
    orderFormProps() {
      return {
        visible: this.tab === "order"
      };
    },
    orderTableProps() {
      return {
        visible: this.tab === "order"
      };
    },

    actionFormProps() {
      return {
        visible: this.tab === "log"
      };
    },

    actionTableProps() {
      return {
        visible: this.tab === "log"
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
