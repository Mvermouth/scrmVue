<template>
    <div style='height: 120px;' class="tc">{{asset.error}}</div>
</template>
<script>
export default {
    
    props: {

        // 资源信息
        asset: {
            type: Object,
            required: true
        }
    }
}
</script>