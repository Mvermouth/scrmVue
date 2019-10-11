<template>
    <i :class="name" v-html="icon"></i>
</template>
<script>
export default {

    props: {

        name: {
            type: String,
            required: false,
            default: ''
        },

        value: {
            type: String,
            required: false,
            default: ''
        }
    },    
    computed: {

        icon() {
            return this.value ? `&#x${this.value};` : ''
        }
    }
}
</script>


