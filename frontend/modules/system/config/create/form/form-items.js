
import { constant2Array } from '../../../../../scripts/utils/misc'
import constant from '../../../../../configs/constant'

export default [
    {
        prop: 'content',
        label: '内容',
        rule: { required: true, message: '白名单内容为空', trigger: 'blur'},
        render(h) {
            return <i-input v-model={this.model} placeholder="请输入白名单"></i-input>
        }
    },

    {
        prop: 'whiteListType',
        label: '类型',
        rule: { required: true, message: '白名单类型不能为空', trigger: 'change', type: 'integer' },
        render (h){
            const options = constant2Array(constant.whiteListType).map(it=>{return <i-option value={it.value}>{it.text}</i-option>})
            return <i-select v-model={this.model}>{options}</i-select>
         }
    }
]