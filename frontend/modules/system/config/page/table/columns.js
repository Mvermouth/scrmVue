import Config from '../../../../../models/system/config'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import { labelActions} from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width

const options = {
    
    _actions: {
        title: '操作',
        width: width.w_8,
        render(h, context) {
            return labelActions.call(this, h, context, Config, ['update', 'delete'])
        }
    }
    
}

export default tableColumnsByDomain(Config, options)