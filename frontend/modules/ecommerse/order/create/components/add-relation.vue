<style lang="less" scoped>
.bottom-btns {
	display: flex;
	justify-content: flex-end;

	button {
		margin-left: 10px;
	}
}
</style>

<template>
	<div>
		<Form :model="infos" label-position="right" :label-width="100">
			<FormItem label="昵称">
				<Input v-model="infos.nickname" />
			</FormItem>
			<FormItem label="手机号">
				<Input v-model="infos.mobile" />
			</FormItem>
			<FormItem label="微信号">
				<Input v-model="infos.wx" />
			</FormItem>
		</Form>
		<div class='bottom-btns' >
			<Button type="text" @click="onCancelClick" >取消</Button>
			<Button type="primary" @click="onOkClick">确定</Button>
		</div>
	</div>
</template>
<script>
import Relation from '../../../../../models/im/relation'
import Profile from '../../../../../models/im/profile'
import Constant from '../../../../../configs/constant'
import PageInfo from '../../../../../views/domain/retrieve/info.vue'
import { constantText, tags } from '../../../../../scripts/utils/page-renders'

import AppProxy from '../../../../../scripts/common/appProxy'
import AppRoutes from '../../../../../configs/AppRoutes'

export default {
	name: 'AddRelation',

	components: {
		PageInfo
	},

	props: {
		onOk: null,
		onCancel: null,
		relation: {
			type: Object,
		}
	},

	data(){
		return {
			infos: {},
		}
	},

	computed: {

		content() {
			const contact = this.relation.contact
			const profile = this.relation.profile
			const employee = profile.employee
			const contactId = contact.customerID || contact.platformUid
			const profileId = profile.customerID || profile.platformUid
			return [
				{
					title: contact.nickname,
					content: [
						{ '微信号': h => {
							const name = contactId
							return <a onClick={() => AppProxy.do_push(AppRoutes.Relation._(this.relation.profile.contactID, this.relation.contact.id, contact.nickname))}><div style = 'display: inline-block;overflow: hidden; white-space: nowrap; text-overflow: ellipsis; vertical-align: middle;'>{contactId}</div></a>
						} },
						{ '性别': h => {
							return constantText(h, contact.gender, Constant.Gender)
						} },
						{ '地区': [contact.country, contact.state, contact.city].filter(it => !!it).join('/') },
						// { '标签': h => {
						// 	return tags(h, this.relation.tags, 'blue')
						// } },
						{ '个性签名': { content: contact.signature, long: true }}
					]
				}
			]
		}
	},

	methods: {
		getInfos () {
			return this.infos;
		},

		onOkClick(){
			const onOk = this.onOk;
			if(onOk){
				onOk(this.getInfos());
			}
		},

		onCancelClick(){
			const onCancel = this.onCancel;
			if(onCancel){
				onCancel();
			}
		}
	}
}
</script>

