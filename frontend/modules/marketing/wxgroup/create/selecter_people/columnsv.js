import Profile from '../../../../../models/im/profile'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'

const width = App.options.styles.table.width

const options = {
	avatar: false,
	customID: {
		width: width.w_32,
		title: '微信信息',
		fixed: 'left',
		align: 'center',
		render(h, context) {
			return <div class='tl'>
				<div class='avatar-img padding10-0'>
					<im-avatar url={context.row.avatar}></im-avatar>
				</div>
				<im-account-info-widget profile={context.row}></im-account-info-widget>

			</div>
		}
	},
	employee: false,
	device: false,
	nickname: false,
	contactCount: {
		title: '好友总数',
		width: width.w_7,
		sortable: true
	},
	heartbeatTime: {
		title: '最后心跳时间',
		width: width.w_12,
		after: 'contactCount',
		render(h, context) {
			console.log(context);
			return <span>{dateformat(context.row.heartbeatTime, 'yyyy-mm-dd HH:MM:ss')}</span>
		}
	},
	dupCount: false,
	gender: false,
	country: false,
	state: false,
	city: false,
	mobilephone: false,
	signature: false,
	deviceID: false,
	'tags': false,
	appVersion: false,
	qrcode: false,
	ctime: false,
	persistRoomMsg: false
}

export default tableColumnsByDomain(Profile, options)
