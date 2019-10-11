import '../../../../scripts/common/app'

import View from './views/index.vue'
import image from '../../../../images/404.svg'

new Vue({
    el: '#app',
    render: h => h(View, {props: {
        image,
        status: 404,
        message: '抱歉，您访问的页面不存在'
    }})
})