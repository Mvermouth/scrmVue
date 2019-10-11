<template>
    <div :class="`${clsPrefix}-body flex`" style="flex-direction: column">
        <div v-if="logo" class="flex-item mr1f">
            <render-content v-if="typeof logo === 'function'" :render="logo"></render-content>
            <!-- <img v-else :src="logo" class="avatar-md vm"/> -->
			<im-avatar :url="logo"></im-avatar>
        </div>
        <div :class="['flex-item', logo ? 'mt0_5f' : '']">
            <div v-for="(group, idx) in contentList" :key="`group-${idx}`" class="info-list">
                <div v-if="group.title" class="title">
                    <render-content v-if="typeof group.title === 'function'" :render="group.title"></render-content>
                    <span v-else>{{group.title}}</span>
                </div>
                <row>
                    <i-col v-for="it in group.content" :key="it.k" v-bind="it.long ? {span: 24} : layout">
                        <div class="term">{{it.k}}</div>
                        <div class="value">
                            <render-content v-if="typeof it.v === 'function'" :render="it.v"></render-content>
                            <span v-else>{{it.v}}</span>
                        </div>
                    </i-col>
                </row>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

/**
 * 详情页信息展示
 */
export default {

	props: {

		/**
         * 图标 - 44*44
         */
		logo: {
			type: [String, Function],
			required: false
		},

		/**
         * 信息字段
         *
         * 格式
         * [
         *      {
		 * 		    title: '信息组标题，可选'
		 * 
		 * 		    content: [
         *      	    // 文本内容
         *      	    {'标题': '内容'},
         *
         *      	    // 自定义渲染
         *      	    {'标题': h => { } },
         *
         *      	    // 内容 + 属性配置
         *      	    {'标题': { content: '', long: true } },
         *      	    {'标题': { content: h => { }, long: true } }
		 * 		    ]
         *      }
         * ]
         */
		content: {
			type: Array,
			required: true
        },

        // 布局配置
        layout: {
            type: Object,
            required: false,
            default() {
                return {
                    xs: 12,
                    sm: 8,
                    md: 6,
                    lg: 4 
                }
            }
        }
	},

	data() {
		return {
			// 样式前缀
			clsPrefix: `${App.options.styles.prefix}retrieve`
		}
	},

	computed: {

		contentList() {
            return this.content.map(it => {
                return {
                    title: it.title,
                    content: it.content.map(it => {
                        const k = _.keys(it)[0]
                        let v = it[k]
                        let long = false
                        if (typeof v === 'object') {
                            long = v.long
                            v = v.content
                        }
                        return { k, v, long }
                    })
                }
            })
		}
	}
}
</script>

