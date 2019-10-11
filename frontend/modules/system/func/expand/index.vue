<template>
    <row :gutter="16">
        <i-col :xs="10" :sm="8" :md="7" :lg="5">
            <func-tree :value="value" v-model="value"></func-tree>
        </i-col>
        <i-col :xs="14" :sm="16" :md="17" :lg="19">
            <func-setting :value="value" @on-change-value="changeValue"></func-setting>
        </i-col>
    </row>    
</template>
<script>
import FuncTree from './components/func-tree.vue'
import FuncSetting from './components/func-setting.vue'
export default {
	components: {
		'func-tree': FuncTree,
		'func-setting': FuncSetting
	},
	data() {
		return {
			value: {}
		}
	},
	methods: {
		changeValue() {
			this.value = {}
		}
	}
}
</script>

