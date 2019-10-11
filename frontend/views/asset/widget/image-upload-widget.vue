<template>
    <div style='height: 120px;' class="tc"><i-progress :percent="asset.progress" hide-info></i-progress></div>
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