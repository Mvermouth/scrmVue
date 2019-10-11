import '../../../../scripts/common/app'

import View from '../404/views/index.vue'
import image from '../../../../images/500.svg'

new Vue({
    el: '#app',
    render: h => h(View, {props: {
        image,
        status: 500,
        message: '抱歉，服务器出错了',
        error: App.data.error
    }})
})