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
				<department-tree v-model="departments"  multiple show-checkbox></department-tree>
			</tab-pane>
		</tabs>		
	</i-form>
</template>

<script>
import DepartmentTree from '../../../modules/erp/department/page/components/department-tree.vue'
import DomainPage from '../../../views/domain/page.vue'
import Employee from '../../../models/im/employee'
import columns from '../../../modules/im/timeline/detail/page/columns'	// 这里要移走
import Constant from '../../../configs/constant'
import Mailbox from '../../../models/im/mailbox'

export default {
	name: 'recommend-form',
	components: {
		DepartmentTree,
		DomainPage
	},
	props: {
		info: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			model: this.info.content,
			receiverType: 'employee',
			departments: [],
			pageProps: {
				selection: true,
				domain: Employee,
				columns: columns
			},
			employees: []
		}
	},

	computed: {
		tableProps() {
			return {
				visible: this.receiverType === 'employee',
			}
		}
	},

	methods: {
		getSelectedRows(rows) {
			this.employees = rows
		},
		async recommendEmployee() {
			const params = {}
			console.log("this.model:",this.model)
			console.log("this.employees:",this.employees)
			if (!this.model) {
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
			params.resourceType = this.info.type === 'message' ? Constant.MailboxResourceType.Message.value : Constant.MailboxResourceType.Timeline.value
			params.metadata = { cursor: new Date(this.info.time).getTime() }
			params.resourceId = this.info.id
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
			params.resourceType = this.info.type === 'message' ? Constant.MailboxResourceType.Message.value : Constant.MailboxResourceType.Timeline.value
			params.resourceId = this.info.id
			params.metadata = { cursor: new Date(this.info.time).getTime() }
			await Mailbox.batchCreate(params)
			return true
		},
		async submit() {
			if (this.receiverType === 'employee') {
				await this.recommendEmployee()
			}
			if (this.receiverType === 'department') {
				await this.recommendDepartment()
			}
		}
	}

}
</script>
