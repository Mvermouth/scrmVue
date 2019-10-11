import '../../../../scripts/common/app'
import Dashboard from '../../../../views/stats/dashboard/dashboard.vue'

const dashboard = App.data.dashboard
new Vue({
	el: '#app',
	components: {
		Dashboard
	},
	render: h => {
		return <dashboard dashboard={dashboard}></dashboard>
	}
})

