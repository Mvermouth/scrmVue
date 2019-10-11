 <template>
    <div>
        <Tabs v-model="type" size="small">
            <TabPane label="微信权限" name="wxControlSetting"></TabPane>
            <TabPane label="风控策略" name="wxActionSetting"></TabPane>
        </Tabs>
        <wx-control-setting ref="setting" v-if="type==='wxControlSetting'" :id="id" ></wx-control-setting>
        <wx-action-setting  ref="setting" v-if="type==='wxActionSetting'" :id="id" ></wx-action-setting>
    </div>
</template>
<script>
import WxControlSetting from './wx-control-setting.vue'
import WxActionSetting from './wx-action-setting.vue'

export default {

	components: {
		WxControlSetting,
		WxActionSetting
	},

	props: {
		id: {
			type: [Array, String],
			required: true
		}
	},

	data() {
		return {
			type: 'wxControlSetting'
		}
	},

	methods: {

		submit() {
			this.$refs.setting.submit(...arguments)
		}
	}
}
</script>