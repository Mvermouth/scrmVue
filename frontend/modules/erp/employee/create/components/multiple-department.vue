<template>
    <div :class="clsPrefix">
        <div v-for="(item, index) in model" :key="index" class="box">
            <Cascader class="cascader" v-model="model[index]" :data="data" filterable change-on-select></Cascader>
            <i-button class="delete" v-show="model.length>1" type="error" icon="trash-a" @click="dele(index)"></i-button>
            <i-button class="add" v-show="model.length-1 === index" type="info" icon="plus" @click="add"></i-button>
        </div>
    </div>
    
</template>
<script>
export default {
    props: {
       value: {
           type: Array,
           defalut: () => {
               return [[]]
           }
       },
        loadData: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            clsPrefix: `${App.options.styles.prefix}multiple-department`,
            model: this.value,
            data: [] 
        }
    },
    watch: {
        model: {
            handler(val) {
                console.log('model:', this.model)
                this.$emit('input', this.model)
            },
            deep: true
        },
        value: {
            handler(val) {
                console.log('value:', this.value)
                this.model = this.value
            },
            deep: true
        }
    },
    mounted() {
        
        this.load()
    },
    methods: {

        async load() {
            const result = await this.loadData()
            this.data = result
        },
        //增加部门级联选择
        add() {
            this.model.push([])
        },
        //删除部门级联选择
        dele(index) {
            this.model.splice(index, 1)
        }
    }
}
</script>


