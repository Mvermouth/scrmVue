<template>
    <div class='wexin-info padding10-0'>
        <div class="info-left w230">
            <div>
                <span class='info-name '>昵称：</span>
                <span class='info-value nickname ellipsis c-primary pointer ' @click="()=> {AppProxy.do_push(AppRoutes.Profile.id(profile.id, profile.nickname))}" >
                    <tooltip transfer :content="profile.nickname">{{profile.nickname}}</tooltip>
                </span>
                <span :class="['gender-cion',  `gender-${profile.gender || 0}`]"></span>
            </div>
            <div>
                <span class='info-name'>微信ID：</span>
                <span class='ellipsis info-value'>
                    <tooltip transfer :content="profile.platformUid">{{profile.platformUid}}</tooltip>
                </span>
            </div>
            <div>
                <span class='info-name'>微信号：</span>
                <span class='info-value'>{{profile.customID}}</span>
            </div>
        </div>
        <div class="info-right w180">
            <div>
                <span class='info-name'>运营状态：</span>
                <span :class='["info-value", `status-${profile.online}`]'>{{visualization(profile.online)}}</span>
            </div>
            <div>
                <span class='info-name'>微信版本：</span>
                <span class='info-value'>{{profile.appVersion}}</span>
            </div>
            <div>
                <span class='info-name'>绑定手机号：</span>
                <span class='info-value'>{{profile.mobilephone}}</span>
            </div>
        </div>
        
    </div>
</template>
<script>
import AppProxy from '../../scripts/common/appProxy'
import AppRoutes from '../../configs/AppRoutes'
import Constant from '../../configs/constant'
import { stringLength, value2Text } from '../../scripts/utils/misc'
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
			AppRoutes: AppRoutes,
			stringLength: stringLength
		}
    },
    methods: {
        //可视化话在线状态
        visualization(status) {
           return value2Text(Constant.UserOnlineStatus, status) 
        }
    }
}
</script>

