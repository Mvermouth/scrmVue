<template>
    <card>
        <tabs type="card" :value="type">
            <tab-pane label="被关注自动回复" name="newFriendReply">
				<card>
					<domain-create :formItems="attentionItems"></domain-create>
				</card>
            </tab-pane>
            <tab-pane label="消息自动回复" name="messageReply">
				<card>
					<domain-page v-bind="replyProps"></domain-page>
				</card>
            </tab-pane>
            <tab-pane label="关键词自动回复" name="keywordReply">
				<card>
					<domain-page v-bind="replyProps"></domain-page>
				</card>
            </tab-pane>
        </tabs>
    </card>
</template>
<script>
import formItems from './table/form-items'
import attentionItems from './form/form-items'
import DomainCreate from '../../../../views/domain/create.vue'
import DomainPage from '../../../../views/domain/page.vue'
import Reply from '../../../../models/marketing/reply'
import ReplyColumns from './table/columns'
import ServerReply from './components/server-reply.vue'
export default {
	components: {
		DomainCreate,
		DomainPage,
		ServerReply
	},
	data() {
		return {
			type: 'newFriendReply',
			attentionItems: attentionItems,
			replyProps: {
				domain: Reply,
				columns: ReplyColumns,
				formItems,
				formProps: {
					labelWidth: 120
				},
				actions: [{
					'create': {
						title: '新建',
						unauthorize: true,
						onAction: ($list, rows) => {
							App.modal({
								title: '服务消息自动回复',
								width: 'large',
								render: h => {
									h = this.$createElement
									return <server-reply></server-reply>
								},
								onOk: (increaseDevice) => {
									increaseDevice.submit()
								}
							})
						}

					}}]
			}
		}
	},
	methods: {

	}
}
</script>

