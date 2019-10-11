<template>
    <Scroll :height="height" :on-reach-bottom="onReachBottom">
        <div v-if="items.length > 0" class="item-list"> 
            <div v-for="(item, index) in items" :class="['item', {'selected': (item === selectedItem) }]" :key="index" @click="handleItemChanged(item)">
                <component
					v-bind:is="itemComponent"
					v-bind:item="item">
				</component> 
            </div>
        </div>
        <div v-else class="noData">
            {{placeholder}}
        </div>
    </Scroll>
</template>
<script>

export default {
    props: {
        height: {
            type: Number,
            default: 300
        },
        itemComponent: {
            type: Object,
            required: true
        },
        placeholder: {
            type: String,
            required: false,
            default: '没有找到记录'
        },
        selectedIndex: {
            type: Number,
            default: -1,
        },
        items: {
            type: Array,
            required: true
        },
        onReachBottom: {
            type: Function,
            required: false,
            default: () => new Promise(resolve => resolve())
        }
    },
    components: {
    },
    data() {
        return {
            selectedItem: {}
        }
    },
    mounted() {
    },
    watch: {
        selectedIndex(index) {
            if (0 <= this.selectedIndex && this.selectedIndex < this.items.length) {
                this.handleItemChanged(this.items[this.selectedIndex])
            }
        },
        items() {
            _.isEmpty(this.items) && this.handleItemChanged(null)    
        }
    },
    methods: {
        handleItemChanged(item) {
            this.selectedItem = item
            this.$emit('item-changed', item)
        }
    }
}
</script>

