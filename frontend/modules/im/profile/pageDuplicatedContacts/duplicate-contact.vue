<template>
	<div>
		<!-- <p slot="title">该好友在如下运营号里重复</p>		 -->
		<domain-page v-bind="domainPageProps"></domain-page>
	</div>	
</template>
<script>
import relation from '../../../../models/im/relation';
import columns from './table/profileColumns'
import Contact from '../../../../models/im/contact';
import DomainPage from '../../../../views/domain/page.vue'
const width = App.options.styles.table.width
 
export default {
	components: {
		DomainPage
	},
	props: {
	 	contact: {
			 type: Object,
			 required: true
		 },
		 profilePlatformUid:{
			 type: String,
			 required: false
		 }
	},
	data() {
		return {
			domainPageProps:{
				loadPage:async (pageNo,pageSize,filter,sort)=>{
					return await relation.pageDuplicatedProfiles(this.contact.platformUid,pageNo,pageSize,1)
				},
				domain: Contact,
				action:['view'],
				defaultPageSize:10,
				columns: columns
			}
		}
	},
	async mounted() {
		this.init()
	},
	computed:{
	},
	methods: {
		async init() {
		},
	}
}
</script>

