<template>
        <div v-if="message.messageType === MessageType.Text.value" :class="['items', 'text', {'signed': message.revoke || message.deleteStatus == 1}]" v-html="vHtml(message.textContent)">
            
        </div>

        <div v-else-if="message.messageType === MessageType.Image.value" class="items img pointer">
            <img :src="message.objectContent.url" alt="图片加载失败">
			
		</div>

        <wechat-audio class="audio text" v-else-if="message.messageType===MessageType.Audio.value" :message="message"></wechat-audio>

        <div v-else-if="message.messageType===MessageType.Card.value" class="items card text">
			<div>
				<div class="transfer-icon">
					<im-avatar :url="message.objectContent.avatar || defaultAvatar" :size="30"  alt=""></im-avatar>
				</div>
				<div class="transfer-text">
					<div class="remarks ellipsis">{{message.objectContent.nickname}}</div>
					<div class="amount ellipsis">{{message.objectContent.platformUid}}</div>
				</div>
			</div>
            <div class="money-footer" style="border-top: 1px solid rgba(0,0,0,0.1)">个人名片</div>
        </div>

        <div v-else-if="message.messageType === MessageType.Position.value" :class="['items', 'text', 'location',  {'signed': message.revoke || message.deleteStatus == 1}]">
            <icon class="text-icon" color="#ed3f14" type="location" :size="20"></icon><span>{{message.objectContent.placeName}}</span>
			<div id="map_container" class="map-container"></div>
        </div>
        <div v-else-if="message.messageType === MessageType.Animation.value" class="items animation">
			<img  v-if="/^http/.test(message.objectContent.url)" :src="message.objectContent.url" alt="">
			<span v-else>[动画表情]</span>
        </div>
        <div v-else-if="message.messageType === MessageType.App.value" class="items text">
            <span>[你收到了一个小程序，请在手机上查看]</span>
        </div>
        <div v-else-if="message.messageType === MessageType.Video.value" class="items">
            <video class="video" controls :src="message.objectContent.url" @click="palyVideo($event)">your browser does not support the video tag</video>
        </div>
        <div v-else-if="message.messageType === MessageType.AudioCall.value" class="items text">
            <icon class="text-icon" color="#898888" type="ios-telephone" :size="20" style="transform: rotate(-225deg);"></icon><span class="icon-text">{{message.objectContent.desc}}</span>
        </div>

        <div v-else-if="message.messageType === MessageType.VideoCall.value" class="items text">
            <icon class="text-icon" color="#898888" type="ios-videocam" :size="20"></icon>
			<span class="icon-text">{{message.objectContent.desc}}</span>
        </div>
		
        <div v-else-if="message.messageType === MessageType.Transfer.value" class="items transfer-account text">
            <div>
				<div class="transfer-icon">
					<icon class="money-icon" color="#fff" type="arrow-swap" :size="20"></icon>
				</div>
				<div class="transfer-text">
					<div class="remarks ellipsis">{{message.objectContent.payMemo}}</div>
					<div class="amount ellipsis">{{message.objectContent.amount}}</div>
				</div>
			</div>
            <div class="money-footer">微信转账</div>
        </div>

        <div v-else-if="message.messageType === MessageType.HongBao.value" class="items transfer-account text">
			<div>
				<div class="transfer-icon">
					<icon class="money-icon" color="#CD3E3B" type="pricetag" :size="20" style="transform: rotate(45deg);"></icon>
				</div>
				<div class="transfer-text">
					<div class="remarks ellipsis">{{message.objectContent.sendertitle}}</div>
					<div class="amount ellipsis">查看红包</div>
				</div>
			</div>
            <div class="money-footer">微信红包</div>
        </div>
		<div v-else-if="message.messageType === MessageType.Link.value" class="items text link">
			<div class="ellipsis subtitle">{{message.objectContent.title}}</div>
			<div class="des">
				<div class="desText">{{message.objectContent.des}}</div>
				<div class="ellipsis thumburl"><img :src="message.objectContent.thumburl || defaultLogo" alt="链接"></div>
			</div>
            <!-- <a :href="message.objectContent).url">{{message.objectContent).title}}</a> -->
        </div>
        <div v-else class="items">
            [暂未识别]
        </div>
</template>
<script>
import WechatAudio from './wechat-audio.vue'
import { parseXml, getXmlValue } from '../../../../../scripts/utils/xml'
import Constant from '../../../../../configs/constant'
import { hightlightSensitiveWord, highlightKeywords, toEmotion } from '../../../../../scripts/utils/misc'
const site = App.data.site

//处理文本信息，动画表情处理，高亮显示文本
const handleText = (text, sensitives, constant, query)=>{
	let hightlightText 
	hightlightText =  highlightKeywords(text, query)
	hightlightText =  hightlightSensitiveWord(hightlightText, sensitives, constant)
	hightlightText =  toEmotion(hightlightText)
	return hightlightText
}
export default {
	components: {
		WechatAudio
	},
	props: {
		message: {
			type: Object,
			required: false,
			default: []
		},
		sensitives: {
			type: Array,
			required: false,
			default: []
		},
		query: {
			type: String,
			required: false
		}
	},
	data() {
		return {
			MessageType: Constant.MessageType,
			defaultAvatar: require('../../../../../images/unknown-avatar.jpg'),
			defaultLogo: site.logo_small 
		}
	},
	mounted() {
		if(this.message.messageType === Constant.MessageType.Position.value) {
			this.initMap(this.message.objectContent.longitude, this.message.objectContent.latitude)
		}
	},
	methods: {
		palyVideo(event) {
			event.target.play()
		},
		vHtml(text) {
			return handleText(text, this.sensitives, Constant.SensitiveLevel, this.query)
		},
		zoomImage(url) {
			App.viewImages([url])
		},
		//初始化地图逻辑
		initMap(longitude, latitude) {
			const map = new BMap.Map('map_container')               //创建地图实例
			const point = new BMap.Point(longitude, latitude)       //创建点坐标
			map.centerAndZoom(point, 16)							//初始化地图， 设置中心点坐标和地图级别
			//坐标转换完之后的回调函数
			const translateCallback = (data)=>{
				if(data.status === 0) {
					const marker = new BMap.Marker(data.points[0]);
					map.addOverlay(marker);
					map.setCenter(data.points[0]);
				}
			}
			setTimeout(()=>{
				var convertor = new BMap.Convertor();
				var pointArr = [];
				pointArr.push(point);
				convertor.translate(pointArr, 3, 5, translateCallback)
			}, 500)
		}
	}
}
</script>

