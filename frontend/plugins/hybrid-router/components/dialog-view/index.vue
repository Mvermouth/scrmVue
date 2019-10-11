<template>
    <div :class="`${clsPrefix}-wrap`">
        <!-- 正常对话框 -->
        <draggable-dialog ref="dialogs" v-for="dialog in $dialogs" :key="dialog.id" :dialog="dialog"
            :constraint="constraint" :layout="layout" :active-id="activeDialogId"
            @on-minimized="minimized => onMinimized(dialog, minimized)"
            @click.native="onClickDialog(dialog.id)" @on-active="onActive(dialog.id)"
            :cls-prefix="clsPrefix"></draggable-dialog>

        <!-- 对话框最小化 -->
        <draggable-dialog-minimized v-for="it in minimizedDialogs"
            :width="minimizedWidth" :height="minimizedHeight" :constraint="constraint" :active-id="activeDialogId"
            :key="`minimized-${it.dialog.id}`" :dialog="it.dialog" :position="it.position" :cls-prefix="clsPrefix"
            @click.native="onClickDialog(it.dialog.id)" @on-active="onActive(it.dialog.id)"
            @on-restore="onRestore(it.dialog.id)"></draggable-dialog-minimized>
    </div>
</template>
<script>
import resize from 'vue-resize-directive'
import DraggableDialog from './draggable-dialog.vue'
import DraggableDialogMinimized from './draggable-dialog-minimized.vue'

export default {

    components: {
        DraggableDialog,
        DraggableDialogMinimized
    },
    
    directives: {
        resize
    },

    props: {

        /**
         * 拖拽范围
         * 
         * 对话框通过 position:absolute 定位
         */
        constraint: {
            type: Object,
            required: false,
            default() {
                return {
                    width: 0,
                    height: 0
                }
            }
        },

        // 最小化宽度
        minimizedWidth: {
            type: Number,
            required: true,
            default: 180
        },

        // 最小化高度
        minimizedHeight: {
            type: Number,
            required: true,
            default: 50
        },

        // 布局样式配置
        layout: {
            type: Object,
            required: false
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: false,
            default: 'dialog'
        }
    },

    data() {
        return {
            // 当前活动的对话框id
            activeDialogId: 0,

            // 最小化的对话框
            minimizedDialogs: []
        }
    },

    watch: {

        '$dialogs': function() {
            const dialogMap = _.keyBy(this.$dialogs, 'id')
            this.minimizedDialogs = this.minimizedDialogs.filter(it => {
                if (!dialogMap[it.dialog.id]) {
                    returnMinimizedPosition(it.position)
                    return false
                }
                return true
            })
        }
    },

    methods: {

        onMinimized(dialog, minimized) {
            const idx = this.minimizedDialogs.findIndex(it => it.dialog.id === dialog.id)
            if (minimized) {
                if (idx < 0) {
                    const position = assignMinimizedPosition()
                    this.minimizedDialogs.push({ dialog, position })
                }
            } else {
                if (idx >= 0) {
                    const { dialog, position } = this.minimizedDialogs.splice(idx, 1)[0]
                    returnMinimizedPosition(position)
                }
            }
        },

        onRestore(id) {
            const idx = this.$dialogs.findIndex(it => it.id === id)
            if (idx >= 0) {
                this.$refs.dialogs[idx].restore()
            }
        },

        onClickDialog(id) {
            this.activeDialogId = id
        },

        onActive(id) {
            this.activeDialogId = id
        }
    }
    
}

// 分配最小化位置
const reusePositions = []
let assignedPosition = 0
const assignMinimizedPosition = function() {
    if (reusePositions.length > 0) {
        const pos = reusePositions.sort().shift()
        return pos
    }
    return assignedPosition++
}

const returnMinimizedPosition = function(pos) {
    reusePositions.push(pos)
}

</script>

