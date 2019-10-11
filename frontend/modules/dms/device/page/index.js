import '../../../../scripts/common/app'
import domain from '../../../../models/dms/device'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/tabs-page.vue'
import BindDevice from './components/bind-device.vue'
import IncreaseDevice from './components/increase-device.vue'
import DeviceSetting from './components/device-setting.vue'
import DeviceItem from './components/device-item.vue'
const defaultSort = [
	{
		'ignoreCase': false,
		'property': 'ctime',
		'type': 'DSC'
	}
]
new Vue({
	el: '#app',
	components: {
		BindDevice,
		IncreaseDevice,
		DeviceItem,
		DeviceSetting
	},
	render(h) {
		const actions = [
			'view',
			// 绑定设备
			{
				bind: {
					title: '绑定',
					type: 'primary',
					onAction: ($list, rows) => {
						App.modal({
							title: '绑定设备',
							width: 'large',
							render: (h) => {
								h = this.$createElement
								return <bind-device></bind-device>
							},
							onOk: bindDevice => {
								bindDevice.submit()
							}
						})
					}
				}
			},
			// {
			// 	increaseDevice: {
			// 		title: '提升设备数量',
			// 		type: 'primary',
			// 		unauthorize: true,
			// 		onAction: ($list, rows) => {
			// 			App.modal({
			// 				title: '提升设备数量',
			// 				okText: '确认支付',
			// 				render: (h) => {
			// 					h = this.$root.$createElement
			// 					return <increase-device></increase-device>
			// 				},
			// 				onOk: increaseDevice => {
			// 					increaseDevice.submit()
			// 				}
			// 			})
			// 		}
			// 	}
			// },
			{
				setting: {
					title: '手机设置',
					type: 'primary',
					selection: true,
					unauthorize: true,
					onAction: ($list, rows) => {
						App.modal({
							title: '手机设置',
							okText: '确定',
							render: (h) => {
								h = this.$createElement
								console.log(rows)
								const ids = rows.map(it => it.device.UDID)
								return <device-setting id ={ids}></device-setting>
							},
							onOk: deviceSetting => {
								deviceSetting.submit()
							}
						})
					}
				}
			}
		]
		const v = h(View, {
			props: {
				domain,
				formItems,
				formProps: {
					labelWidth: 80
				},
				tabs: [
					{
						name: 'table',
						label: '列表',
						columns,
						actions,
						defaultSort
					},
					{
						name: 'grid',
						label: '格子',
						actions,
						display: 'grid',
						defaultSort,
						renderGrid(h, ctx) {
							h = this.$root.$createElement
							return <device-item device={ctx.row}></device-item>
						}
					}
				]
			}
		})
		return <card>{v}</card>
	}

})
