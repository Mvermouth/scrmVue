<template>
    <row :gutter="8">
        <i-col :xs="10" :sm="10" :md="8" :lg="7">
			<card>
            	<department-tree v-model="value" multiple show-checkbox></department-tree>
			</card>
        </i-col>
        <i-col :xs="14" :sm="14" :md="16" :lg="17">
			<card>
            	<domain-page :formItems="formItems" :columns="columns" :domain="domain" :actions="actions" :defaultCriterias="defaultCriterias" :defaultSort="defaultSort"></domain-page>
			</card>
        </i-col>
    </row>
</template>
<script>
import Profile from '../../../../models/im/profile'

import formItems from './table/form-items'
import columns from './table/columns'

import DepartmentTree from '../../../erp/department/page/components/department-tree.vue'
import DomainPage from '../../../../views/domain/page.vue'
import WxSettings from './components/wx-settings.vue'
import WxDefaultSetting from './components/wx-default-setting.vue'

export default {

	components: {
		DomainPage,
		DepartmentTree,
		WxSettings,
		WxDefaultSetting
	},

	data() {
		return {
			value: [],
			formItems: formItems,
			columns: columns,
			domain: Profile,
			defaultCriterias: [],
			defaultSort: [
				{
					'ignoreCase': false,
					'property': 'ctime',
					'type': 'DSC'
				}
			],
			actions: [
				'view',

				// 微信权限设置
				{
					'updateProfile': {
						title: '批量设置运营号',
						type: 'primary',
						selection: true,
						onAction: ($list, rows) => {
							const ids = rows.map(it => it.contactID)
							this.updateSettings(ids)
						}
					}
				},
				// {
				// 	'updateDefaultControl': {
				// 		title: '默认微信权限',
				// 		color: '#2d8cf0',
				// 		unauthorize: true,
				// 		onAction: ($list, rows) => {
				// 			this.updateDefaultSetting()
				// 		}
				// 	}
				// }
			]
		}
	},
	watch: {
		value() {
			const departmentIds = _.map(this.value, it => { return it.id })
			if (departmentIds && departmentIds.length > 0) {
				this.defaultCriterias = [{ property: 'employee.departmentIds', filterType: 'IN', value: departmentIds }]
			} else {
				this.defaultCriterias = []
			}
		}
	},

	methods: {

		updateSettings(ids) {
			App.modal({
				title: '运营号设置',
				width: 'large',
				render: h => {
					h = this.$createElement
					return <wx-settings id={ids}></wx-settings>
				},
				onOk: wxSettings => {
					wxSettings.submit(ids)
				}
			})
		},
		updateDefaultSetting() {
			App.modal({
				title: '微信号默认设置',
				width: 'large',
				render: h => {
					h = this.$createElement
					return <wx-default-setting></wx-default-setting>
				},
				onOk: wxSettings => {
					wxSettings.submit()
				}
			})
		}

	}

}
</script>

