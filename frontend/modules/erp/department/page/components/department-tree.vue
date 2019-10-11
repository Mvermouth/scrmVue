<style>

</style>

<template>
    <Card :padding="16">
        <p slot="title">
            部门列表
        </p>
        <a href="#" slot="extra" @click.prevent="expand">
            {{isExpand?'收起':'展开'}}
        </a>
        <Tree :class="{[clsPrefix+'tree']: true , [clsPrefix+'tree-multiple']: multiple}" :data="datas" @on-select-change="onSelectChange" @on-check-change="onCheckChange" :multiple="multiple" :show-checkbox="showCheckbox"  empty-text="暂无部门"></Tree>
    </Card>
</template>
<script>
import Department from '../../../../../models/erp/department'
export default {
    props: {
        value: {
            type: [Object, Array],
            required: true
        },
        //控制Tree单选还是多选
        multiple: {
            type: Boolean,
            defalut: false
        },

        showCheckbox: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 样式前缀
            clsPrefix: `${App.options.styles.prefix}`,
            model: this.value,
            datas: [],
            isExpand: true
        }
    },
    mounted() {
        this.initData()
    },
    watch: {
        isExpand(val) {
            this.epandTree(this.datas, val)
        },

        model(val) {
            this.$emit('input', this.model)
        },

        value(val) {
            this.model = val
        }
    },
    methods: {
        async initData(){
            const result  = await Department.expand()
            this.tranformData(result)
            this.datas = result
        },

        //给数据增加节点
        tranformData(data) {
            data.forEach( it => {
                it.title = it.name
                it.expand = true
                it.selected = false
                it.checked = false
                if(it.children && it.children.length > 0) {
                    this.tranformData(it.children)
                }
            })
        },

        //全部展开和收起数据
        epandTree(data, isExpand) {
            data.forEach( it => {
                it.expand = isExpand
                if(it.children && it.children.length > 0) {
                    this.epandTree(it.children, isExpand)
                }
            })
        },

        //多选隐藏单选节点的操作
        selectedTree(data, isSelected) {
            data.forEach( it => {
                it.selected = isSelected
                if(it.children && it.children.length > 0) {
                    this.selectedTree(it.children, isSelected)
                }
            })
        },

        //点击单个节点触发
        onSelectChange(data) {
            if (this.multiple) {
                this.selectedTree(this.datas, false)
                return
            }
            if (data.length > 0) {
                this.model = {
                    id: data[0].id,
                    name: data[0].name
                }
            } else {
                this.model = []
            }
            
        },

        //点击复选框的时候触发
        onCheckChange(data) {
            if (!this.multiple) {
                return
            }
            this.model = []
            _.forEach(data, it => {
                const params = {
                    id: it.id,
                    name: it.name
                }
                this.model.push(params)
            })
        },

        expand() {
            this.isExpand = !this.isExpand
        }


    }
}
</script>

