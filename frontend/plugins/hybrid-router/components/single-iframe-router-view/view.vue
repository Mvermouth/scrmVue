<template>
    <iframe :src="src" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"
        scrolling-x="no" scrolling-y="auto" allowtransparency="yes" target="iframe"></iframe>
</template>
<script>
export default {
    name: 'IframeView',
    props: {
        src: {
            type: String,
            required: true
        }
    }
}
</script>