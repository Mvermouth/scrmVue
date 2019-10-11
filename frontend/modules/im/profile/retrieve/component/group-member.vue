<template>
    <div>
        <domain-page v-bind="pageProps" :table-props="tableProps" size="small"></domain-page>
    </div>
</template>
<script>
import GroupMember from '../../../../../models/im/groupMember'
import { tableColumnsByDomain } from '../../../../../scripts/utils/table-utils'
import DomainPage from '../../../../../views/domain/page.vue'
const columnsOptions = {
    'avatar': {
		width: 100,
		title: '成员头像',
		align: 'center',
		render(h, context) {
			const url = _.result(context.row.contact, 'avatar')
			return <im-avatar url={ url } size={30}></im-avatar>
		}
    },
    'nickname': {
		width: 300,
		title: '成员昵称(备注)',
		align: 'left',
		render(h, context) {
            const alias = _.result(context.row, 'alias')
            const nickname = _.result(context.row.contact, 'nickname')
			return <span>{nickname}{alias ? `(${alias})` : ''}</span>
		}
    },
    'isFriend': {
		width: 100,
		title: '是否好友',
		align: 'center',
		render(h, context) {
			return <span>否</span>
		}
    }
}
export default {
    components: {
        DomainPage
    },
    props: {
        gid: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            pageProps: {
                domain: GroupMember,
                columns: tableColumnsByDomain(tableColumnsByDomain, columnsOptions),
                defaultCriterias: [
					{
						filterType: 'EQ',
						property: 'gid',
						value: this.gid
					}
				]
            }
        }
    },
    computed: {
        tableProps() {
			return {
				height: 500
			}
		}
    }
}
</script>

