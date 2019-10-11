<template>
    <Select v-model="model" filterable clearable remote :remote-method="load" :loading="loading" :multiple="multiple">
        <Option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</Option>
    </Select>
</template>

<script>
export default {
    props: {

        value: {
            type: [Array, String, Number],
            required: true
        },

        loadOptions: {
            type: Function,
            required: true
        },

        multiple:{
            type: Boolean,
            default: false
        },

        label: {
            type: [Array, String],
            required: false,
        },

        defaultOptions:{
            type: Array,
            required: false,
        }
    },

    data() {
        return {
            model: this.value,
            options: [],
            loading: false
        }
    },

    watch: {

        model(val) {
            this.$emit('input', this.model)
        },

        value() {
            this.model = this.value
        },
    },

    mounted(){
        if(this.defaultOptions && this.defaultOptions.length > 0) {
            this.options = this.options.concat(this.defaultOptions)
        }
    },

    methods: {
        
        async load(value) {
            try {
                const needLoad = Array.isArray(value) ? value.length > 0 : !!value
                if(needLoad) {
                    this.loading = true
                    this.options = await this.loadOptions(value)
                    this.loading = false
                } else {
                    this.options = [],
                    this.value = ''
                }
            } catch (e) {
                console.error(e)
                this.options = []
                this.value = ''
            }
        }
    }
}
</script>

