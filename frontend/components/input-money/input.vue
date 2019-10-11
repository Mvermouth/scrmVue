<template>
    <i-input :size="size" :value="initText" @on-blur="onBlur" @on-change="onChange"><span slot="prepend">{{prepend}}</span></i-input>
</template>
<script>
export default {

    props: {

        value: {
            type: Number,
            required: true
        },

        max: {
            type: Number,
            required: false,
            default: Number.MAX_SAFE_INTEGER
        },

        size: {
            type: String,
            required: false,
            default: 'default'
        },

        prepend: {
            type: String,
            required: false,
            default: '¥'
        }
    },
    
    data() {

        return {
            initText: this.value,
            model: this.value,
            editingValue: this.value
        }
    },

    watch: {

        value() {
            this.model = this.value
            this.editingValue = this.value
            this.initText = this.value
        },

        model() {
            this.$emit('input', this.model)
        }

    },

    methods: {

        // 结束编辑
        onBlur() {
            this.model = Math.min(this.max, Math.max(0, this.editingValue))
            this.$nextTick(() => {
                this.$emit('on-blur')
            })
        },

        // 编辑中
        onChange(e) {
            this.editingValue = parseInt(parseFloat(e.target.value) * 100) || 0
            this.$nextTick(() => {
                this.$emit('on-change', e)
            })
        }
    }
}
</script>

