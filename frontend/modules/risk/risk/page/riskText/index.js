
import { hightlightSensitiveWord } from '../../../../../scripts/utils/misc'
import Constant from '../../../../../configs/constant'
import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'

/**
 *
 * @param {*} h
 * @param {*} context
 * @param {*} text
 * @param {*} sensitive
 * @param {*} type
 */
export function messageTypeText(h, context, row, sensitive, action) {
	const isSensitive = (action === Constant.WxActionSetting.SendSensitiveWord.value)
	const html = isSensitive ? hightlightSensitiveWord(row.message.textContent, sensitive, Constant.SensitiveLevel) : row.description
	const toMessage = async() => {
		let url
		if (row.message.sessionType === 2) {
			url = AppRoutes.ChatSession.groupMessage(row.profile.contactID, row.message.gid, row.message.id)
		} else {
			url = AppRoutes.ChatSession.chatMessage(row.profile.contactID, row.contact.id, row.message.id, row.contact.nickname)
		}
		AppProxy.do_push(url)
	}
	return <a onClick={toMessage}><tooltip transfer placement='top-start' style='display:inline'>
		<span domPropsInnerHTML={html}></span>

		<div slot='content' style='white-space:normal;word-break:break-word'>
			<span domPropsInnerHTML={html}></span>
		</div>
	</tooltip></a>
}

/**
 *
 * @param {*} h
 * @param {*} context
 * @param {*} text
 * @param {*} zoom
 */
export function actionTypeText(h, context, text, zoom) {
	const wxActionSetting = Constant.WxActionSetting
	console.log(text)
	_.map(wxActionSetting, it => {
		text = text.replace(it.value, it.text)
	})
	if (zoom) {
		return <tooltip transfer placement='top-start' style='display:inline'>
			<span domPropsInnerHTML={text}></span>
			<div slot='content' style='white-space:normal;word-break:break-word'>
				<span domPropsInnerHTML={text}></span>
			</div>
		</tooltip>
	} else {
		return <span>{text}</span>
	}
}
