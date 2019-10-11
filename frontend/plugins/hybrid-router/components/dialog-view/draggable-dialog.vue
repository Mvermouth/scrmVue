<template>
    <vue-draggable-resizable v-show="!minimized" ref="draggable" :class="`${clsPrefix}`" :active="dialog.id === activeId"
        :parent="true" :resizable="resizable" :constraint="constraint" @on-maximized="onMaximized" @on-active="onActive"
        :w="bornSize.width" :h="bornSize.height" :x="bornPosition.x" :y="bornPosition.y" :z="dialog.id === activeId ? 3 : 1"
        :drag-handle="`.${clsPrefix}-head`" :handles="['br']">
        <div :class="`${clsPrefix}-body`">
            <div :class="`${clsPrefix}-head`">
                <h1>{{title}}</h1>
                <div class="dialog-op">
                    <i class="far fa-window-close" @click="onClose"></i>
                    <i v-if="!maximized && resizable" class="far fa-window-maximize" @click="onMaximize"></i>
                    <i v-if="maximized" class="far fa-window-restore" @click="onRestore"></i>
                    <i class="far fa-window-minimize" @click="onMinimize"></i>
                </div>
            </div>
            <div :class="{[`${clsPrefix}-content`]: true, [`${clsPrefix}-content-without-actions`]: dialog.actions.length === 0}">
                <iframe ref="iframe" :id="`dialog-frame-${dialog.id}`" :src="dialog.route.fullPath" width="100%" height="100%" frameborder="no"
                    border="0" marginwidth="0" marginheight="0" scrolling-x="no" scrolling-y="auto" allowtransparency="yes" target="dialog"></iframe>
            </div>
            <div v-if="dialog.actions.length > 0" :class="`${clsPrefix}-actions`">
                <i-button v-for="(action, idx) in dialog.actions" :key="action.title"
                    :type="action.type" :loading="actionLoadings[idx]" @click="onAction(idx)">{{action.title}}</i-button>
            </div>
        </div>
    </vue-draggable-resizable>
</template>
<script>
import VueDraggableResizable from './vue-draggable-resizable.vue'

export default {

    name: 'draggable-dialog',

    components: {
        VueDraggableResizable 
    },

    props: {

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

        // 布局配置
        layout: {
            type: Object,
            required: true 
        },

        // 当前激活的对话框id
        activeId: {
            type: Number,
            required: true,
            default: 0
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: false,
            default: 'dialog'
        }
    },

    data() {
        const fixedWidth = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.width
        const fixedHeight = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.height

        return {
            // 是否窗口放大
            maximized: false,
            // 是否窗口缩小
            minimized: false,
            // 是否可缩放 => 固定宽度/高度不可缩放`
            resizable: !fixedWidth && !fixedHeight,
            // action异步标记
            actionLoadings: {}
        }
    },

    computed: {

        // 窗口标题
        title() {
            const title = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.title
            if (!title) return ''
            if (typeof title === 'string') return title
            if (typeof title === 'function') return title(this.dialog.route)
            return ''
        },

        // 初始大小
        bornSize() {
            // 用户设置了固定大小
            const fixedWidth = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.width
            const fixedHeight = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.height

            // 用户设置了最大尺寸
            const maxWidth = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.maxWidth
            const maxHeight = this.dialog.route && this.dialog.route.meta && this.dialog.route.meta.maxHeight

            // 布局配置的最大尺寸
            const maxLayoutWidth = this.layout.width.max.find(it => it.breakpoint > this.constraint.width).value
            const maxLayoutHeight = this.layout.height.max.find(it => it.breakpoint > this.constraint.height).value

            // 响应式布局
            const responsiveWidth = this.layout.width.responsive.find(it => it.breakpoint > this.constraint.width).value
            const responsiveHeight = this.layout.height.responsive.find(it => it.breakpoint > this.constraint.height).value

            let width = 0
            if (fixedWidth) width = fixedWidth
            if (!width) {
                if (responsiveWidth) width = Math.floor(this.constraint.width * responsiveWidth)
                if (maxLayoutWidth) width = Math.min(maxLayoutWidth, width)
                if (maxWidth) width = Math.min(maxWidth, width)
            }

            let height = 0
            if (fixedHeight) height = fixedHeight
            if (!height) {
                if (responsiveHeight) height = Math.floor(this.constraint.height * responsiveHeight)
                if (maxLayoutHeight) height = Math.min(maxLayoutHeight, height)
                if (maxHeight) height = Math.min(maxHeight, height)
            }
            
            return { width, height }
        },

        // 初始位置
        bornPosition() {
            // 在拖拽范围居中
            const { width, height } = this.bornSize
            const x = Math.max(0, (this.constraint.width - width) / 2)
            const y = Math.max(0, (this.constraint.height - height) / 2)
            return { x, y }
        }
    },

    watch: {

        maximized() {
            this.$emit('on-maximized', this.maximized)
        },

        minimized() {
            this.$emit('on-minimized', this.minimized)
        },

        dialog() {
            // 为每个action建立一个异步标记
            const loadings = {}
            this.dialog.actions.forEach((it, idx) => loadings[idx] = false)
            this.actionLoadings = loadings
        }
    },

    mounted() {
        // 需要将内嵌iframe中的事件冒泡，这样才能正确处理点击后获取焦点、结束移动等对话框操作
        const iframe = this.$refs.iframe
        const evts = ['click', 'mousemove', 'mouseup', 'touchend', 'touchmove', 'touchcancel']
        evts.forEach(it => {
            iframe.contentWindow.addEventListener(it, function(e) {
                const boundingClientRect = iframe.getBoundingClientRect()
                const evt = new CustomEvent(it, { bubbles: true, cancelable: false })
                evt.clientX = e.clientX + boundingClientRect.left
                evt.clientY = e.clientY + boundingClientRect.top
                iframe.dispatchEvent(evt)
            })
        })
    },

    methods: {

        restore() {
            this.minimized = false
            this.$refs.draggable.restore()
        },

        maximize() {
            this.minimized = false
            this.$refs.draggable.maximize()
        },

        onClose() {
            this.$router.close(this.dialog.id)
        },

        onMaximize() {
            this.maximize()
        },

        onRestore() {
            this.restore()
        },

        onMinimize() {
            this.minimized = true
        },

        onMaximized(maximized) {
            this.maximized = maximized
        },

        onActive() {
            this.$emit('on-active')
        },

        onAction(idx) {
            const action = this.dialog.actions[idx]
            if (action.isAsync) {
                this.actionLoadings[idx] = true
                action.onAction()
                    .then(() => {
                        this.actionLoadings[idx] = false
                    })
                    .catch(e => {
                        console.error(e)
                        this.actionLoadings[idx] = false
                    })
            } else {
                action.onAction()
            }
        }
    },
}
</script>
