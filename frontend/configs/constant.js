import {OrderStatus, ShipStatus, PayStatus} from '../../lib/Constants';
const Constants = {

	LibOrderStatus: OrderStatus,
	LibShipStatus: ShipStatus,
	LibPayStatus: PayStatus,

	EmployeeStatus: {

		Duty: {
			value: 'DUTY',
			text: '在职'
		},

		NoDuty: {
			value: 'NONDUTY',
			text: '离职'
		}

	},
	AuditLogAction: {

		Bind: {
			value: 'bind',
			text: '绑定'
		},

		Unbind: {
			value: 'unbind',
			text: '解绑'
		},
		UpdateEmployee: {
			value: 'updateEmployee',
			text: '修改员工'
		},
		DeleteEmployee: {
			value: 'deleteEmployee',
			text: '删除员工'
		},
		UpdateDepartment: {
			value: 'updateDepartment',
			text: '修改部门'
		},
		DeleteDepartment: {
			value: 'deleteDepartment',
			text: '删除部门'
		},
		updateProfile: {
			value: 'updateProfile',
			text: '修改运营号'
		}
	},

	UserOnlineStatus: {
		Unknown: {
			value: 0,
			text: '未知'
		},

		Online: {
			value: 1,
			text: '在线'
		},

		Logout: {
			value: 2,
			text: '退登'
		},

		Offline: {
			value: 3,
			text: '离线'
		}
	},

	Gender: {
		Unknown: {
			value: 0,
			text: '未知',
			url: ''
		},

		Male: {
			value: 1,
			text: '男'
		},
		Female: {
			value: 2,
			text: '女'
		}
	},
	YesNo: {
		Unknown: {
			value: 0,
			text: '未知'
		},

		Yes: {
			value: 1,
			text: '是'
		},

		No: {
			value: 2,
			text: '否'
		}
	},

	// 好友关系
	ImRelationStatus: {
		// Unknown: {
		// 	value: 0,
		// 	text: '未知'
		// },
		// RequestContact: {
		// 	value: 1,
		// 	text: '请求添加好友'
		// },
		RequestAccount: {
			value: 2,
			text: '请求添加好友'
		},
		Contact: {
			value: 3,
			text: '好友'
		},
		Deleted: {
			value: 4,
			text: '已删除'
		}
	},

	// 好友类型
	IMContactType: {
		Person: {
			value: 0,
			text: '好友'
		},

		MP: {
			value: 1,
			text: '公众号'
		},

		Group: {
			value: 2,
			text: '系统消息'
		},

		System: {
			value: 4,
			text: '系统'
		}
	},

	MailboxSenderType: {
		Unknown: {
			value: 0,
			text: '未知'
		},
		System: {
			value: 1,
			text: '系统'
		},
		Employee: {
			value: 2,
			text: '员工'
		},
		Department: {
			value: 3,
			text: '部门'
		}
	},
	MailboxResourceType: {
		Unknown: {
			value: 0,
			text: '未知'
		},
		Message: {
			value: 1,
			text: '消息'
		},
		Timeline: {
			value: 2,
			text: '朋友圈'
		},
		Notify: {
			value: 3,
			text: '通知'
		}
	},
	TimelineType: {
		ImageText: {
			value: 1,
			text: '图文'
		},
		Text: {
			value: 2,
			text: '文字'
		},
		Link: {
			value: 3,
			text: '链接'
		},
		Video: {
			value: 15,
			text: '视频'
		}
	},

	WxActionSetting: {
		// sendSensitiveWord: {
		// 	value: 'sendSensitiveWords',
		// 	text: '发送敏感词'
		// },
		// shareCard: {
		// 	value: 'shareCard',
		// 	text: '分享好友名片'
		// },
		// addToBlackList: {
		// 	value: 'addToBlackList',
		// 	text: '拉黑好友'
		// },
		// clearMsg: {
		// 	value: 'clearMsg',
		// 	text: '删除聊天记录'
		// },
		// withdraw: {
		// 	value: 'withdraw',
		// 	text: '提现'
		// },
		// alertDuplicateContact: {
		// 	value: 'alertDuplicateContact',
		// 	text: '提示重复好友'
		// },
		// logout: {
		// 	value: 'Logout',
		// 	text: '退出登录'
		// },
		// deleteFriend: {
		// 	value: 'deleteFriend',
		// 	text: '删除好友'
		// },
		// removeRequestFriend: {
		// 	value: 'removeRequestFriend',
		// 	text: '允许删除好友请求'
		// },
		// transferMoney: {
		// 	value: 'canTransferMoney',
		// 	text: '转账'
		// },
		// sendRedEnvelope: {
		// 	value: 'SendRedEnvelope',
		// 	text: '发红包'
		// },
		// receiveTransferMoney: {
		// 	value: 'receiveTransferMoney',
		// 	text: '接收转账'
		// },
		// receiveRedEnvelope: {
		// 	value: 'receiveRedEnvelope',
		// 	text: '接收红包'
		// },
		// canResetAccountQRCode: {
		// 	value: 'canResetAccountQRCode',
		// 	text: '允许重置二维码'
		// },
		// audioChat: {
		// 	value: 'audioChat',
		// 	text: '语音聊天'
		// },
		// videoChat: {
		// 	value: 'videoChat',
		// 	text: '视频聊天'
		// }
		TryClearMsg: {
			value: 'try_clear_msg',
			text: '清除消息'
		},
		SendSensitiveWord: {
			value: 'send_sensitive_word',
			text: '发送敏感词'
		},
		SendIllegalQrcode: {
			value: 'send_illegal_qrcode',
			text: '发送非法二维码'
		},
		RevokeMsg: {
			value: 'try_revoke_msg',
			text: '撤回消息'
		},
		TryAddBlacklist: {
			value: 'try_add_blacklist',
			text: '添加到黑名单'
		},
		TryShowAccountView: {
			value: 'try_show_account_view',
			text: '打开支付页面'
		},
		TryShareCard: {
			value: 'try_share_card',
			text: '分享好友名片'
		},
		TryRemoveNewFriendRequest: {
			value: 'try_remove_new_friend_request',
			text: '删除好友请求'
		},
		TryDeleteContact: {
			value: 'try_delete_contact',
			text: '删除联系人'
		},
		TryFetchMoney: {
			value: 'try_fetch_money',
			text: '提现'
		},
		TryLogout: {
			value: 'try_logout',
			text: '退出登录'
		}
	},

	WxControlSetting: {
		showMobileNo: {
			value: 'showMobileNo',
			text: '显示手机号'
		},
		showAccountWxNo: {
			value: 'showAccountWxNo',
			text: '显示自己微信号'
		},
		showAccountQR: {
			value: 'showAccountQR',
			text: '显示自己二维码'
		},
		showContactWxNo: {
			value: 'showContactWxNo',
			text: '查看好友微信号'
		},
		showAccountView: {
			value: 'showAccountView',
			text: '可进入账号与安全页面'
		},
		customLocation: {
			value: 'customLocation',
			text: '自定义发朋友圈的地理位置'
		},
		closeSensitiveWord: {
			value: 'closeSensitiveWord',
			text: '允许外发敏感词'
		},
		canShareCard: {
			value: 'canShareCard',
			text: '允许推荐名片'
		},
		addToBlackList: {
			value: 'addToBlackList',
			text: '允许拉黑好友'
		},
		canClearMsg: {
			value: 'canClearMsg',
			text: '允许删除聊天记录'
		},
		canWithdraw: {
			value: 'canWithdraw',
			text: '允许提现'
		},
		alertDuplicateContact: {
			value: 'alertDuplicateContact',
			text: '提示重复好友'
		},
		canLogout: {
			value: 'canLogout',
			text: '允许退出登录'
		},
		canOpenPaymentManage: {
			value: 'canOpenPaymentManage',
			text: '允许打开支付管理'
		},
		deleteFriend: {
			value: 'deleteFriend',
			text: '允许删除好友'
		},
		canRemoveRequestFriend: {
			value: 'canRemoveRequestFriend',
			text: '允许删除好友请求'
		},
		canTransferMoney: {
			value: 'canTransferMoney',
			text: '允许转账'
		},
		canSendRedEnvelope: {
			value: 'canSendRedEnvelope',
			text: '允许发红包'
		},
		forbidReceiveTransferMoney: {
			value: 'forbitReceiveTransferMoney',
			text: '禁止接收转账'
		},
		forbidReceiveRedEnvelope: {
			value: 'forbitReceiveRedEnvelope',
			text: '禁止接收红包'
		},
		uploadGroupMsg: {
			value: 'uploadGroupMsg',
			text: '上报群消息'
		},
		autoAcceptGroupInvitation: {
			value: 'autoAcceptGroupInvitation',
			text: '自动同意入群'
		},
		canResetAccountQRCode: {
			value: 'canResetAccountQRCode',
			text: '允许重置二维码'
		},
		canAutoApproveFriend: {
			value: 'canAutoApproveFriend',
			text: '自动通过好友'
		},
		uploadHDImgMsg: {
			value: 'uploadHDImgMsg',
			text: '上传高清图'
		},
		audioChat: {
			value: 'audioChat',
			text: '是否允许语音聊天'
		},
		videoChat: {
			value: 'videoChat',
			text: '是否允许视频聊天'
		},
		uploadVideoMsg: {
			value: 'uploadVideoMsg',
			text: '上传视频消息'
		},
		canRevokeMsg: {
			value: 'canRevokeMsg',
			text: '是否允许撤回消息'
		}

	},
	DeviceSetting: {
		// 是否显示app的图标
		ShowAppIcon: {
			value: 'showAppIcon',
			text: '显示软件图标'
		},
		// 是否允许卸载软件
		UninstallApp: {
			value: 'uninstallApp',
			text: '允许卸载软件'
		}
	},
	// 交易类型
	ExchangeType: {
		Unknown: {
			value: 0,
			text: '未知'
		},
		Transfer: {
			value: 1,
			text: '微信红包'
		},
		RedPacket: {
			value: 2,
			text: '微信转账'
		},
		Withdraw: {
			value: 3,
			text: '提现'
		},
		CreditCardRefund: {
			value: 4,
			text: '信用卡还款'
		}
	},

	// 消息方向
	MessageDirection: {
		Unknown: {
			value: 0,
			text: '未知'
		},
		SendByConatct: {
			value: 1,
			text: '接收'
		},
		SendByAccount: {
			value: 2,
			text: '发出'
		}
	},
	// 呼叫方向
	CallDirection: {
		Unknown: {
			value: 0,
			text: '未知'
		},
		receive: {
			value: 1,
			text: '呼入'
		},
		send: {
			value: 2,
			text: '呼出'
		}
	},

	// 敏感级别
	SensitiveLevel: {
		General: {
			value: 1,
			text: '一般'
		},
		High: {
			value: 2,
			text: '比较敏感'
		},
		Critical: {
			value: 3,
			text: '非常敏感'
		}
	},
	MessageType: {
		Text: {
			value: 1,
			text: '文本'
		},

		Audio: {
			value: 2,
			text: '语音'
		},
		Image: {
			value: 3,
			text: '图片'
		},
		Video: {
			value: 4,
			text: '视频'
		},
		Card: {
			value: 5,
			text: '名片'
		},
		Link: {
			value: 6,
			text: '链接'
		},
		HongBao: {
			value: 7,
			text: '红包'
		},
		Transfer: {
			value: 8,
			text: '转账'
		},
		Contact: {
			value: 10,
			text: '联系人'
		},
		Position: {
			value: 11,
			text: '地理位置'
		},
		Request: {
			value: 12,
			text: '好友请求'
		},
		Animation: {
			value: 13,
			text: '动画表情'
		},
		AudioCall: {
			value: 14,
			text: '语音通话'
		},
		VideoCall: {
			value: 15,
			text: '视频通话'
		},
		Unknown: {
			value: 17,
			text: '暂未识别'
		},
		App: {
			value: 18,
			text: '小程序'
		},
		File: {
			value: 19,
			text: '文件'
		},
		Notification: {
			value: 10000,
			text: '通知消息'
		}
	},
	MIMEType: {
		// 图片
		image: 'image/jpeg',
		// 视频
		video: 'video/mp4',
		// 链接
		link: 'link'
	},

	FilterItemType: {
		White: {
			value: 'white',
			text: '白名单'
		},
		Black: {
			value: 'black',
			text: '黑名单'
		}
	},
	FilterItemCategory: {
		Link: {
			value: 'links',
			text: '二维码'
		}
	},

	AssetType: {
		Video: {
			value: 'video',
			text: '视频'
		},
		Link: {
			value: 'link',
			text: '链接'
		},
		Image: {
			value: 'image',
			text: '图片'
		},
		ImageText: {
			value: 'imageText',
			text: '图文'
		}
	},
	// 风控
	RiskRefType: {
		message: 'im.13.message',
		timeline: 'im.13.timeline',
		action: 'im.13.action'
	},
	// 支付渠道
	PaymentChannel: {
		WechatPay: {
			value: 'wechat_pay',
			text: '微信支付'
		},
		WechatTransfer: {
			value: 'wechat_transfer',
			text: '微信转账'
		},
		WechatRedPocket: {
			value: 'wechat_red_pocket',
			text: '微信红包'
		},
		Alipay: {
			value: 'alipay',
			text: '支付宝'
		},
		UnionPayZS: {
			value: 'UnionPayZS',
			text: '招商银行'
		},		
		UnionPayZG: {
			value: 'UnionPayZG',
			text: '中国银行'
		},		
		UnionPayGS: {
			value: 'UnionPayGS',
			text: '工商银行'
		},		
		UnionPayYZ: {
			value: 'UnionPayYZ',
			text: '中国邮政储蓄'
		},
		WechatPub: {
			value: 'wx_pub',
			text: '微信公众号'
		}
	},
	AddSourceType: {
		SearchQQ: {
			value: 1,
			text: '通过搜索QQ号添加'
		},
		ContactSearchQQ: {
			value: 1000001,
			text: '对方通过搜索QQ号添加'
		},
		SearchAddressList: {
			value: 13,
			text: '通过手机通讯录添加'
		},
		ContactAddressList: {
			value: 1000013,
			text: '对方通过手机通讯录添加'
		},
		NewFriend: {
			value: 10,
			text: '通过新朋友添加'
		},
		ContactNewFriend: {
			value: 1000010,
			text: '对方通过新朋友添加'
		},
		Group: {
			value: 14,
			text: '来自群聊'
		},
		ContactGroup: {
			value: 1000014,
			text: '对方通过群聊添加'
		},
		SearchCustomID: {
			value: 3,
			text: '通过搜索微信号添加'
		},
		ContactSearchCustomID: {
			value: 1000003,
			text: '对方通过搜索微信号添加'
		},
		SearchPhone: {
			value: 15,
			text: '通过搜索手机号添加'
		},
		ContactPhone: {
			value: 1000015,
			text: '对方通过搜索手机号添加'
		},
		SearchScan: {
			value: 30,
			text: '通过扫一扫添加'
		},
		ContactSearchScan: {
			value: 1000030,
			text: '对方通过扫一扫添加'
		},
		SearchNearby: {
			value: 18,
			text: '通过附近的人添加'
		},
		ContactSearchNearby: {
			value: 1000018,
			text: '对方通过附近的人添加'
		},
		Shake: {
			value: 29,
			text: '通过摇一摇添加'
		}
	},
	CollectSourceType: {
		SearchQQ: {
			value: [1, 1000001],
			text: '搜索QQ号添加'
		},
		SearchAddressList: {
			value: [13, 1000013],
			text: '手机通讯录添加'
		},
		NewFriend: {
			value: [10, 1000010],
			text: '新朋友添加'
		},
		Group: {
			value: [14, 1000014],
			text: '来自群聊'
		},
		SearchCustomID: {
			value: [3, 1000003],
			text: '搜索微信号添加'
		},
		SearchPhone: {
			value: [15, 1000015],
			text: '搜索手机号添加'
		},
		SearchScan: {
			value: [30, 1000030],
			text: '通过扫一扫添加'
		},
		SearchNearby: {
			value: [18, 1000018],
			text: '通过附近的人添加'
		},
		Shake: {
			value: [29, 1000029],
			text: '通过摇一摇添加'
		}
	},
	ShipStatus: {
		NotShipped: {
			value: 'not_shipped',
			text: '待发货'
		},
		Shipping: {
			value: 'shipping',
			text: '已发货'
		},
		Shipped: {
			value: 'shipped',
			text: '已签收'
		},
		ShipReturning: {
			value: 'ship_returning',
			text: '退回中'
		},
		ShipReturned: {
			value: 'ship_returned',
			text: '已退回'
		}
	},
	PayStatus: {
		NotPay: {
			value: 'not_pay',
			text: '未支付'
		},
		Payed: {
			value: 'payed',
			text: '已支付'
		},
		PartialPayed: {
			value: 'partial_payed',
			text: '部分支付'
		}
	},
	OrderStatus: {
		Commit: {
			value: OrderStatus.pending.value,
			text: '待审核',
			filter: [{
				filterType: "EQ",
				property: "orderStatus",
				value: 'pending'
			}]
		},
		Unconfirm: {
			value: OrderStatus.unconfirmed.value,
			text: '审核不通过',
		},
		// Confirm: {
		// 	value: 'confirmed',
		// 	text: '待发货',
		// 	filter: [{
		// 		filterType: "EQ",
		// 		property: "orderStatus",
		// 		value: 'confirmed'
		// 	}]
		// },
		Delivering: {
			value: 'delivering',
			text: '已发货',
		},
		refund: {
			value: 'refund',
			text: '退款|退货',
		},
		Completed: {
			value: 'completed',
			text: '已完成',
		},
		Cancel: {
			value: 'canceled',
			text: '关闭',
		}
	},
	// 退货状态
	ReShiptatus: {
		Pending: {
			value: 'pending',
			text: '待审核'
		},
		Unconfirmed: {
			value: 'unconfirmed',
			text: '审核不通过'
		},

		Refunding: {
			value: 'refunding',
			text: '退货中'
		},
		completed: {
			value: 'completed',
			text: '完成'
		}
	},
	OrderTabs: {
		Commit: {
			value: OrderStatus.pending.value,
			text: '待审核',
			filter: [{
				filterType: "EQ",
				property: "orderStatus",
				value: OrderStatus.pending.value
			}]
		},
		Unconfirm: {
			value: OrderStatus.unconfirmed.value,
			text: '审核拒绝',
			filter: [{
				filterType: "EQ",
				property: "orderStatus",
				value:OrderStatus.unconfirmed.value
			}]
		},
		NotShipped: {
			value: ShipStatus.not_shipped.value,
			text: '待发货',
			filter: [{
				filterType: "EQ",
				property: "shipStatus",
				value: ShipStatus.not_shipped.value
			}, {
				filterType: "EQ",
				property: "orderStatus",
				value: OrderStatus.confirmed.value
			}]
		},
		Delivering: {
			value: 'delivering',
			text: '已发货',
			filter: [
				{
					filterType: "EQ",
					property: "orderStatus",
					value: OrderStatus.confirmed.value
				},
				{
					filterType: "EQ",
					property: "shipStatus",
					value: ShipStatus.shipping.value
				},
			]
		},
		Shipped: {
			value: 'shipped',
			text: '客户签收',
			filter: [
				{
					filterType: "EQ",
					property: "orderStatus",
					value: OrderStatus.confirmed.value
				},
				{
					filterType: "EQ",
					property: "shipStatus",
					value: ShipStatus.shipped.value
				},
				{
					filterType: "NE",
					property: "payStatus",
					value: PayStatus.payed.value
				},
			]
		},
		ShippedReturn: {
			value: 'ShippedReturn',
			text: '仓库签收',
			filter: [
				{
					filterType: "EQ",
					property: "orderStatus",
					value: OrderStatus.confirmed.value
				},
				{
					filterType: "EQ",
					property: "shipStatus",
					value: ShipStatus.ship_returned.value
				},
			]
		},
		NotPay: {
			value: 'NotPay',
			text: '未回款',
			filter: [
				{
					filterType: "EQ",
					property: "orderStatus",
					value: OrderStatus.confirmed.value
				},
				{
					filterType: "NE",
					property: "payStatus",
					value: PayStatus.payed.value,
				},
				{
					filterType: "EQ",
					property: "shipStatus",
					value: ShipStatus.shipped.value
				},
			]
		},
		Payed: {
			value: 'Payed',
			text: '已回款',
			filter: [
				{
					filterType: "EQ",
					property: "orderStatus",
					value: OrderStatus.confirmed.value
				},
				{
					filterType: "EQ",
					property: "shipStatus",
					value: ShipStatus.shipped.value
				},
				{
					filterType: "EQ",
					property: "payStatus",
					value: PayStatus.payed.value
				},
				{
					filterType: "NOT_IN",
					property: "refundStatusList",
					value: ['pending', 'refunding', 'unconfirmed', 'completed']
				},
			]
		},
		refund: {
			value: 'refund',
			text: '退款|退货',
			filter: [{
					filterType: "IN",
					property: "refundStatusList",
					value: ['pending', 'refunding', 'unconfirmed', 'completed']
				},
			]
		},
		Exception: {
			value: 'Exception',
			text: '问题订单',
			filter: [{
				filterType: "EQ",
				property: "orderStatus",
				value: OrderStatus.exception.value
			}]
		},
		// Completed: {
		// 	value: 'completed',
		// 	text: '已完成',
		// 	filter: [{
		// 		filterType: "EQ",
		// 		property: "orderStatus",
		// 		value: OrderStatus.completed.value
		// 	}]
		// },
		Cancel: {
			value: 'canceled',
			text: '已关闭订单',
			filter: [
				{
					filterType: "IN",
					property: "orderStatus",
					value: [OrderStatus.canceled.value, OrderStatus.completed.value]
				},
			]
		}
	},
	// 退款状态
	RefundStatus: {
		Pending: {
			value: 'pending',
			text: '待审核'
		},
		Unconfirmed: {
			value: 'unconfirmed',
			text: '审核不通过'
		},

		Refunding: {
			value: 'refunding',
			text: '退款中'
		},
		completed: {
			value: 'completed',
			text: '完成'
		}
	},

	// 退货操作
	ReturnAction: {
		Confirm: {
			value: 'confirm',
			text: '审核通过'
		},
		Unconfirm: {
			value: 'unconfirm',
			text: '拒绝'
		},

		Refund: {
			value: 'refund',
			text: '已收货,同意退款'
		},
		Unrefund: {
			value: 'unrefund',
			text: '拒绝退款'
		}
	},

	// 退款操作
	RefundAction: {
		Confirm: {
			value: 'confirm',
			text: '审核通过'
		},
		Unconfirm: {
			value: 'unconfirm',
			text: '拒绝'
		},

		Refund: {
			value: 'refund',
			text: '确认已退款'
		},
		Unrefund: {
			value: 'unrefund',
			text: '拒绝退款'
		}
	},
	// 退款单操作类型
	OrderOperation: {
		OrderOperation: {
			value: '10',
			text: '订单操作'
		},
		DeleteOrder: {
			value: '11',
			text: '删除订单'
		},
		StatusOperation: {
			value: '12',
			text: '跟单操作'
		},
		RefundCreate: {
			value: '20',
			text: '售后操作'
		},
		RefundOrderOperation: {
			value: '22',
			text: '售后订单流转'
		}

	},
	RefundOrderType: {
		refund: {
			value: 'refund',
			text: '退款'
		},
		change: {
			value: 'change',
			text: '换货'
		},
		return: {
			value: 'return',
			text: '退款退货'
		}
	},

	StatsDataSourceType: {
		TimeseriesSelect: {
			value: 'ts_sel',
			text: '时间序列数据列表'
		},
		TimeseriesAggregate: {
			value: 'ts_aggr',
			text: '时间序列数据聚合'
		},
		TimeseriesTopN: {
			value: 'ts_top_n',
			text: '时间序列单维度聚合'
		},
		TimeseriesGroupBy: {
			value: 'ts_grp',
			text: '时间序列多维度聚合'
		},
		Counter: {
			value: 'counter',
			text: '计数器'
		},
		URL: {
			value: 'url',
			text: '指定链接'
		}
	},

	StatsIntervalType: {
		Today: {
			value: 'today',
			text: '今日'
		},
		Yesterday: {
			value: 'yesterday',
			text: '昨日'
		},
		CurrentMonth: {
			value: 'current_month',
			text: '本月'
		},
		PrevMonth: {
			value: 'prev_month',
			text: '上月'
		},
		Prev7Days: {
			value: 'prev_7days',
			text: '近7天'
		},
		Prev15Days: {
			value: 'prev_15days',
			text: '近15天'
		},
		Prev30Days: {
			value: 'prev_30days',
			text: '近30天'
		}
	},

	TagType: {
		Asset: {
			value: 'asset',
			text: '素材'
		}
	},
	PlatformMap: {
		TencentWx: {
			value: 'TencentWX',
			text: '微信'
		},
		Youzan: {
			value: 'youzan',
			text: '有赞'
		},
		Pingduoduo: {
			value: 'pingduoduo',
			text: '拼多多'
		},
		Taobao: {
			value: 'taobao',
			text: '淘宝'
		},
		Jingdong: {
			value: 'jd',
			text: '京东'
		},
		Juketong: {
			value: 'juketong',
			text: '聚客通'
		},
		Douyin: {
			value: 'douyin',
			text: '抖音'
		}
	},

	ShopMap: {
		Youzan: {
			value: 'youzan',
			text: '有赞',
			disabled:false
		},
		Taobao: {
			value: 'taobao',
			text: '淘宝',
			disabled:true
		},
		Jingdong: {
			value: 'jd',
			text: '京东',
			disabled:true
		},
		Pingduoduo: {
			value: 'pingduoduo',
			text: '拼多多',
			disabled:true
		}
	},
	OrderChannel: {
		TencentWX: {
			value: 'TencentWX',
			text: '微信'
		},
		Telemarketing: {
			value: 'telemarketing',
			text: '电销'
		}
	},
	OrderTags: {
		First: {
			value: '首次购买',
			text: '首次购买'
		},
		Duplicate: {
			value: '复购',
			text: '复购'
		},
		Present: {
			value: '赠送',
			text: '赠送'
		}
	}
}

export default Constants
