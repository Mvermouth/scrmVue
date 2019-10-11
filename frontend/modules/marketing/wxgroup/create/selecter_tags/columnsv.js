import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'

const width = App.options.styles.table.width

const options = {
	avatar: false,
	customID: false,
	employee: false,
	device: false,
	nickname: false,
	contactCount: false,
	online:false,
	heartbeatTime: false,
	dupCount: false,
	gender: false,
	country: false,
	state: false,
	city: false,
	mobilephone: false,
	signature: false,
	deviceID: false,
	'tags': {
		title: '标签信息',
		width: width.w_32,
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <span>{context.row.tags}</span>
		}
	},
	appVersion: false,
	qrcode: false,
	ctime: false,
	persistRoomMsg: false
}

export default tableColumnsByDomain(Profile, options)
