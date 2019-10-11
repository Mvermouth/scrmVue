import '../../../../scripts/common/app'
import View from './index.vue'
new Vue({
	el: '#app',
	components: {

	},
	render:function(h){
        const v = h(View);
        return v
    }
})

