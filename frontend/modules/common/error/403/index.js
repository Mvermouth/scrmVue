import '../../../../scripts/common/app'

import View from '../404/views/index.vue'
import image from '../../../../images/403.svg'

const error = App.data.error

if (error && error.code === -1006) {
    // 会话超时，重新登录
    App.redirect(`/auth/login?url=${encodeURIComponent(App.url)}`)

} else {

    new Vue({
        el: '#app',
        render: h => h(View, {props: {
            image,
            status: 403,
            message: '抱歉，您无权访问该页',
            error
        }})
    })

}
