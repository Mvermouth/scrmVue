<template>
	<div>
		<div>{{content}}</div>
		<i-form v-if="des" v-model="form" :label-width="120">
			<form-item label="操作描述">
				<i-input type="textarea" :autosize="{minRows: 3,maxRows: 5}" :model="form.des"></i-input>
			</form-item>
		</i-form>
	</div>
</template>
<script>
import RefundOrder from '../../models/ecommerse/refundOrder'
export default {
	props: {
		refundOrder: {
			type: Object,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		//是否添加描述信息
		des: {
			type: Boolean,
			required: false
		}
	},
	data() {
		return {
			form: {
				des:''
			}
		}
	},
	methods: {
		async submit() {
			const params = {
				orderId: this.refundOrder.id,
				action: this.action
			}
			if(this.des) {
				params.des = this.form.des
			}
			const data = await RefundOrder.operateOrder(params)

		}
	}
}
</script>

