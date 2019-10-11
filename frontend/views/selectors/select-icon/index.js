import Selector from './selector.vue'

export default {

    components: {
        Selector
    },

    props:{

        // 默认图标
        defaultIcon: {
            type: Object,
            required: false
        },

        // 候选图标
        icons: {
            type: Object,
            required: true
        },

        // v-model 控制选择器打开/关闭
        value: {
            type: Boolean,
            required: true
        },

        title: {
            type: String,
            required: false,
            default: '选择图标' 
        }
    },

    data() {

        return {
            model: this.value,
            // 对话框确定/取消会自动关闭，这样v-model触发关闭时，导致重复关闭，通过该标志保护
            autoClosed: false,

            // 当前选择的图标
            icon: this.defaultIcon || {
                name: '',
                value: ''
            }
        }
    },

    watch: {

        defaultIcon() {
            this.icon = this.defaultIcon
        },
    
        value() {
            this.model = this.value
        },

        model() {
            this.$emit('input', this.model)
            this.model ? this.openSelector() : this.closeSelector()
        }
    },

    render(h) {
        return h()
    },

    methods:{ 

        openSelector() {
            App.modal({
                title: this.title,
                width: 'large',
                closable: true,
                render: h => {
                    h = this.$createElement
                    return <selector icons={this.icons} v-model={this.icon}></selector>
                },
                onOk: () => {
                    // 确认选择图标
                    this.$emit('on-selected-icon', this.icon)

                    // 关闭
                    this.autoClosed = true
                    this.model = false
                },
                onCancel: () => {
                    // 关闭
                    this.autoClosed = true
                    this.model = false
                },
                onClose: () => {
                    // 关闭
                    this.autoClosed = true
                    this.model = false
                }
            })
        },

        closeSelector() {
            if (!this.autoClosed) {
                App.removeModal()
            }
            this.$nextTick(() => {
                this.autoClosed = false
            })
        }
    }
}