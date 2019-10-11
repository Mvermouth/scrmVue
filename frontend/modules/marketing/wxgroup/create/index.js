import '../../../../scripts/common/app'
import * as vux from '../../../../scripts/common/store'
import View from './index.vue'
import choosepeople from './components/choose-people.vue'
import choosetags from './components/choose-tags.vue'
import wxmessage from './components/wx-message.vue'
import resend from './components/resend.vue'

var state = {
	idArgs:[]
}

var store = vux.createStore({state});

new Vue({
	el: '#app',
	store,
	components: {
		choosepeople
		,choosetags
		,wxmessage
		,resend
	},
	render:function(h){
        const v = h(View,{props:{
            resetwidgetarray:this.resetwidgetarray
        }})
        return v
    },
	methods:{
        resetwidgetarray:function(){
            if(this.$refs.choosewidget)
            this.$refs.choosewidget.selections = [];
			if(this.$refs.choosetagswidget)
			this.$refs.choosetagswidget.selections = [];
			if(this.$refs.vxmessagewidget)
			this.$refs.vxmessagewidget.messages = [];
        }
    }
})

