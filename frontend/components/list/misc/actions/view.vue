<template>
    <div class="actions">
        <template v-for="(action, idx) in actionsFixed">
            <render-content v-if="action.render" :key="`action-fixed-render-${idx}`" :render="action.render"></render-content>
            <i-button v-else :key="`action-fixed-button-${idx}`" class="action-item" v-bind="actionProps(action)"
                @click="onAction(action)">
                <i v-if="action.icon" :class="action.icon"></i>&nbsp;{{action.title || ''}}
            </i-button>
        </template>
        
        <Dropdown v-if="actionsFolded.length > 0" class="action-item">
            <i-button icon="ios-more" :size="size">更多操作</i-button>
            <DropdownMenu slot="list">
                <template v-for="(action, idx) in actionsFolded">
                    <DropdownItem v-if="action.render" :key="'action-folded-render' + idx">
                        <render-content v-if="action.render" :key="`action-fixed-render-${idx}`" :render="action.render"></render-content>
                    </DropdownItem>
                    <DropdownItem v-else :key="`action-folded-button-${idx}`">
                        <i-button @click="onAction(action)" v-bind="actionProps(action)">
                            <i v-if="action.icon" :class="action.icon"></i>&nbsp;{{action.title || ''}}
                        </i-button>
                    </DropdownItem>
                </template>
            </DropdownMenu>
        </Dropdown>

        <slot></slot>

        <!-- Grid模式下，多选的全选操作 -->
        <!--checkbox v-if="currentDisplay === 'grid' && selectionType === 'checkbox'"
            class="action-item ml1f" :size="size" @on-change="onGridSelectAll">全部选择</checkbox-->
    </div> 
</template>
<script>
/**
 * 表格操作面板
 */
export default {

    props: {

        // 列表数据源
        listDataSource: {
            type: Object,
            required: true
        },

        // 列表事件处理
        listDelegator: {
            type: Object,
            required: true
        },

        /**
         * 列表操作配置
         * 
         * 配置格式
         *  {
         *      // 按钮文本
         *      title: '操作名',
         * 
         *      // 按钮图标，title/icon必须有其一
         *      icon: '图标',
         * 
         *      // 按钮颜色type
         *      type: 'error',
         * 
         *      // 是否需要选择数据才能操作
         *      selection: true,
         * 
         *      // 操作处理逻辑，rows 只有在 selection = true 时传递，进行多选操作
         *      onAction: ($list, rows) => {},
         * 
         *      // 自定义渲染，将忽略 title/icon/type 参数
         *      render: h => {}
         *  }
         */
        actions: {
            type: Array,
            required: false,
            default() {
                return []
            }
        },

        // 固定展开的操作数量，超过的操作会收起在“更多操作”中
        fixedActionCount: {
            type: Number,
            required: false,
            default: 4
        },

        // 尺寸规格 large|small|default
        size: {
            type: String,
            required: false,
            default: ''
        }
    },

    mounted() {
        this.enableMultiSelection()
    },

    computed: {

        // 当前选中数据
        selections() {
            return this.listDataSource.selections
        },

        // 固定展示表格操作
        actionsFixed() {
            return this.actions.slice(0, this.fixedActionCount)
        },

        // 折叠进“更多操作”的表格操作
        actionsFolded() {
            return this.actions.slice(this.fixedActionCount)
        }

    },

    watch: {

        actions() {
            this.enableMultiSelection()
        }

    },

    methods: {

        // 表格操作按钮的绑定属性
        actionProps(action) {
            const props = {
                size: this.size
            }
            if (action.selection) props.disabled = this.selections.length === 0
            if (action.type) props.type = action.type
            return props
        },

        // 执行表格操作
        onAction(action) {
            if (!action.onAction) return

            const target = this.listDataSource.target
            if (action.selection) {
                action.onAction.call(target, target, this.selections)
            } else {
                action.onAction.call(target, target)
            }
        },

        enableMultiSelection() {
            this.listDelegator.setOption && this.listDelegator.setOption('multiSelection', this.actions.some(it => it.selection))
        }
    }
    
}
</script>

