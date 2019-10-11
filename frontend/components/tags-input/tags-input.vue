<template>
    <div :class="clsPrefix">
        <div class="item" v-for="(tag, index) in tags" :key="index">
            <tag class="tag" v-if="tag.show" @click.native="editTag(index)"  :name="tag.name" closable @on-close="handleClose(index)">{{tag.name}}</tag>
            <input class="input" v-if="!tag.show" v-focus v-model="tag.name" @blur="confirmTag(index)" @keyup.enter="confirmTag(index)" :style="{width: tag.name.length!==0 ? `${tag.name.length*16+16}px`: '40px'}" />
        </div>
        <i-button class="button" type="primary" @click.native="addTag">{{name}}</i-button>
    </div>
</template>

<script>
export default {
	props: {
		value: {
			type: Array,
			default: []
		},
		btnName: {
			type: String,
			required: false
		}
	},

	directives: {
		focus: {
			// 指令的定义
			inserted: function(el) {
				el.focus()
			}
		}
	},
	watch: {
		tags() {
			this.$emit('input', this.tags)
		},
		value() {
			this.tags = this.value
		}

	},
	data() {
		return {
			clsPrefix: `${App.options.styles.prefix}tags-component`,
			tags: this.value,
			name: this.btnName || '请填写标签'
		}
	},

	methods: {
		editTag(index) {
			this.tags[index].show = false
		},
		confirmTag(index) {
			if (!this.tags[index] || this.tags[index].name === '') {
				this.tags.splice(index, 1)
				return
			}
			this.tags[index].show = true
			return 
		},

		addTag() {
			this.tags.push({ name: '', show: false })
		},

		handleClose(index) {
			this.tags.splice(index, 1)
		}
	}
}
</script>

