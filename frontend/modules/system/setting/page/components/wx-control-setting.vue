
<template>
    <i-form :label-width="labelWidth">
        <row :gutter="gutter">
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
import _ from 'lodash'
import Profile from '../../../../../models/im/profile'
import Settings from '../../../../../models/system/setting'
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
		const settings = Constants.WxControlSetting

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

		async setCurrentSettings() {
			let id 
			if (Array.isArray(this.id)) {
				// 批量设置时，不需要设置当前选项值
				id = this.id[0]
			} else {
				id = this.id
			}
			this.loading = true

			const profile = await Profile.retrieveByContactID(id)
			// 读取运营号设置的权限
			let profileSettings = profile.extra ? profile.extra.FrontendControl:{}
			if (_.isEmpty(profileSettings)) {
				const defaultControl = await Profile.retrieveControl({ serviceID: profile.serviceID, type: 'FrontendControl' })
				if (defaultControl && defaultControl.value) {
					profileSettings = JSON.parse(defaultControl.value)
				}
			}
			Object.keys(profileSettings).forEach(it => {
				this.form[it] = !!profileSettings[it]
			}
			)
			this.loading = false
		},

		async submit() {
			try {
				const params = { }
				params.ids = Array.isArray(this.id) ? this.id : [this.id]
				params.FrontendControl = this.form
				await Settings.updateControl(params)
				this.$Notice.success({
					title: '微信权限设置成功'
				})
			} catch (e) {
				console.error(e)
			}
		}
	}

}
</script>
