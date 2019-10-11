import '../../../../scripts/common/app'
import View from '../../../../components/testxct/test.vue'
console.log(window.AppData);
(async() => {
	new Vue({
		el: '#app',
		render: h => {
			const v = h(View, { props: {
				bbb:{
					hh:"123"
				}
			}})
			return <card>{v}</card>
		}
	})
})()

