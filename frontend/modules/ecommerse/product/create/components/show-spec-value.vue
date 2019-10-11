<style lang="less" scoped>
    .spec-value-items{
        width: 92px;
        margin-right: 15px;
        margin-bottom: 20px;
        position: relative;
    }
    .spec-value-items-tag-close{
        position: absolute;
        width: 20px;
        height: 20px;
        right: -10px;
        top: -10px;
        z-index: 5;
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #a5bacc;
        color: #ffffff;
        cursor: pointer;
        padding: 0;
    }
    .spec-value-items-tag{
        margin-bottom: 5px;
        position: relative;
        cursor: pointer;
    }
    .spec-value-items-tag-txt{
        width: 92px;
        height: 40px;
        display: block;
        line-height: 40px;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        background: #ffffff;
        border-radius: 6px;
        box-sizing: border-box;
        padding: 0 10px;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ui-upload-img {
        width: 88px;
        height: 88px;
        background: #ffffff;
        border: 2px dashed #ddd;
        label{
            cursor: pointer;
            display: block;
            position: relative;
            height: 100%;
        }
        label:before,label:after{
            content: "";
            position: absolute;
            width: 20px;
            height: 3px;
            background: #c0c8cf;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        label:before{
            transform: translate(-50%, -50%) rotate(90deg);
        }
    }
    .tags-layout {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
<template>
    <div class="tags-layout">
        <div class="spec-value-items" v-for="(value, index) in specValues" :key="`${value}_${index}`">
            <div class="spec-value-items-tag">
                <div class="spec-value-items-tag-txt">{{value.name}}</div>
                <div class="spec-value-items-tag-close iconss iconss-close" @click="handleClose(index)"><icon type="ios-close-empty" :size="20"></icon></div>
            </div>
            <div v-if="isHaveImg" class="ui-upload-img">
                <label>
                    <input type="file" hidden="">
                </label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
	props: {
		value: {
			type: Array,
			required: true
		},
		isHaveImg: {
			type: [Boolean],
            required: false,
            default:false
		}
	},
	data() {
		return {
			specValues: this.value
		}
	},
	watch: {
		value(val) {
			this.specValues = val
		}
	},
	methods: {
		handleClose(index) {
			this.specValues.splice(index, 1)
			this.$emit('input', this.specValues)
		}
		// 上传图片成功之后调用函数，双向绑定
	}
}
</script>


