<template>
    <div class="wexin-info padding10-0">
        <div>
            <span class='info-name'>微信昵称：</span>
            <span class='info-value c-primary pointer' @click="()=> {AppProxy.do_push(AppRouters.Contact.id(profile.contactID, profile.nickname))}">
                <tooltip transfer :content="profile.nickname">{{profile.nickname}}</tooltip>
            </span>
            <span :class="['gender-cion',  `gender-${profile.gender || 0}`]"></span>
        </div>
        <div>
            <span class='info-name'>微信ID：</span>
            <span class='ellipsis info-value'>
                <tooltip transfer :content="profile.platformUid ">{{profile.platformUid }}</tooltip>
            </span>
        </div>
        <div>
            <span class='info-name'>微信号：</span>
            <span class='ellipsis info-value'>{{ profile.customID}}</span>
        </div>
    </div>
</template>
<script>
import AppProxy from '../../scripts/common/appProxy'
import AppRouters from '../../configs/AppRoutes'
export default {
	props: {
		profile: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			AppProxy: AppProxy,
			AppRouters: AppRouters
		}
	}
}
</script>

