<template>
    <card>
        <tabs type="card" :value="type">
            <tab-pane label="新好友自动回复" name="newFriendReply">
				<card>
                	<domain-page v-bind="replyProps"></domain-page>
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
import DomainPage from '../../../../views/domain/page.vue'
import Reply from '../../../../models/marketing/reply'
import ReplyColumns from './table/columns'
import MessageTemplate from './components/message-template.vue'
export default {
	components: {
		DomainPage,
		MessageTemplate
	},
	data() {
		return {
			type: 'newFriendReply',
			replyProps: {
				domain: Reply,
				columns: ReplyColumns,
				formItems,
				actions: [{ 'create': {
					title: '新建',
					unauthorize: true,
					onAction: ($list, rows) => {
						App.modal({
							title: '新建新好友自动回复',
							width: 'large',
							render: h => {
								h = this.$createElement
								return <message-template></message-template>
							},
							onOk: increaseDevice => {
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

