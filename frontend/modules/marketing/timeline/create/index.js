import '../../../../scripts/common/app'
import View from './index.vue'
import ShareContent from './components/share-content.vue'
import DomainPage from '../../../../views/domain/page.vue'
import choose from './components/choose-people.vue'


new Vue({
    el: '#app',
    components: {
        ShareContent,
        DomainPage,
        choose
    },
    render:function(h){
        const v = h(View,{props:{
            resetwidgetarray:this.resetwidgetarray
        }})
        return <card>{v}</card>
    },
    methods:{
        resetwidgetarray:function(){
            if(this.$refs.choosewidget)
            this.$refs.choosewidget.selections = [];
            if(this.$refs.sharecontentwidget){
                this.$refs.sharecontentwidget.images = [];
                this.$refs.sharecontentwidget.videos = [];
            }            
        }
    }
})

