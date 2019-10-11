

<template>
	<div class="logistics-layout">
		<i-form :model="logisticsForms" :rules="ruleValidate" :label-width="120">
			<form-item label="订单编号：">
				<div class="logistics-text">{{order.sn}}</div>
			</form-item>
			<form-item label="收货人：">
				<div class="logistics-text">{{order.address.consignee}}</div>
			</form-item>
			<form-item label="地址：">
				<div class="logistics-text">{{address}}</div>
			</form-item>
			<form-item label="物流公司：" prop="logisticsCompany">
				<i-select v-model="logisticsForms.logisticsCompany" class="w150">
					<i-option v-for="(logisticsCompany, index) in logisticsCompanys" :value="logisticsCompany.id" :key="`logisticsCompany_${index}`">{{logisticsCompany.name}}</i-option>
				</i-select>
			</form-item>
			<form-item label="物流单号：" prop="logisticsNum">
				<i-input v-model="logisticsForms.logisticsNum"></i-input>
			</form-item>
		</i-form>
	</div>
</template>
<script>
import ShipInfo from '../../models/ecommerse/shipInfo'
import Order from '../../models/ecommerse/order'
export default {
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	mounted() {
		this.init()
	},
	computed: {
		address() {
			const state = _.result(this.order.address, 'state')
			const city = _.result(this.order.address, 'city')
			const district = _.result(this.order.address, 'district')
			const address = _.result(this.order.address, 'address')
			return `${state}${city}${district}${address}`
		}
	},
	data() {
		return {
			logisticsForms: {
				logisticsCompany: '',
				logisticsNum: ''
			},
			ruleValidate: {
				logisticsCompany: [
					{ required: true, message: '物流公司不能为空', trigger: 'blur' },
				],
				logisticsNum: [
					{ required: true, message: '物流单号不能为空', trigger: 'blur' }
				]
			},
			logisticsCompanys: []
		}
	},
	methods: {
		async init() {
			this.logisticsCompanys = await ShipInfo.expressList()
			this.logisticsForms.logisticsCompany = this.logisticsCompanys[0].id
		},
		async submit(action) {
			if(this.logisticsForms.logisticsNum === '') {
				this.$Notice.error({title: '请填写物流单号'})
			}
			const params = {
				orderId: this.order.id,
				expressId: this.logisticsForms.logisticsCompany,
				expressNo: this.logisticsForms.logisticsNum
			}
			try {
				await ShipInfo.create(params)
				await Order.operateOrder({orderId: this.order.id, action: action})
				this.$Notice.success({title: '发货成功'})
			} catch (error) {
				this.$Notice.error({title: '发货失败，请重新发货'})
			}
			
		}
	}
}
</script>

