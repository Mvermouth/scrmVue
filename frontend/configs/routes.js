/**
 * 路由配置
 */
export default [
	{
		path: '/auth/role/create',
		meta: {
			target: 'dialog',
			title: '添加角色',
			width: 800
		}
	},
	{
		path: '/auth/role/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑角色',
			width: 800
		}
	},
	{
		path: '/erp/department/create',
		meta: {
			target: 'dialog',
			title: '添加部门',
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/erp/department/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑部门',
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/erp/employee/create',
		meta: {
			target: 'dialog',
			title: '添加员工',
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/erp/employee/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑员工',
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/dms/device/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑设备',
			maxHeight: 500
		}
	},
	{
		path: '/dms/device/retrieve/:id',
		meta: {
			title: '设备详情'
		}
	},
	{
		path: '/im/profile/update/:id',
		meta: {
			title: '运营号编辑',
			width: 1000
		}
	},
	{
		path: '/im/profile/updateEmployee/:id',
		meta: {
			target: 'dialog',
			title: route => `运营号 - ${route.query.name || '未知运营号'}`,
			width: 500,
			maxHeight: 300
		}
	},
	{
		path: '/im/profile/updateTags/:id',
		meta: {
			target: 'dialog',
			title: route => `运营号 - ${route.query.name || '未知运营号'}`,
			width: 500,
			maxHeight: 300
		}
	},
	{
		path: '/im/relation/updateTags/:id',
		meta: {
			target: 'dialog',
			title: route => `好友 - ${route.query.name || '未知好友'}`,
			width: 500,
			maxHeight: 300
		}
	},
	{
		path: '/im/relation/updateRemark/:id',
		meta: {
			target: 'dialog',
			title: route => `好友 - ${route.query.name || '未知好友'}`,
			width: 500,
			maxHeight: 300
		}
	},
	{
		path: '/risk/sensitive/create',
		meta: {
			target: 'dialog',
			title: '添加敏感词',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/risk/sensitive/update/:id',
		meta: {
			target: 'dialog',
			title: '敏感词编辑',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/risk/filterItem/create',
		meta: {
			target: 'dialog',
			title: '添加白名单',
			maxHeight: 500,
			width: 800
		}
	},

	{
		path: '/risk/filterItem/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑白名单',
			maxHeight: 500,
			width: 800
		}
	},

	{
		path: '/im/relation/retrieve/:id',
		meta: {
			title: route => `好友 - ${route.query.name || '未知好友'}`
		}
	},
	{
		path: '/im/relation/forward',
		meta: {
			title: route => `好友 - ${route.query.name || '未知好友'}`
		}
	},

	{
		path: '/im/relation/retrieve/:id',
		meta: {
			title: route => `客户 - ${route.query.name || '未知好友'}`
		}
	},

	{
		path: '/im/relation/update/:id',
		meta: {
			target: 'dialog',
			title: route => `客户编辑 - ${route.query.name || '未知好友'}`,
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/im/profile/retrieve/:id',
		meta: {
			title: route => `运营号 - ${route.query.name || '未知运营号'}`
		}
	},
	{
		path: '/im/profile/pageDuplicatedContacts',
		meta: {
			target: 'dialog',
			title: route => `运营号重复好友 - ${route.query.name || '未知运营号'}`
		}
	},
	{
		path: '/im/relation/pageDuplicatedProfiles',
		meta: {
			target: 'dialog',
			title: route => `好友重复详情 - ${route.query.name || '未知好友'}`
		}
	},
	{
		path: '/im/contact/retrieve/:id',
		meta: {
			title: route => `好友详情 - ${route.query.name || '未知好友'}`,
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/im/group/members/:id',
		meta: {
			target: 'dialog',
			title: route => `好友详情 - ${route.query.name || '未知好友'}`,
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/im/timeline/listByContact/:id',
		meta: {
			target: 'dialog',
			title: route => `好友朋友圈 - ${route.query.name || '未知'}`,
			width: 600,
			maxheight: 850
		}
	},
	{
		path: '/im/session/chat',
		meta: {
			target: 'dialog',
			title: route => `运营号 - ${route.query.name || ''}`,
			width: 1000,
			maxheight: 850
		}
	},
	{
		path: '/im/group/update/:id',
		meta: {
			target: 'dialog',
			title: route => `群编辑 - ${route.query.name || '未知'}`,
			width: 900,
			maxHeight: 600
		}
	},
	{
		path: '/im/group/retrieve/:id',
		meta: {
			title: route => `群详情 - ${route.query.name || '未知'}`
		}
	},
	{
		path: '/system/personal/page',
		meta: {
			title: route => `个人中心 - ${route.query.name || '未知'}`
		}
	},
	// 电商
	{
		path: '/ecommerse/category/create',
		meta: {
			target: 'dialog',
			title: route => `添加分类`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/category/update/:id',
		meta: {
			target: 'dialog',
			title: route => `编辑分类`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/product/create',
		meta: {
			title: route => `创建商品`
		}
	},
	{
		path: '/ecommerse/product/update/:id',
		meta: {
			title: route => `编辑商品`
		}
	},

	{
		path: '/ecommerse/brand/create',
		meta: {
			target: 'dialog',
			title: route => `添加品牌`,
			maxHeight: 600,
			width: 900
		}
	},
	{
		path: '/ecommerse/brand/update/:id',
		meta: {
			target: 'dialog',
			title: route => `编辑品牌`,
			maxHeight: 600,
			width: 900
		}
	},
	{
		path: '/ecommerse/warehouse/create',
		meta: {
			target: 'dialog',
			title: route => `添加仓库`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/warehouse/update/:id',
		meta: {
			target: 'dialog',
			title: route => `编辑仓库`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/spec/create',
		meta: {
			target: 'dialog',
			title: route => `添加规格`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/spec/update/:id',
		meta: {
			target: 'dialog',
			title: route => `编辑规格`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/inventory/create',
		meta: {
			title: route => `设置库存`,
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/ecommerse/inventory/update/:id',
		meta: {
			target: 'dialog',
			title: route => `编辑库存`,
			maxHeight: 400,
			width: 600
		}
	},
	// 订单详情
	{
		path: '/ecommerse/order/retrieve/:id',
		meta: {
			title: route => `订单号 - ${route.query.sn || '未知订单号'}`
		}
	},
	{
		path: '/ecommerse/order/pay/:id',
		meta: {
			target: 'dialog',
			title: '订单支付',
			maxHeight: 800,
			width: 800
		}
	},
	{
		path: '/ecommerse/customer/update/:id',
		meta: {
			target: 'dialog',
			title: '客户编辑',
			width: 900
		}
	},
	// 订单退款退货
	{
		path: '/ecommerse/refundOrder/create/:id',
		meta: {
			title: route => `售后 - ${route.query.sn || '未知订单号'}`
		}
	},
	// 订单退款退货
	{
		path: '/ecommerse/refundOrder/retrieve/:id',
		meta: {
			title: route => `退款退货详情`
		}
	},
	// 订单退款退货
	{
		path: '/ecommerse/order/update/:id',
		meta: {
			title: '编辑订单'
		}
	},
	{
		path: '/ecommerse/shipInfo/retrieve/:id',
		meta: {
			target: 'dialog',
			title: route => `物流详情`,
			maxHeight: 800,
			width: 600
		}
	},
	{
		path: '/ecommerse/payment/createQrcode',
		meta: {
			target: 'dialog',
			title: route => `设置付款码`,
			maxHeight: 800,
			width: 600
		}
	},
	{
		path: '/system/tag/update/:id',
		meta: {
			target: 'dialog',
			title: '标签编辑',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/system/tag/create',
		meta: {
			target: 'dialog',
			title: '添加标签',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/matter/link/create',
		meta: {
			target: 'dialog',
			title: '添加外部链接',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/matter/link/update/:id',
		meta: {
			target: 'dialog',
			title: '编辑外部链接',
			maxHeight: 500,
			width: 800
		}
	},
	{
		path: '/matter/imageText/update/:id',
		meta: {
			title: '编辑图文素材'
		}
	},
	{
		path: '/matter/imageText/create',
		meta: {
			title: '新增图文素材'
		}
	},
	// 大数据 - douyin
	{
		path: '//user/retrieve/:id',
		meta: {
			title: route => `aweme - 用户详情 - ${route.query.name || '未知'}`
		}
	},
	{
		path: '/ecommerse/shop/detail/:id',
		meta: {
			title: route => `店铺详情`
		}
	},
	{
		path: '/ecommerse/shop/callback',
		meta: {
			title: route => `店铺信息`
		}
	},
	{
		path: '/ecommerse/shop/bind/:id',
		meta: {
			title: route => `店铺授权`
		}
	},
	{
		path: '/marketing/wxgroup/page',
		meta: {
			title: route => `群发详情`
		}
	},
	{
		path: '/marketing/timeline/page',
		meta: {
			title: route => `朋友圈详情`
		}
	}
]
