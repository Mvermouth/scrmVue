
<template>
    <i-form :label-width="labelWidth">
        <row :gutter="gutter">
            <i-col v-for="setting in settings" :key="setting.value" :xs="12">
                <form-item :label="setting.text">
					 <RadioGroup v-model="setting.mode">
						<Radio label="IGNORE"><span>允许</span></Radio>
						<Radio label="MARK"><span>标记</span></Radio>
						<!-- <Radio label="FORBIT_NOT_MARK"><span>阻止</span></Radio> -->
    				</RadioGroup>
                </form-item>
            </i-col>
        </row>
        <spin v-if="loading" size="large" fix ></spin>
    </i-form>
</template>
<script>
import Settings from '../../../../../models/system/setting'
import RiskConfig from '../../../../../models/risk/riskConfig'
import Profile from '../../../../../models/im/profile'
import Constants from '../../../../../configs/constant'

export default {

	props: {

		id: {
			type: [Array, String],
			required: false
		},

		gutter: {
			type: Number,
			required: false,
			default: 8
		},

		labelWidth: {
			type: Number,
			required: false,
			default: 180
		}
	},

	data() {
		const settings = Constants.WxActionSetting
		return {
			form: Object.keys(settings).map(key => {
					const it = settings[key]
					it.mode ='IGNORE'
					return it
			}),
			loading: false
		}
	},

	computed: {

		settings() {
			return Object.assign(this.form)
		}

	},

	mounted() {
		this.setCurrentSettings()
	},

	methods: {

		async setCurrentSettings() {
			let id 
			if (Array.isArray(this.id)) {
				// 批量设置时，不需要设置当前选项值
				id = this.id[0]
			}else {
				id = this.id
			}
			this.loading = true
			const profile = await Profile.retrieveByContactID(id)
			let result
			if(profile && profile.extra && profile.extra.risk_config_id){
				result = await RiskConfig.retrieve(profile.extra.risk_config_id)
			}
			if (!result) {
				this.loading = false
				return
			}
			const ruleMap =_.keyBy(result.actionConfigs,'key')
			this.form.forEach(it => {
				if(ruleMap[it.value]){
					it.mode = ruleMap[it.value].mode
				}
			})

			this.loading = false
		},

		async submit() {
			const params = {}
			params.ids = Array.isArray(this.id) ? this.id : [this.id]
			params.actionConfigs = this.form.map(it => {
				return {
					key:it.value,
					mode:it.mode||'IGNORE'
				}
			})
			await Settings.updateAction(params)
			this.$Notice.success({
				title: '风控操作设置成功'
			})
		}

	}

}
</script>
