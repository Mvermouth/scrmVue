import _ from 'lodash'
import AppRoutes from '../../configs/AppRoutes'
import { value2Text, hightlightSensitiveWord } from './misc'
import defaultAvatar from '../../images/default-avatar.png'
import Constant from '../../configs/constant'

/**
 * 默认删除行操作
 *
 * @param {*} param0
 * @param {*} domain
 */
const onDeleteRow = function ($list, { row, column, index }, domain) {
	const key = row[domain.primaryKey]
	this.$Modal.confirm({
		title: '确认删除',
		content: '是否删除该条数据？',
		loading: true,
		onOk: () => {
			domain.delete(key)
				.then(() => {
					this.$Modal.remove()
					this.deselect([key])
					this.$Notice.success({ title: '删除成功' })

					// 删除事件
					App.event.$emit(domain.events.Delete)
				})
				.catch(e => {
					console.error(e)
					this.$Modal.remove()
				})
		}
	})
}

/**
 * 默认编辑行操作
 *
 * @param {*} param0
 * @param {*} domain
 */
const onUpdateRow = function ($list, { row, column, index }, domain) {
	const id = row[domain.primaryKey]
	App.push(AppRoutes.Domain.update(id, domain))
}

/**
 * 行操作 - 文本
 *
 * @param {*} h
 * @param {*} context
 * @param {*} domain
 * @param {*} actions
 */

const DefaultLabelActions = {
	// 编辑
	'update': {
		title: '编辑',
		color: '#2d8cf0',
		onAction: onUpdateRow
	},
	// 删除
	'delete': {
		title: '删除',
		color: '#ed3f14',
		onAction: onDeleteRow
	}
}

export function labelActions(h, context, domain, actions) {
	actions = actions.map(it => {
		let config
		if (typeof it === 'string') {
			config = DefaultLabelActions[it]
		}

		if (typeof it === 'object') {
			const type = _.keys(it)[0]
			const defaultConfig = DefaultLabelActions[type]
			config = it[type]
			if (defaultConfig) {
				config = _.assign(_.cloneDeep(defaultConfig), config)
			}
		}

		if (!config) {
			return
		}

		return <span style={{ color: config.color }} class={{ 'label-action': true }}
			onClick={() => { config.onAction.call(this, this, context, domain) }}>{config.title}</span>
	}).filter(it => !!it)
	return <div>{actions}</div>
}

/**
 * 行操作 - 按钮
 *
 * @param {*} h
 * @param {*} context
 * @param {*} domain
 * @param {*} actions
 */

const DefaultButtonActions = {
	// 编辑
	'update': {
		title: '编辑',
		icon: 'ivu-icon ivu-icon-edit',
		type: 'info',
		onAction: onUpdateRow
	},
	// 删除
	'delete': {
		title: '删除',
		type: 'error',
		icon: 'ivu-icon ivu-icon-trash-b',
		onAction: onDeleteRow
	}
}

export function buttonActions(h, context, domain, actions) {
	actions = actions.map(it => {
		let config
		if (typeof it === 'string') {
			config = DefaultButtonActions[it]
		}

		if (typeof it === 'object') {
			const type = _.keys(it)[0]
			const defaultConfig = DefaultButtonActions[type]
			config = it[type]
			if (defaultConfig) {
				config = _.assign(_.cloneDeep(defaultConfig), config)
			}
		}

		if (!config) {
			return
		}

		return <i-button class={{ 'btn-action': true }} type={config.type} size='small' icon={config.icon}
			onClick={() => { config.onAction.call(this, this, context, domain) }}>{config.title}</i-button>
	}).filter(it => !!it)

	return <div class='tl'>{actions}</div>
}

/**
 * 行头像
 *
 * @param {*} h
 * @param {*} context
 * @param {*} url
 * @param {*} status
 */

export function avatar(h, context, url, status) {
	url = url || defaultAvatar
	return <div class={{ 'avatar': true }}>
		<img src={url} />
		<div class={{ 'status': status, [`status-${status}`]: status }}></div>
	</div>
}

/**
 * 行文本-状态
 *
 * @param {*} h
 * @param {*} context
 * @param {*} value
 * @param {*} constant
 * @param {*} highlights
 */

export function constantText(h, context, value, constant, highlights) {
	const text = value2Text(constant, value)
	if (highlights) {
		return <span class={{ ['c-' + highlights[value]]: true, 'text': true }}>
			<icon type='record'></icon>
			<span>{text}</span>
		</span>
	} else {
		return <span>{text}</span>
	}
}

/**
 *
 * @param {*} h
 * @param {*} context
 * @param {*} url
 * @param {*} zoom
 * @param {*} style
 * @param {*} defaultImg
 * TODO 替换默认图片
 */
export function img(h, context, url, zoom, style, defaultImg) {
	url = url || defaultImg || defaultAvatar
	style = style || { height: '44px', width: '44px', verticalAlign: 'middle' }
	if (zoom) {
		const zoomStyle = { height: '120px', width: '120px' }
		return <tooltip transfer placement='top'>
			<img src={url} style={style} />
			<div slot='content'>
				<img src={url} style={zoomStyle} />
			</div>
		</tooltip>
	}
	return <img src={url} style={style} />
}

/**
 *
 * @param {*} h
 * @param {*} context
 * @param {*} text
 * @param {*} zoom
 */
export function longText(h, context, text, zoom) {
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
/**
 *
 * @param {*} h
 * @param {*} context
 * @param {*} text
 * @param {*} sensitive
 * @param {*} type
 */
export function riskText(h, context, text, sensitive, type) {
	const isSensitive = text && text !== '' && type === Constant.WxActionSetting.SendSensitiveWord.value
	const html = isSensitive ? hightlightSensitiveWord(text, sensitive, Constant.SensitiveLevel) : text
	return <tooltip transfer placement='top-start' style='display:inline'>
		<span domPropsInnerHTML={html}></span>

		<div slot='content' style='white-space:normal;word-break:break-word'>
			<span domPropsInnerHTML={html}></span>
		</div>
	</tooltip>
}

/**
 * Boolean值
 *
 * @param {*} h
 * @param {*} context
 * @param {*} val
 * @param {*} size
 */
export function yesNo(h, context, val, size) {
	if (val === undefined || val === null) return <span>-</span>
	if (typeof val === 'boolean') {
		return <icon type={val ? 'checkmark-round' : 'close-round'} size={size || 14} color={val ? '#19be6b' : '#ed3f14'}></icon>
	} else {
		if (val === Constant.YesNo.Unknown.value) {
			return <span>-</span>
		}
		return <icon type={val === Constant.YesNo.Yes.value ? 'checkmark-round' : 'close-round'} size={size || 14} color={val === Constant.YesNo.Yes.value ? '#19be6b' : '#ed3f14'}></icon>
	}
}

/**
 * 价格
 *
 * @param {*} h
 * @param {*} context
 * @param {*} val
 */
export function price(h, context, val) {
	if (val === undefined || val === null) return <span>-</span>
	return <span><icon type='social-yen' size='12'></icon> {val}</span>
}
