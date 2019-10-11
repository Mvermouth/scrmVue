import AppRoutes from '../../../../../configs/AppRoutes'
import Test from '../../../../../models/rootmenu/test'
import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain, filterTableRowActions } from '../../../../../scripts/utils/table-utils'
import { labelActions} from '../../../../../scripts/utils/table-renders'
const width = App.options.styles.table.width


const options = {
	avatar: {
		width: width.w_5,
		title: '头像',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			console.log(context)
			return <div>1</div>
		}
	}
	,_actions: {
        title: '操作',
        width: width.w_8,
        render(h, context) {
            return labelActions.call(this, h, context, Test, ['update', 'delete'])
        }
    }
}

export default tableColumnsByDomain(Test, options)
