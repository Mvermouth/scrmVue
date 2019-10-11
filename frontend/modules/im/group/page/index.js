import '../../../../scripts/common/app'
import Group from '../../../../models/im/group'

import formItems from './table/form-items'
import columns from './table/columns'
import View from '../../../../views/domain/page.vue'
const defaultSort = [
    {
        "ignoreCase": false,
        "property": "ctime",
        "type": "DSC"
    }
]
new Vue({
    el: '#app',
    render: h => {
        const v = h(View, {props: {
            formItems,
            formProps: {
                labelWidth: 100
            },
            columns,
            domain: Group,
            defaultSort,
            actions: ['view']
        }})
        return <card>{v}</card>
    }
})