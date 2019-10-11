
export default {
	Profile: {
		id: (accountId, title = '') => (`/im/profile/retrieve/${accountId}?name=${encodeURIComponent(title)}`),
		update: (id, name = '') => (`/im/profile/update/${id}?name=${encodeURIComponent(name)}`),
		pageDuplicatedContacts: (platformUid, title = '') => (`/im/profile/pageDuplicatedContacts?name=${encodeURIComponent(title)}&platformUid=${encodeURIComponent(platformUid)}`),
		updateEmplyee: (id, nickname = '') => (`/im/profile/updateEmployee/${id}?name=${encodeURIComponent(nickname)}`),
		updateTags: (id, title = '') => (`/im/profile/updateTags/${id}?name=${encodeURIComponent(title)}`)
	},
	Relation: {
		_: (fromId, toId, title = '') => (`/im/relation/forward?fromId=${encodeURIComponent(fromId)}&toId=${encodeURIComponent(toId)}&name=${encodeURIComponent(title)}`),
		edit: (id, title = '') => (`/im/relation/update/${id}?name=${encodeURIComponent(title)}`),
		updateTags: (id, title = '') => (`/im/relation/updateTags/${id}?name=${encodeURIComponent(title)}`),
		updateRemark: (id, title = '') => (`/im/relation/updateRemark/${id}?name=${encodeURIComponent(title)}`),
		duplicatedProfiles: (platformUid, name = '') => (`/im/relation/pageDuplicatedProfiles?name=${encodeURIComponent(name)}&platformUid=${encodeURIComponent(platformUid)}`)
	},
	Timeline: {
		_: (id, cursor, fromId, name = '') => `/im/timeline/listByContact/${id}?cursor=${cursor}&fromId=${fromId}&name=${encodeURIComponent(name)}'}`
		,detail:(id) => `/marketing/wxgroup/page?id=${id}`
		,detailTimeline:(id) => `/marketing/timeline/page?id=${id}`
	},
	ChatSession: {
		id: (sessionId, title = '') => (`/im/session/chat/${sessionId}?name=${encodeURIComponent(title)}`),
		_: (fromId, toId) => (`/im/session/chat?fromId=${fromId}&toId=${toId}`),
		findByFromIdAndToIdAndTimeGTE: (fromId, toId, beginTime, title = '') => (`/im/session/chat?fromId=${fromId}&toId=${toId}&currentTab=contact&name=${encodeURIComponent(title)}`),
		chatMessage: (fromId, toId = '', refId = '', title = '') => (`/im/session/chat?fromId=${fromId}&toId=${toId}&currentTab=contact&refId=${refId}&name=${encodeURIComponent(title)}`),
		groupMessage: (fromId, toId = '', refId = '', title = '') => (`/im/session/chat?fromId=${fromId}&toId=${toId}&currentTab=group&refId=${refId}&name=${encodeURIComponent(title)}`),
		sessionMessage: (fromId, toId = '', refId = '', title = '') => (`/im/session/chat?fromId=${fromId}&toId=${toId}&currentTab=session&name=${encodeURIComponent(title)}&refId=${refId}`),
		timelines: (fromId, title = '') => (`/im/session/chat?fromId=${fromId}&currentTab=timeline&name=${encodeURIComponent(title)}`)
	},
	Group: {
		id: (groupId, title = '') => (`/im/group/retrieve/${groupId}?name=${encodeURIComponent(title)}`),
		members: (groupId, title = '') => (`/im/group/members/${groupId}?name=${encodeURIComponent(title)}`),
		messages: (groupId, messageId, title = '') => (`/im/group/message/${groupId}?messageId=${messageId}&name=${encodeURIComponent(title)}`),
		update: (groupId, title = '') => (`/im/group/update/${groupId}?name=${encodeURIComponent(title)}`)
	},
	Contact: {
		id: (contactId, title = '') => (`/im/contact/retrieve/${contactId}?name=${encodeURIComponent(title)}`)
	},
	Product: {
		update: (id) => (`/ecommerse/product/update/${id}`),
		page: () => (`/ecommerse/product/page`)
	},
	Order: {
		pay: (orderId, title = '') => (`/ecommerse/order/pay/${orderId}?name=${encodeURIComponent(title)}`),
		update: (id) => (`/ecommerse/order/update/${id}`),
		page: () => (`/ecommerse/order/page`)
	},
	OrderRefund: {
		id: (id, sn, refundType) => (`/ecommerse/refundOrder/create/${id}?id=${id}&sn=${sn}&type=${refundType}`),
		retrieve: (id) => (`/ecommerse/refundOrder/retrieve/${id}`)
	},
	ShipInfo: {
		id: (id, no) => (`/ecommerse/shipInfo/retrieve/${id}?id=${id}&no=${no}`)
	},
	Department: {
		create: () => (`/erp/department/create`)
	},
	Inventory: {
		page: () => (`/ecommerse/inventory/page`)
	},
	User: {
		home: name => (`/system/personal/page?name=${encodeURIComponent(name)}`)
	},
	Payment: {
		createQR: () => (`/ecommerse/payment/createQrcode`)
	},
	Matter: {
		createImageText: () => (`/matter/imageText/create`)
	},
	// TODO @fioman refactor
	Domain: {
		create: domain => (`${domain.baseUrl}/create`),
		update: (id, domain) => (`${domain.baseUrl}/update/${id}`)
	},
	Clouddata: {
		Douyin: {
			User: {
				id: (uid, title = '') => (`/clouddata_douyin/user/retrieve/${uid}?name=${encodeURIComponent(title)}`)
			}
		}
	},
	Device: {
		id: id => (`/dms/device/retrieve/${id}`)
	},
	Shop: {
		detail: id => (`/ecommerse/shop/detail/${id}`)
	}
}

