<template>
	<div>
		<div>{{content}}</div>
		<i-form v-if="des" v-model="form" :label-width="80">
			<form-item label="操作描述">
				<!-- <i-input type="textarea" :autosize="{minRows: 3,maxRows: 5}" :model="form.des"></i-input> -->
				<Input v-model="form.des" type="textarea" placeholder="输入描述信息..." />
			</form-item>
			<span style="color:red;" v-if="showDesErr" >{{desErr}}</span>
		</i-form>
	</div>
</template>
<script>
import Order from '../../models/ecommerse/order'
export default {
	props: {
		order: {
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
		},
		desForce: {
			type: Boolean,
			required: false,
		},
		desErr: {
			type: String,
			required: false,
		},
	},
	data() {
		return {
			form: {
				des:''
			}
		}
	},

	computed: {
		showDesErr(){
			if(this.des && this.desForce && this.form.des.length < 2){
				return true;
			}

			return false;
		}
	},

	methods: {
		async submit() {
			if(this.des && this.desForce && this.form.des.length < 2){
				return;
			}

			const params = {
				orderId: this.order.id,
				action: this.action
			}
			if(this.des) {
				params.des = this.form.des
			}
			const data = await Order.operateOrder(params)

		}
	}
}
</script>

