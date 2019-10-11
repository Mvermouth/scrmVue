
import Post from '../../../../../models/clouddata/douyin/post'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
const width = App.options.styles.table.width

const options = {
	'video1': {
		width: width.avatar,
		title: '视频',
		render(h, context) {
			const onClick = async() => {
				const row = context.row
				const type = context.row.type
				/*
				if (type === 2) {
					App.push(AppRoutes.Group.id(row.toId, row.toContact.nickname))
				} else {
					App.push(AppRoutes.Relation._(row.fromContact.id, row.toContact.id, row.toContact.nickname))
				}
				*/
			}
			const url = '' // TODO context.row.id
			return <a onClick={onClick}><im-avatar url={url}></im-avatar></a>
		}
	}
}

export default tableColumnsByDomain(Post, options)
