import { constant2Array, datePickerShortcuts } from '../../../../../scripts/utils/misc'
import Constant from '../../../../../configs/constant'
import Employee from '../../../../../models/erp/employee'
import Department from '../../../../../models/erp/department'
const user = App.data.user
const permissions = App.data.permissions
console.log('user:', user)
const filteredActions = permissions.filter(it => { return it.resourceUri === 'ecommerse.order' }).map(it => it.action)
console.log('filteredActions:', filteredActions)
let dataViewPermission = 'view_all'
if (user.supper) {
	dataViewPermission = 'view_all'
} else {
	if (filteredActions.includes('view_all') || filteredActions.includes('view')) {
		dataViewPermission = 'view_all'
	} else if (filteredActions.includes('view_departments')) {
		dataViewPermission = 'view_departments'
	} else {
		dataViewPermission = 'view_mine'
	}
}
console.log('dataViewPermission:', dataViewPermission)

const forms = [
	{
		property: 'sn',
		filter: 'EQ',
		label: '订单编号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'orderExtStr3',
		filter: 'EQ',
		label: '归属平台账号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	// {
	// 	property: 'shipStatus',
	// 	filter: 'EQ',
	// 	label: '物流状态',
	// 	render(h) { 
	// 		let info = [
	// 			Constant.LibShipStatus.not_shipped,
	// 			Constant.LibShipStatus.shipping,
	// 			Constant.LibShipStatus.shipped,
	// 		];
	// 		const options = info.map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
	// 		return <i-select clearable v-model={this.model}>{options}</i-select>
	// 	 }
	// },
	{
		property: 'orderExtStr1',
		filter: 'EQ',
		label: '客户平台账号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'address.mobile',
		filter: 'EQ',
		label: '收货人手机号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'address.consignee',
		filter: 'EQ',
		label: '收货人姓名',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},

	{
		property: 'creatorUid',
		filter: 'EQ',
		label: '下单人',
		render(h) {
			const loadOptions = async value => {
				if (!value) return []
				const ps = [
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value }], [], true),
					Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value }], [], true)
				]
				const results = await Promise.all(ps)
				const content = _.unionWith(results[0].content, results[1].content, _.isEqual)
				return content.map(it => { return { value: it.id, label: `${it.sn}(${it.name})` } })
			}
			return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入'></remote-select>
		}
	},
	{
		property: 'payStatus',
		filter: 'EQ',
		label: '支付状态',
		render(h) {
			let info = [
				Constant.LibPayStatus.not_pay,
				Constant.LibPayStatus.partial_payed,
				Constant.LibPayStatus.payed,
			];
			const options = info.map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'refundStatusList',
		filter: 'IN',
		label: '退款状态',
		render(h) {
			const options = constant2Array(Constant.RefundStatus).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'shipNos',
		filter: 'IN',
		label: '物流单号',
		render(h) {
			return <i-input v-model={this.model} placeholder='请输入'></i-input>
		}
	},
	// {
	// 	property: 'payChannels',
	// 	filter: 'IN',
	// 	label: '支付方式',
	// 	render(h) {
	// 		const options = constant2Array(Constant.RefundStatus).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
	// 		return <i-select clearable v-model={this.model}>{options}</i-select>
	// 	}
	// },
	{
		property: 'orderTags',
		filter: 'IN',
		label: '订单类型',
		render(h) {
			const options = constant2Array(Constant.OrderTags).map(it => { return <i-option v-model={it.value}>{it.text}</i-option> })
			return <i-select clearable v-model={this.model}>{options}</i-select>
		}
	},
	{
		property: 'productAmount',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0] * 100,
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1] * 100,
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '商品总金额',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'totalAmount',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0] * 100,
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1] * 100,
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '订单总金额',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'shipFee',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0] * 100,
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1] * 100,
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '运费',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'discountAmount',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0] * 100,
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1] * 100,
					filterType: 'LTE'
				})
			}
			return criterias
		},
		label: '优惠金额',
		default: [0, 0],
		render(h) {
			return <input-number-range v-model={this.model}></input-number-range>
		}
	},
	{
		property: 'orderItems.productName',
		filter: 'EQ',
		label: '商品名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'ctime',
		filter: (formItem, value) => {
			const criterias = []
			if (value[0]) {
				criterias.push({
					property: formItem.property,
					value: value[0],
					filterType: 'GTE'
				})
			}
			if (value[1]) {
				criterias.push({
					property: formItem.property,
					value: value[1],
					filterType: 'LT'
				})
			}
			return criterias
		},
		default: ['', ''],
		label: '下单时间',
		render(h) {
			return <date-picker type='datetimerange' v-model={this.model} format='yyyy-MM-dd' style={{ width: '100%' }} options={{ shortcuts: datePickerShortcuts() }} placeholder='选择日期' ></date-picker>
		}
	}
]

const employeeFilter = 	{
	property: 'orderExtStr5',
	filter: 'EQ',
	label: '归属员工',
	render(h) {
		const loadOptions = async value => {
			if (!value) return []
			const ps = [
				Employee.search(1, 20, [{ filterType: 'LIKE', property: 'sn', value }], [], true),
				Employee.search(1, 20, [{ filterType: 'LIKE', property: 'name', value }], [], true)
			]
			const results = await Promise.all(ps)
			const content = _.unionWith(results[0].content, results[1].content, _.isEqual)
			return content.map(it => { return { value: it.id, label: `${it.sn}(${it.name})` } })
		}
		return <remote-select v-model={this.model} load-options={loadOptions} placeholder='请输入'></remote-select>
	}
}
const departmentFilter =	{
	property: 'orderExtStrArr1',
	filter: (formItem, value) => {
		const criterias = []
		if (value.length > 0) {
			value = _.last(value)
			criterias.push({
				property: formItem.property,
				value: value,
				filterType: 'EQ'
			})
		}
		return criterias
	},
	label: '归属部门',
	default: [],
	render(h) {
		const tranformData = (data) => {
			data.forEach(it => {
				it.value = it.id
				it.label = it.name
				if (it.children && it.children.length > 0) {
					tranformData(it.children)
				}
			})
		}
		const loadData = async() => {
			const result = await Department.expand({ dataViewPermission: dataViewPermission })
			tranformData(result)
			return result
		}
		return <remote-cascader v-model={this.model} load-data={loadData}></remote-cascader>
	}
}
if (dataViewPermission === 'view_all') {
	forms.push(employeeFilter)
	forms.push(departmentFilter)
}
if (dataViewPermission === 'view_departments') {
	forms.push(employeeFilter)
	forms.push(departmentFilter)
}
export default forms
