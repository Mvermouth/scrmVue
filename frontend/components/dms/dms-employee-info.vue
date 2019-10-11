<template>
    <div class='padding10-0 tl'>
		<span>
			<div>
				<span class='info-name'>绑定员工：</span>
				<span class='ellipsis info-value mw128 data-value pointer'>{{cEmployeeName}}</span>
			</div>
			<div>
				<span class='info-name'>归属员工：</span>
				<span class='ellipsis info-value mw128 data-value'>{{employeeName}}</span>
			</div>
		</span>
	</div>
</template>
<script>
export default {
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
		}
	},
	computed: {
		employeeName() {
			if (_.isEmpty(this.data.employee)) {
				return ''
			} else {
				return `${this.data.employee.name}(${this.data.employee.sn})`
			}
		},
		cEmployeeName() {
			if (_.isEmpty(this.data.cEmployee)) {
				return ''
			} else {
				return `${this.data.cEmployee.name}(${this.data.cEmployee.sn})`
			}
		}
	}
}
</script>

