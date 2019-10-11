<style lang="less" scoped>
    .spec-select-value{
        position: relative;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-size: auto 100%;
        border: 1px solid #c0c8cf;
        padding: 0 40px 0 10px;
        z-index:5;
        background: url('../images/select-bg.png') no-repeat scroll right center #f5f5f5;
    }
    .spec-select-search-box{
        position: absolute;
        border: 1px solid #c0c8cf;
        left: 0;
        top: 30;
        z-index: 10;
        border-top: none;
        box-sizing: border-box;
        background: #fff;
    }
    .spec-select-search-input{
        width: 100%;
        height: 30px;
        border: none;
        box-sizing: border-box;
        padding: 0 6px;
        border-bottom: 1px solid #c0c8cf;
        outline: none;
    }
    .loading{
        color:#cac7c7;
        text-align: center;
    }
    .spec-select-search-items{
        cursor: pointer;
        padding: 4px;
        height:30px;
        line-height: 30px;
        &:hover {
            background-color: #c0c8cf;
        }
    }
    .dropdown-icon{
        position:absolute;
        height:30px;
        width:30px;
        background: #dbe4eb;
        top:0;
        right:0;
    }
</style>
<template>
    <div class="spec-select-wrap" style="width: 130px" v-clickoutside="handleClose">
        <div class="spec-select">
            <div class="spec-select-value" @click="toggle">{{model}} </div>
            <div class="spec-select-search-box" v-show="visible" style="width: 130px" >
                <input v-if="visible" class="spec-select-search-input" v-model="inputVal" v-focus="visible" type="text" v-on:keyup.enter="onKeyupEnter(inputVal)" @focus="remote('')"  placeholder="输入规格">
                <transition name="transition-drop">
                    <div v-if="loading" class="loading">加载中......</div>
                    <div v-if="!loading" class="spec-select-search-list">
                        <div v-for="(item, key) in remoteList" :key="`spec_${key}`" class="spec-select-search-items"   @click="clickSpecItem(item)">{{item.name}}</div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Spec from '../../../../../models/ecommerse/spec'
export default {
	directives: {
		focus: {
			inserted: function(el, { value }) {
				if (value) {
					el.focus()
				}
			}
		}
	},
	data() {
		return {
			loading: false,
			model: this.value,
			visible: false,
			inputVal: '',
			remoteList: []
		}
	},
	props: {
		value: {
			type: String,
			required: false
		},
		specList: {
			type: Array,
			required: true
		},
		selectSpecCallback: {
			type: Function,
			required: true
		}
	},
	watch: {
		model(val) {
			this.$emit('input', this.model)
		},
		value(val) {
			this.model = val
		},
		inputVal(val) {
			this.remote(val)
		}
	},
	methods: {
		toggle() {
			this.visible = !this.visible
			if (this.visible) {
				this.inputVal = ''
			}
		},

		handleClose() {
			this.visible = false
		},

		async remote(query) {
			const filter = [
				{
					property: 'deleted',
					filterType: 'EQ',
					value: false
				}
			]
			if (query) {
				filter.push({
					property: 'name',
					filterType: 'LIKE',
					value: query
				})
			}
			const page = await Spec.pageNoAuth(1, 100, filter, [], true)
			this.remoteList = page.content
		},

		async onKeyupEnter(val) {
			if (!val) {
				this.$Notice.error({title: '输入规格不能为空'})
				return
			}
			if(_.some(this.specList, {name: val})) {
				this.$Notice.error({title: '不能输入相同的规格值'})
				return 
			}
			this.model = val

			this.visible = false
			this.inputVal = ''
			const spec = _.find(this.remoteList, it => { return it.name === val}) //是否已经存在
			if(!!spec) { //已经存在则直接读取
				this.$emit('input', spec.name)
				this.selectSpecCallback(spec)
			} else { //否则 创建一个新的规格
				const params = {
					name: val,
					value: JSON.stringify([])
				}
				const specResult = await Spec.create(params)
				this.selectSpecCallback(specResult)
			}
			
		},

		clickSpecItem(val) {
			if(_.some(this.specList, {name: val.name})) {
				this.$Notice.error({ title: '不能输入相同的规格值'})
				return 
			}
			this.model = val.name
			this.visible = false
			this.inputVal = ''
			this.$emit('input', val.name)
			this.selectSpecCallback(val)
		}
	}
}
</script>


