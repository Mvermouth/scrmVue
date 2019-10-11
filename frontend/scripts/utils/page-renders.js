import constant from '../../configs/constant'
import defaultAvatar from '../../images/default-avatar.png'
import { value2Text } from './misc'

/**
 * 行文本-状态
 *
 * @param {*} h
 * @param {*} value
 * @param {*} constant
 * @param {*} highlights
 */
export function constantText(h, value, constant, highlights) {
	const text = value2Text(constant, value)
	if (highlights) {
		return	<span class={{ ['c-' + highlights[value]]: true, 'text': true }}>
					<icon type='record'></icon>
					<span>{text}</span>
				</span>
	} else {
		return <span>{text}</span>
	}
}

/**
 * 标签列表
 *
 * @param {*} h
 * @param {*} tags
 * @param {*} color
 */
export function tags(h, tags, color) {
	const t = (tags || []).map(it => <tag class={`${App.options.styles.prefix}tag`} color={color || ''}>{it}</tag>)
	return <span>{t}</span>
}

/**
 * boolean值
 *
 * @param {*} h
 * @param {*} val
 * @param {*} size
 */
export function yesNo(h, val, size) {
	if (val === undefined || val === null || val === constant.YesNo.Unknown.value) return ''
	return <icon type={ val === constant.YesNo.Yes.value ? 'checkmark-round' : 'close-round' } size={ size || 14 } color={ val === constant.YesNo.Yes.value ? '#19be6b' : '#ed3f14' }></icon>
}

/**
 *
 * @param {*} h
 * @param {*} url
 * @param {*} zoom
 * @param {*} style
 */
export function img(h, url, zoom, style) {
	url = url || defaultAvatar
	style = style || { height: '44px', width: '44px' }
	if (zoom) {
		const zoomStyle = { height: '120px', width: '120px' }
		return <tooltip placement='top'>
			<img src={url} style={style}/>
			<div slot='content'>
				<img src={url} style={zoomStyle}/>
			</div>
		</tooltip>
	}
	return <img src={url} style={style}/>
}
