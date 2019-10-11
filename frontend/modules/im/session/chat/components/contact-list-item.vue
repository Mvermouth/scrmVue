<template>
    <div class="chat_item slide-left">
        <im-avatar class="avatar" :url="item.contact.avatar" :size="40" alt=""></im-avatar>
        <div class="info">
            <h3 class="ellipsis nickname">
                <span class="nickname_text">{{item.alias || item.contact.nickname}}</span>
            </h3>
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
    data() {
        return {
        }
    }
}
</script>

