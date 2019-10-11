<template>
	<div :class="[`${clsPrefix}center`, `${clsPrefix}increase-device`]">
		增加<InputNumber v-model="num" :max="100" :min="1" :step="10" ></InputNumber>台设备,需要支付<span :class="`${clsPrefix}amount`">{{amount}}</span>元    
	</div>
</template>
<script>
export default {
	data() {
		return {
			clsPrefix: App.options.styles.prefix,
			num: 0
		}
	},
	computed: {
		amount() {
			return this.num * 388
		}
	},
	methods: {
		submit() {

		}
	}
}
</script>

