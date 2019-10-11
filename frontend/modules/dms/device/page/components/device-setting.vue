<template>
	<i-form :label-width="120">
        <row :gutter="8">
            <i-col v-for="setting in settings" :key="setting" :xs="12" :sm="8" :md="8" :lg="8">
                <form-item :label="settingLabels[setting]">
                    <i-switch v-model="form[setting]"></i-switch>
                </form-item>
            </i-col>
        </row>
        <spin v-if="loading" size="large" fix ></spin>
    </i-form>
</template>
<script>
import Constants from '../../../../../configs/constant'
import Device from '../../../../../models/dms/device';
export default {
	props:{
		id: {
			type: [Array, String],
			required: false
		}
	},
	data() {
		const settings = Constants.DeviceSetting
		// 所有配置项目的label
		const settingLabels = Object.keys(settings).reduce((map, it) => {
			map[settings[it].value] = settings[it].text
			return map
		}, {})

		// 配置项的默认值
		const form = Object.keys(settings).reduce((map, it) => {
			map[settings[it].value] = false
			return map
		}, {})
		return {
			settingLabels,
			form,
			loading: false
		}
	},
	computed: {
		settings() {
			return Object.keys(this.form).sort()
		}
	},
	mounted() {
		this.setCurrentSettings()
	},
	methods: {
		async submit() {
			try {
				const params = {}
				params.deviceIds = Array.isArray(this.id) ? this.id : [this.id]
				params.pref = this.form
				await Device.updateDevicePreference(params)
				this.$Notice.success({
					title: '手机设置成功'
				})
			} catch (e) {
				console.error(e)
			}
		},

		async setCurrentSettings() {
			// if (Array.isArray(this.id)) {
			// 	// 批量设置时，不需要设置当前选项值
			// 	return
			// }
			this.loading = true
			const device = await Device.retrieve(this.id[0])
			const deviceSettings = device.pref
			Object.keys(deviceSettings).forEach(it => {
				this.form[it] = !!deviceSettings[it]
			})
			this.loading = false
		}
	}
}
</script>

