<style lang="less" scoped>
    .areasearch-layout {
        width: 100%;
        .left-input {
            float: left;
            width: 46%;
        }
        .link-line {
            display: inline-block;
            width: 8%;
            text-align: center;
            font-size: 20px;
        }
        .right-input {
            float: right;
            width: 46%;
        }
    }
</style>

<template>
    <div class="areasearch-layout">
        <input-number v-model="ranges[0]" class="left-input"></input-number>
        <span class="link-line">-</span>
        <input-number v-model="ranges[1]" class="right-input"></input-number>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Array,
            required: false,
            default: () => {
                return [0, 0]
            }
        }
    },
    data() {
        return {
            ranges: this.value
        }
    },
    watch: {
        ranges(val) {
            this.$emit('input', val)

        },
        value() {
            this.ranges = this.value
        }
    }
}
</script>
