<template>
    <div class="tl">
        <div class="info-left w140">
            <div>
                <span class='info-name'>好友总数：</span>
                <span class='num'>{{contactStatistics.contactCount || 0}}</span>
            </div>
            <div>
                <span class='info-name'>男：</span>
                <span class='num'>{{male}}</span>
            </div>
            <div>
                <span class='info-name'>女：</span>
                <span class='num'>{{female}}</span>
            </div>
            
        </div> 
        <div class="info-right w140">
            <div>
                <span class='info-name'>已删除好友：</span>
                <span class='num'>{{0}}</span>
            </div>
            <div>
                <span class='info-name' >重复好友：</span>
                <span class='num c-primary pointer' @click="()=> {AppProxy.do_push(AppRouter.Profile.pageDuplicatedContacts(contactStatistics.platformUid, contactStatistics.nickname))}" >{{contactStatistics.dupCount}}</span>
            </div>
            <div>
                <span class='info-name'>成交好友数：</span>
                <span class='num'>{{0}}</span>
            </div> 
        </div>
    </div>
</template>
<script>
import AppProxy from '../../scripts/common/appProxy'
import AppRouter from '../../configs/AppRoutes'
export default {
	props: {
		contactStatistics: {
			type: Object,
			required: true
		}
	},
	data() {
		const male = parseInt((this.contactStatistics.contactCount || 0) * 0.6)
		const female = parseInt((this.contactStatistics.contactCount || 0) * 0.3)
		const unknown = this.contactStatistics.contactCount - male - female
		return {
			AppProxy: AppProxy,
			AppRouter: AppRouter,
			male: male,
			female: female,
			unknown: unknown
		}
	}
}
</script>

