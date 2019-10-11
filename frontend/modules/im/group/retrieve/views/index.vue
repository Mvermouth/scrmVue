<template>
    <div>
        <page-header v-bind="headerProps" @on-tab="onTab"></page-header>
        <card v-show="tab === 'groupMember'">
          <domain-page :form-props="groupMemberFormProps" :table-props="groupMemberTableProps" v-bind="groupMemberProps"></domain-page>
        </card>
    </div>
</template>
<script>
import PageHeader from '../../../../../views/domain/retrieve/header.vue'
import DomainPage from '../../../../../views/domain/page.vue'

import header from './header'

import GroupMember from '../../../../../models/im/groupMember'
import GroupMemberColumns from '../../../groupMember/page/table/columns'

export default {
	components: {
		PageHeader,
		DomainPage
	},

	props: {
		group: {
			type: Object,
			required: true
		}
	},

	data() {
		const headerProps = header(this.group)

		return {
			tab: '',
			headerProps,
			groupMemberProps: {
				domain: GroupMember,
				columns: GroupMemberColumns,
				defaultCriterias: [
					{ property: 'gid', filterType: 'EQ', value: this.group.group.id }
				]
			}
		}
	},

	computed: {

		groupMemberFormProps() {
			return {
				visible: this.tab === 'groupMember'
			}
		},

		groupMemberTableProps() {
			return {
				visible: this.tab === 'groupMember'
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
