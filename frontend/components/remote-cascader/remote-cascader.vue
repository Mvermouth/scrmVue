<template>
    <Cascader v-model="model" :data="data" filterable change-on-select></Cascader>
</template>
<script>
export default {
    props: {
        value: {
            type: [ Array ],
            required: true
        },
        loadData: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            model: this.value,
            data: []
        }
    },
    watch: {
        model() {
            this.$emit('input', this.model)
        },

        value() {
            this.model = this.value
        }
    },
    mounted() {
        this.load()
    },
    methods: {
        async load() {
            const result = await this.loadData()
            this.data = result
        }
    }
}
</script>
