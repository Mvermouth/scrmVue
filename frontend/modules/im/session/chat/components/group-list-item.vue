<template>
    <div class="chat_item slide-left">
        <im-avatar class="avatar" :url="item.group.avatar || defaultAvatar" :size="40"  alt=""></im-avatar>
        <div class="info">
            <div class="ellipsis nickname">
                <span class="nickname_text">{{item.group.name || '未命名'}}</span>
            </div>
             <div class="msg-count">
                <!-- 今日消息数：0 -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {

    },
    data() {
        return {
            defaultAvatar: require('../../../../../images/unknown-avatar.jpg')
        }
    }
}
</script>

