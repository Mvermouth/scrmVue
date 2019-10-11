 <template>
    <div>
		<Alert type="info" class="alert-font" show-icon>仅当运营号没有设置过微信权限时，如下默认配置才生效。</Alert>
        <Tabs v-model="type" size="small">
            <TabPane label="微信权限" name="wxControlSetting"></TabPane>
        </Tabs>
        <default-control-setting ref="setting" v-if="type==='wxControlSetting'" ></default-control-setting>    </div>
</template>
<script>
import DefaultControlSetting from './default-control-setting.vue'
export default {

	components: {
		DefaultControlSetting,
	},

	props: {
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