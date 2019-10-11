<template>
    <vue-draggable-resizable ref="draggable" :class="`${clsPrefix}-minimized`" :parent="true" :z="dialog.id === activeId ? 3 : 2"
        :w="width" :h="height" :x="bornPosition.x" :y="bornPosition.y" :constraint="constraint" @on-active="onActive"
        :minh="0" :minw="0" :resizable="false" :drag-handle="`.${clsPrefix}-head`">
        <div :class="`${clsPrefix}-body`">
            <div :class="`${clsPrefix}-head`">
                <h1>{{title}}</h1>
                <div class="dialog-op">
                    <i class="far fa-window-close" @click="onClose"></i>
                    <i class="far fa-window-restore" @click="onRestore"></i>
                </div>
            </div>
        </div>
    </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from './vue-draggable-resizable.vue'

export default {

    components: {
        VueDraggableResizable 
    },
    
    props: {

        // 宽度
        width: {
            type: Number,
            required: true
        },

        // 高度
        height: {
            type: Number,
            required: true
        },

        // 对话框数据
        dialog: {
            type: Object,
            required: true
        },

        // 拖拽范围
        constraint: {
            type: Object,
            required: true
        },
        
        // 排序位置
        position: {
            type: Number,
            required: true
        },

        // 当前激活的对话框id
        activeId: {
            type: Number,
            required: true,
            default: 0
        },

        // 对话框之间空隙
        gutter: {
            type: Number,
            required: false,
            default: 5
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: false,
            default: 'dialog'
        }
    },

    computed: {

        bornPosition() {
            const countInRow = Math.floor(this.constraint.width / (this.width + this.gutter))
            const row = Math.floor(this.position / countInRow)
            const col = this.position % countInRow
            const y = this.constraint.height - ((this.gutter + this.height) * (row + 1))
            const x = (this.width + this.gutter) * col + this.gutter
            return { x, y }
        },

        // 窗口标题
        title() {
            const title = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.title
            if (!title) return ''
            if (typeof title === 'string') return title
            if (typeof title === 'function') return title(this.dialog.route)
            return ''
        }
    },

    watch: {

        constraint(newVal, oldVal) {
            const ref = this.$refs.draggable
            const x = ref.left
            const y = ref.top
            const diffH = newVal.height - oldVal.height
            const newY = Math.max(0, y + diffH)
            ref.updatePosition(x, newY)
        }

    },

    methods: {

        onClose() {
            this.$router.close(this.dialog.id)
        },

        onRestore() {
            this.$emit('on-restore')
        },

        onActive() {
            this.$emit('on-active')
        }
    }
}
</script>
