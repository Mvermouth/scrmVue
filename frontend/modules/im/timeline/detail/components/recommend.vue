<style lang="less" scoped>
	.recommend-table-container {
		max-height: 600px;
		overflow: scroll
	}
</style>
<template>
	<i-form :label-width="80">
		<form-item label="描述说明" >
			<i-input v-model="model" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入推荐理由"></i-input>
		</form-item>
		<tabs v-model="receiverType">
			<tab-pane label="员工" name="employee">
				<domain-page v-bind="pageProps" :table-props="tableProps" @on-selected-rows="getSelectedRows"></domain-page>
			</tab-pane>
			<tab-pane label="部门" name="department">
				<div class="recommend-table-container">
					<department-tree v-model="departments"  multiple show-checkbox></department-tree>
				</div>
			</tab-pane>
		</tabs>		
	</i-form>
</template>

<script>
import DepartmentTree from '../../../../erp/department/page/components/department-tree.vue'
import DomainPage from '../../../../../views/domain/page.vue'
import Employee from '../../../../../models/im/employee'
import columns from '../page/columns'
import Constant from '../../../../../configs/constant'
import Mailbox from '../../../../../models/im/mailbox'

export default {
	components: {
		DepartmentTree,
		DomainPage
	},
	props: {
		id: {
			type: [String, Number],
			required: true
		},
		type: {
			type: String,
			required: true
		},

		content: {
			type: String,
			required: false,
			default: '可借鉴内容'
		},
		time: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			model: this.content,
			receiverType: 'employee',
			departments: [],
			pageProps: {
				domain: Employee,
				columns: columns,
				selection: true
			},
			employees: []
		}
	},

	computed: {
		tableProps() {
			return {
				visible: this.receiverType === 'employee',
				height: 500
			}
		}
	},

	methods: {
		getSelectedRows(rows) {
			this.employees = rows
		},

		async recommendEmployee() {
			const params = {}
			if (this.model === '') {
				this.$Notice.error({
					title: '描述说明不能为空'
				})
				return false
			}
			if (this.employees.length === 0) {
				this.$Notice.error({
					title: '请选择推荐员工'
				})
				return false
			}
			params.title = this.model
			params.receiverIds = this.employees.map(it => { return it.id })
			params.receiverType = Constant.MailboxSenderType.Employee.value
			params.resourceType = this.type === 'message' ? Constant.MailboxResourceType.Message.value : Constant.MailboxResourceType.Timeline.value
			params.metadata = { cursor: new Date(this.time).getTime() }
			params.resourceId = this.id
			await Mailbox.batchCreate(params)
			return true
		},

		async recommendDepartment() {
			const params = {}
			if (this.model === '') {
				this.$Notice.error({
					title: '描述说明不能为空'
				})
				return false
			}
			if (this.departments.length === 0) {
				this.$Notice.error({
					title: '请选择推荐部门'
				})
				return false
			}
			params.title = this.model
			params.receiverIds = this.departments.map(it => { return it.id })
			params.receiverType = Constant.MailboxSenderType.Department.value
			params.resourceType = this.type === 'message' ? Constant.MailboxResourceType.Message.value : Constant.MailboxResourceType.Timeline.value
			params.resourceId = this.id
			params.metadata = { cursor: new Date(this.time).getTime() }
			await Mailbox.batchCreate(params)
			return true
		},
		async submit() {
			let result
			if (this.receiverType === 'employee') {
				result = await this.recommendEmployee()
			}
			if (this.receiverType === 'department') {
				result = await this.recommendDepartment()
			}
			return result
		}
	}

}
</script>
