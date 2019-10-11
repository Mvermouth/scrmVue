<template>
    <div>
        <template v-if="!relation">
            抱歉！未找到好友信息!
        </template>
        <template v-else>
            <page-header v-bind="headerProps" @on-tab="onTab"></page-header>

            <card v-if="authorizedTabs.includes('fund')" v-show="tab === 'fund'">
                <domain-page :form-props="fundFormProps" :table-props="fundTableProps" v-bind="fundProps"></domain-page>
            </card>
			<!-- <card v-if="authorizedTabs.includes('order')" v-show="tab === 'order'">
				<domain-page :form-props="orderFormProps" :table-props="orderTableProps" v-bind="orderProps"></domain-page>
			</card> -->
            <card v-if="authorizedTabs.includes('session')" v-show="tab === 'session'">
                <domain-page :form-props="sessionFormProps" :table-props="sessionTableProps" v-bind="sessionProps"></domain-page>
            </card>
            <card v-if="authorizedTabs.includes('timeline')" v-show="tab === 'timeline'">
                <domain-page :form-props="timelineFormProps" :table-props="timelineTableProps" v-bind="timelineProps"></domain-page>
            </card>
			<modal-uim></modal-uim>
        </template>
    </div>
</template>
<script>
import PageHeader from '../../../../../views/domain/retrieve/header.vue'
import DomainPage from '../../../../../views/domain/page.vue'
import ModalUim from '../../../../../views/modals/uim/index.vue'

import header from './header'

import Fund from '../../../../../models/im/fund'
import FundColumns from '../../../fund/page/table/columns'

import Timeline from '../../../../../models/im/timeline'
import TimelineColumns from '../../../timeline/page/table/columns'

import OrderColumns from '../../../../ecommerse/order/page/table/columns'
import OrderForm from '../../../../ecommerse/order/page/table/form-items'
import Order from '../../../../../models/ecommerse/order'

import Session from '../../../../../models/im/session'
import SessionColumns from '../sessionTable/columns'
import SessionForm from '../sessionTable/form-items'

export default {
	components: {
		PageHeader,
		DomainPage,
		ModalUim
	},

	props: {
		relation: {
			type: Object,
			required: false
		}
	},

	data() {
		const headerProps = this.relation ? header(this.relation) : {}
		const authorizedTabs = headerProps.tabs.map(it => Object.values(it)[0])

		return {
			authorizedTabs,
			tab: '',
			headerProps,
			fundProps: {
				domain: Fund,
				columns: FundColumns,
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'contact.id',
						value: this.relation ? this.relation.contact.id : ''
					}
				],
				defaultSort: [
					{
						ignoreCase: false,
						property: 'sendTime',
						type: 'DSC'
					}
				]
			},
			orderProps: {
				domain: Order,
				columns: OrderColumns,
				//formItems:OrderForm,
				loadPage: async(pageNo,pageSize,filter,sort) => {
					return await Order.pageNoAuth(pageNo,pageSize,filter,sort)
				},
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'orderExtStr2',
						value: this.relation ? this.relation.contact.id : ''
					}
				],
				defaultSort: [
					{
						ignoreCase: false,
						property: 'ctime',
						type: 'DSC'
					}
				]
			},
			sessionProps: {
				domain: Session,
				formItems: SessionForm,
				columns: SessionColumns,
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'toContact.id',
						value: this.relation ? this.relation.contact.id : null
					}
				]
			},
			timelineProps: {
				domain: Timeline,
				columns: TimelineColumns,
				defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'publisher.id',
						value: this.relation ? this.relation.contact.id : ''
					}
				],
				defaultSort: [
					{
						ignoreCase: false,
						property: 'publishTime',
						type: 'DSC'
					}
				]
			}
		}
	},

	computed: {

		fundFormProps() {
			return {
				visible: this.tab === 'fund'
			}
		},

		fundTableProps() {
			return {
				visible: this.tab === 'fund'
			}
		},

		sessionFormProps() {
			return {
				visible: this.tab === 'session',
				labelWidth: 120
			}
		},

		sessionTableProps() {
			return {
				visible: this.tab === 'session'
			}
		},

		timelineFormProps() {
			return {
				visible: this.tab === 'timeline'
			}
		},

		timelineTableProps() {
			return {
				visible: this.tab === 'timeline'
			}
		},
		orderFormProps() {
			return {
				visible: this.tab === 'order'
			}
		},

		orderTableProps() {
			return {
				visible: this.tab === 'order'
			}
		}
	},

	methods: {
		onTab(name) {
			this.tab = name
		}
	}
}
</script>
