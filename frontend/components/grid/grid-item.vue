// <style lang="less" scoped>
// 		.grid-item {
// 			position: relative;
			
// 		}
// 		.check-box-bg {
// 			display: none;
// 			position: absolute;
// 			width: calc(~"100% - 8px");
// 			background: rgba(0,0,0,0.4);
// 			height: 30px;
// 			top:4px;
// 			right: 4px;
// 		}
// 		.check-box {
// 			position: absolute;
// 			right: 4px;
// 			top: 4px;
// 		}
// 		.select-optional{
// 			&:hover {
// 				.check-box-bg {
// 					display: block
// 				}
// 			}
// 		}
// 		.row-checked {
// 			display: block
// 		}
// </style>

<template>
    <div :class="['grid-item', 'posr', 'br-xs', 'pointer', {'select-optional': optional}]">
        <render-content :render="rowRender"></render-content>
		<div :class="['check-box-bg',  {'row-checked': row._checked}]">
			<Checkbox :value="row._checked" class="check-box" @on-change="onSelect"></Checkbox>
		</div>
		
    </div>
</template>
<script>
import _ from 'lodash'

export default {
	

    props: {

        /**
         * Grid渲染逻辑
         * 
         * (h, row, $grid) => { ... }
         */
        renderGrid: {
            type: Function,
            required: true
        },

        // 渲染用的数据
        row: {
            type: Object,
            required: true
        },

        // 关联的数据源
        data: {
            type: Object,
            required: true
        },
        // 选择类型
        selectionType: {
            type: [String, Boolean],
            required: true
        }
    },

    computed: {

        rowRender() {
            return h => {
                const ctx = {
                    index: this.row._index,
                    row: _.cloneDeep(this.data)
                }
                return this.renderGrid(h, ctx, this.$parent)
            }
        },
		optional() {
			if (!this.selectionType) {
                return false
			}
			return true
		},
		selectType() {
			if (this.row._disabled) {
                return 'disabled'
            }
            if (this.row._checked) {
                return 'checked'
            }
		}
    },

    methods: {

        onSelect() {
            if (this.selectionType && !this.row._disabled) {
				console.log('==========')
                this.$emit('on-select', this.row._index)
            }
        }
    }
    
}
</script>

