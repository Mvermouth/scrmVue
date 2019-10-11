import '../../../../scripts/common/app'

import WhiteList from '../../../../models/system/whiteList'
import formItems from './form/form-items'

import View from '../../../../views/domain/create.vue'

new Vue({
    el: '#app',
    render: h => {
        const v = h(View, {props: {
            domain: WhiteList,
            formItems,
            labelWidth: 120
        }})
        return App.target === 'dialog' ? v : <card>{v}</card>
    }
})
