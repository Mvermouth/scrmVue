<template>
    <div :class="[ `avatar-${size}` ]">
        <img :src="url || defaultAvatar" @error="imgError($event)" alt="头像"/>
    </div>
</template>
<script>
import defaultAvatar from '../../images/unknown-avatar.jpg'
export default {
    props: {
        size: {
            type: Number,
            required: false,
            default: 48
        },

        url: {
            type: String,
            required: false
        },

        defaultAvatar: {
            type: String,
            required: false,
            default: () => {
                return defaultAvatar
            }
        }
    },
    methods: {
        imgError(e) {
            e.currentTarget.src = defaultAvatar
        }
    }

}
</script>

