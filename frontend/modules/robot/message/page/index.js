import '../../../../scripts/common/app'
import resetMessData from "./components/resetMessData.vue"
import View from './index.vue'

new Vue({
	el: '#app',
	components: {
		resetMessData
	},
	render:function(h){
        const v = h(View)
        return <card>{v}</card>
    },
	methods:{

    }
})

