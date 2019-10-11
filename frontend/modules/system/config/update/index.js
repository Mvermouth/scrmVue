import '../../../../scripts/common/app'

import WhiteList from '../../../../models/system/whiteList'
import formItems from '../create/form/form-items'

import View from '../../../../views/domain/update.vue'


new Vue({
    el: '#app',
    render: h => {
        const v = h(View, {props: {
            domain: WhiteList,
            formItems
        }})
        return App.target === 'dialog' ? v : <card>{v}</card>
    }
})
