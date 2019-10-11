<template>
    <div class='padding10-0 tl'>
		<span>
			<div>
				<span class='info-name'>归属员工：</span>
				<span class='ellipsis info-value mw128 data-value pointer' @click="()=> {AppProxy.do_push(AppRouter.Profile.updateEmplyee(data.accountId, data.accountName))}">{{employeeName}}</span>
			</div>
			<div>
				<span class='info-name'>归属部门：</span>
				<span class='ellipsis info-value mw128 data-value'>
                    <tooltip transfer :content="departments">{{departments}}</tooltip>
                </span>
			</div>
		</span>
	</div>
</template>
<script>
import AppProxy from '../../scripts/common/appProxy'
import AppRouter from '../../configs/AppRoutes'
export default {
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			AppProxy: AppProxy,
			AppRouter: AppRouter
		}
	},
	computed: {
		departments() {
			if (this.data.departments && this.data.departments.length > 0) {
				const department = this.data.departments.map(it => {
					return it.name
				})
				return department.join('、')
			}
			return ''
		},
		employeeName() {
			if (_.isEmpty(this.data)) {
				return ''
			} else {
				return `${this.data.name}(${this.data.sn})`
			}
		}
	}
}
</script>

