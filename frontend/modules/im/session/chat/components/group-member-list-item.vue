<template>
    <div class="contact-list-item" style="height: 50px">
        <im-avatar :url="item.avatar || defaultAvatar" :size="30"  alt=""></im-avatar>
        <div class="contact-info">
            <div class="ellipsis nickname groupNickname">
                <span>{{ item.nickname || ''}}</span>
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
            defaultAvatar: require('../../../../../images/unknown-avatar.jpg')
        }
    }
}
</script>

