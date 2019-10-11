import '../../../../scripts/common/app'
import Config from '../../../../models/system/config'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'

new Vue({
    el: '#app',
    render: h => {
        const v = h(View, { props: {
            formItems,
            columns,
            domain: Config,
            actions: ['view', 'create', 'update', 'delete']
        }})
        return <card>{v}</card>
    }
})
