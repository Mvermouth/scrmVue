import '../../../../scripts/common/app'

import Layout from './views/layout.vue'
import routes from '../../../../configs/routes'

(async () => { 
    // 按需加载依赖组件
    const { createRouter } = await import(/* webpackChunkName : "router" */'../../../../scripts/common/router')

    // 创建路由
    const mode = 'history' // 基于iframe必须使用history
    const router = createRouter({ mode, routes })

    // 关联实例
    App.vm = new Vue({
        el: '#app',
        router: router,
        render: h => h(Layout)
    })

})()