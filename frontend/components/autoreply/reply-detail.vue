<style lang="less" scoped>
	.cart-layout {
		font-size: 12px;
		width: 430px;
		margin: 0 auto;
		ul,li {
			list-style: none;
		}
		.item-content{
			&:last-child {
				border-bottom: 1px solid #e7e7e7;
			}
			border: 1px solid #e7e7e7;
			border-bottom: none;
		}
		.cart-table-th {
			overflow: hidden;
			height: 50px;
			color: #3c3c3c;
		}
		.th {
			text-align: left;
			position: relative;
			float: left;
		}	
		.td {
			position: relative;
			float: left;
			min-height: 100px;
		}
		.td-inner {
			padding-top: 20px; 
		}
		.th-chk, .td-chk {
			width: 20px;
		}
		.th-chk {
			font-size: 12px;
			text-align: left;
			position: relative;
			height: 50px;
		}
		.th-item, .td-item {
			width: 280px;
		}
		.th-item {
			.td-inner {
				padding-left: 20px;
			}
		}
		.item-pic {
			width: 80px;
			height: 80px;
			border: 1px solid #eee;
			float: left;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.item-info {
			margin: 0 0 0 91px;
			padding-right: 25px;
		}
		.th-type, .td-type {
			width: 100px;
		}
		.clearfix {
			&::after {
				content: '\0020';
				display: block;
				height: 0;
				clear: both;
			}
		}
		.video-list-item {
			box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
			margin: 4px 4px 4px 4px;
			padding: 0px;
			overflow: hidden;
			border-radius: 8px;
			background: #fff;
			width: 120px;
			height: 160px;
			-webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
			-webkit-border-radius: 8px;
			-moz-border-radius: 8px;
			-webkit-transform: translateZ(0);
}
	}
</style>

<template>
	<div v-if="replyContents.length > 0" class="cart-layout">
		<div class="cart-table-th">
			<div class="wp">
				<div class="th th-chk">
					
				</div>
				<div class="th th-type"><div class="td-inner">类型</div></div>
				<div class="th th-item"><div class="td-inner">内容</div></div>
			</div>
		</div>
		<div>
			<ul class="item-content clearfix" v-for="replyContent in replyContents" :key="replyContent.id">
				<li class="td td-chk">
					
				</li>
				<li class="td td-type">
					<div class="td-inner">
						<p v-if="replyContent.type==='text'">文本</p>
						<p v-if="replyContent.type==='image'">图片</p>
						<p v-if="replyContent.type==='video'">视频</p>
					</div>
				</li>
				<li class="td td-item">
					<div class="td-inner">
						<div class="item-pic" v-if="replyContent.type==='image'">
							<img :src="replyContent.content" alt="图片回复">
						</div>
						<div class="video-list-item" v-if="replyContent.type==='video'">
							<video loop="loop" width="100%" height="100%" @mouseenter="e => e.target.play()" @mouseleave="e => e.target.pause()">
								<source :src="replyContent.content" type="video/mp4" />
								浏览器不支持 HTML5 视频.
							</video>
						</div>
						<div v-if="replyContent.type==='text'">
							<p>{{replyContent.content}}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			replyContents: this.value
		}
	},
	watch: {
		value: {
			handler(val) {
				this.replyContents = val
			},
			deep: true
		},
		replyContents: {
			handler(val) {
				this.$emit('input', this.replyContents)
			},
			deep: true
		}
	},
	computed: {
	},
	methods: {
	}
}
</script>

