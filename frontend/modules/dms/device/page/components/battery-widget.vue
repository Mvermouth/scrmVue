<style lang="less" scoped>
    .battery {
        width: 26px;
        height: 14px;
        padding: 1px 3px 1px 1px;
        background: url('../images/battery1.png') no-repeat;
        background-size: cover;
        .capacity {
            width: 100%;
            height: 100%;
            background: #fff;
            .remaining {
                height: 100%;
                max-width: 22px;
                min-width: 1px;
            }
        }
    }
</style>
<template>
    <div class="battery" ref="battery">
        <div class="capacity">
            <div class="remaining" ref="remaining" :style="computedCapacity"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0,
        }
    },
    watch: {
        
    },
    computed: {
        computedCapacity() {
            let backgroundColor, widthRate
            if (0 <= this.value && this.value < 0.2) {
                backgroundColor = 'red';
            } else if (0.2 <= this.value && this.value < 0.6) {
                backgroundColor = '#ffcb00';
            } else {
                backgroundColor = 'green';
            }

            widthRate = 26 * this.value
            return {
                backgroundColor,
                width: `${widthRate}px`
            }
        }
    }
}
</script>