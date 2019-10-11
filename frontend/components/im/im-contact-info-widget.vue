<template>
    <div class="wexin-info padding10-0">
		<div class="info-left w230">
			<div>
				<span class='info-name'>微信昵称：</span>
				<span class='info-value nickname ellipsis c-primary pointer' @click="handleContactClick(contact)">
					<tooltip transfer :content="contact.nickname">{{contact.nickname}}</tooltip>
				</span>
				<span :class="['gender-cion',  `gender-${contact.gender || 0}`]"></span>
			</div>
			<div>
				<span class='info-name'>微信ID：</span>
				<span class='ellipsis info-value'>
					<tooltip transfer :content="contact.platformUid">{{contact.platformUid}}</tooltip>
				</span>
			</div>
			<div>
				<span class='info-name'>微信号：</span>
				<span class='ellipsis info-value'>{{ contact.customID}}</span>
			</div>
		</div>
        <div class="info-right w160">
			<div>
				<span class='info-name'>备注：</span>
				<span class='ellipsis nickname info-value'>
					<tooltip transfer :content="contact.alias">{{contact.alias}}</tooltip>
				</span>
			</div>
			<div>
				<span class='info-name'>地区：</span>
				<span class='info-value nickname ellipsis'>
					<tooltip transfer :content="`${contact.country || ''}  ${contact.city || ''}`">{{`${contact.country || ''}  ${contact.city || ''}`}}</tooltip>
				</span>
			</div>
			<div>
				<span class='info-name'>主动或被动：</span>
				<span class='ellipsis info-value'>{{sourceType}}</span>
			</div>
		</div>
    </div>
</template>
<script>
import AppProxy from '../../scripts/common/appProxy'
import AppRoutes from '../../configs/AppRoutes'
export default {
	props: {
		contact: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			AppProxy: AppProxy,
			AppRoutes: AppRoutes
		}
	},
	computed: {
		sourceType() {
			if (!this.contact.sourceType) {
				return '未知'
			}
		 	return this.contact.sourceType < 10000 ? '是' : '否'
		}
	},
	methods: {
		handleContactClick(contact) {
			AppProxy.do_push(AppRoutes.Relation._(contact.fromId, contact.toId, contact.nickname))
		}
	}
}
</script>

