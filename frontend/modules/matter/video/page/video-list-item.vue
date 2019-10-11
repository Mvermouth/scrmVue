<style lang="less">
.video-list-item {
	box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
	margin: 4px 4px 4px 4px;
	padding: 0px;
    overflow: hidden;
    border-radius: 8px;
    background: #fff;

	width: 225px;
	height: 400px;
 	-webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
 	-webkit-border-radius: 8px;
 	-moz-border-radius: 8px;

	-webkit-transform: translateZ(0);
}

</style>
<template>
	<div class="video-list-item">
		<video loop="loop" width="100%" height="100%" @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()">
			<source :src="item.url" type="video/mp4" />
			浏览器不支持 HTML5 视频.
		</video>
	</div>
</template>

<script>
import _ from 'lodash'
import AppProxy from '../../../../scripts/common/appProxy'
import AppRoutes from '../../../../configs/AppRoutes'
import Constant from '../../../../configs/constant.js'
import defaultAvatar from '../../../../images/default-avatar.png'

const commonActions = {
	// 编辑
	update: {
		title: '编辑',
		onAction(product) {
		}
	},
	down_shelf: {
		title: '下架',
		onAction(product) {
			alert('要实现下架功能')
			// AppProxy.do_push(AppRoutes.OrderRefund.id(order.id, product.sn));
		}
	},
	delete: {
		title: '删除',
		color: '#2d8cf0',
		onAction(product) {
			alert('要实现删除功能')
		}
	}
}

export default {
	components: {
	},
	props: {
		item: {
			type: Object
		},
		product: {
			type: Object
		}
	},
	data() {
		return {
			AppProxy: AppProxy,
			AppRoutes: AppRoutes,
			Constant: Constant,
			defaultAvatar: defaultAvatar
		}
	},
	computed: {
	},
	methods: {
		handleAction(action) {
			const actionObj = commonActions[action]
			if (actionObj) {
				actionObj.onAction.call(this, this.product)
			}
		}
	}
}
</script>