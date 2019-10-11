<template>
    <div :class="`${clsPrefix}-tabs-wrap`">
        <div ref="scrollWrap" :class="`${clsPrefix}-tabs-list`"
            @DOMMouseScroll="onScrollTabs" @mousewheel="onScrollTabs" v-resize:throttle.300="onResizeScroll">
            <ul ref="scrollBody" :style="{transform: `translateX(${scrollLeft}px)`}">
                <li v-for="tab in tabs" :key="tab.id" :class="tabCls(tab.id)" @click="onClickTab(tab.id)">
                    <span>{{tab.title}}</span>
                    <Icon v-if="closable" @click.native.stop="onCloseTab(tab.id)" type="ios-close-empty"></Icon>
                </li>
            </ul>
            <div :class="`${clsPrefix}-tabs-active-bar`" :style="activeBarStyle"></div>
        </div>
        <div :class="`${clsPrefix}-tabs-action`">
            <Dropdown transfer @on-click="onTabAction">
                <Icon type="more"></Icon>
                <DropdownMenu slot="list">
                    <DropdownItem v-for="action in tabActions" :key="action.type"
                        :name="action.type" :disabled="!closable">{{action.text}}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import { parseUrl, stringifyUrl } from '../../../../../../scripts/utils/url'

// 更多tab操作
const TabActions = [
    {type: 'close_others', text: '关闭其它'}
]

// 分配tab id
let tabId = 0
const assignTabId = () => { return ++tabId }

const normalizeUrl = url => {
    const {path, query, hash} = parseUrl(url, true)
    delete query._tgt
    return stringifyUrl({path, query, hash})
}

const getMenusPathMap = (menus, map) => {
    menus.forEach(it => {
        map[normalizeUrl(it.url)] = it
        getMenusPathMap(it.children || [], map)
    })
    return map
}

export default {

    name: 'LayoutNav',

    props: {

        // 菜单配置
        menus: {
            type: Array,
            required: true
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            // 标签列表
            tabs: [],

            // 数据预处理 menu path => menu id
            menusPathMap: getMenusPathMap(this.menus, {}),

            // 当前选中的tab
            currentTabId: 0,

            // tab滑动偏移
            scrollLeft: 0,
            
            // 选中高亮光标位置
            activeBarLeft: 0,

            // 选中高亮光标宽度
            activeBarWidth: 0,

            // 控制滑动的速度
            scrollSpeed: 40,

            // 标记dom完成
            domReady: false,

            // tab操作
            tabActions: TabActions,
        }
    },

    computed: {

        closable() {
            return this.tabs.length > 1
        },

        activeBarStyle() {
            const scaleX = this.activeBarWidth || 1
            return {transform: `scaleX(${scaleX}) translateX(${(this.activeBarLeft/scaleX).toFixed(2)}px)`}
        },

        currentTab() {
            return this.tabs.find(it => { return it.id === this.currentTabId })
        },

        currentTabIndex() {
            return this.tabs.findIndex(it => { return it.id === this.currentTabId })
        }
    },

    watch: {

        scrollLeft() {
            this.$nextTick(() => {
                // 滑动时高亮tab
                this.updateActiveBar()
            })
        },

        currentTabId() {
            // 切换tab重新布局
            this.$nextTick(() => {
                this.updateActiveBar()
                this.scrollToCurrentTab()
            })

            // 切换tab时，确保页面正确跳转
            const targetUrl = this.currentTab.url
            const currentUrl = normalizeUrl(this.$router.currentRoute.fullPath)
            if (targetUrl !== currentUrl) this.$router.push(targetUrl)
        },

        tabs() {
            // tab变化重新布局
            this.$nextTick(() => {
                this.updateActiveBar()
                this.scrollToCurrentTab()
            })

            this.$emit('on-urls', this.tabs.map(it => it.url))
        },

        // 页面切换时调整tab
        '$route': function() {
            const url = normalizeUrl(this.$route.fullPath)
            const tab = this.tabs.find(it => { return it.url === url })
            if (tab) {
                if (tab.id !== this.currentTabId) this.selectTab(tab.id)
            } else {
                let title = this.$route.meta && this.$route.meta.title
                if (title && typeof title === 'function') title = title(this.$route)
                else if (title && typeof title !== 'string') title = undefined
                
                if (!title) {
                    const menu = this.menusPathMap[url] || this.menusPathMap[this.$route.query._r]
                    if (menu) title = menu.name
                }

                title = title || '加载中...'

                const id = assignTabId()
                this.addTab({id, url, title})
            }
        }
    },

    mounted() {
        // 初始时需要等待dom完成才能计算位置
        setTimeout(() => {
            this.domReady = true
            if (this.currentTabId > 0) {
                this.updateActiveBar()
                this.scrollToCurrentTab()
            }
        }, 1)
    },

    methods: {

        onClickTab: _.debounce(function(id) {
            this.selectTab(id)
        }, 300, {leading: true}),

        onCloseTab: _.debounce(function(id) {
            this.removeTab(id)
        }, 300, {leading: true}),

        onTabAction: _.debounce(function(type) {
            switch(type) {
                case 'close_others': {
                    const tab = this.currentTab
                    if (tab) {
                        this.tabs = [tab]
                        this.selectTab(tab.id)
                    }
                    break
                }
                default: {
                    break
                }
            }
        }, 300, {leading: true}),

        onScrollTabs(e) {
            // 拦截冒泡 & 默认行为，防止滑动tabs时页面也滑动
            e.preventDefault()
            e.stopPropagation()

            // 鼠标滑动产生的偏移
            let delta = 0
            if (e.type === 'DOMMouseScroll' || e.type === 'mousewheel') {
                delta = (e.wheelDelta) ? e.wheelDelta : -((e.detail || 0) * this.scrollSpeed);
            }
            this.updateScroll(delta)
        },

        onResizeScroll(e) {
            this.scrollToCurrentTab()
        },

        // 根据偏移量重新计算滑动位置
        updateScroll(delta) {
            if (delta > 0) {
                // 向右侧滑动，不超过起点位置
                this.scrollLeft = Math.min(0, this.scrollLeft + delta);

            } else {
                // 向左侧滑动

                const wrapW = this.$refs.scrollWrap.offsetWidth
                const bodyW = this.$refs.scrollBody.offsetWidth

                if (wrapW < bodyW) {
                    // tabs超过容器宽度，最多滑倒终点位置
                    const minLeft = wrapW - bodyW
                    this.scrollLeft = Math.max(minLeft, this.scrollLeft + delta)
                } else {
                    // tabs不够，固定在起点位置，不可滑动
                    this.scrollLeft = 0
                }
            }
        },

        addTab(tab) {
            this.tabs.push(tab)
            this.selectTab(tab.id)
        },

        selectTab(id) {
            const tab = this.tabs.find(it => { return it.id === id })
            if (!tab) {
                console.warn('选择tab失败，tab不存在：%d', id)
                return
            }
            this.currentTabId = id
        },

        removeTab(id) {
            const idx = this.tabs.findIndex(it => { return it.id === id })
            if (idx < 0) {
                console.warn('移除tab失败，tab不存在：%d', id)
                return
            }

            if (this.currentTabId === id) {
                // 删除的是当前选择的tab，优先先展示后面一个tab的内容
                if (idx < this.tabs.length - 1) {
                    this.currentTabId = this.tabs[idx + 1].id
                } else if (idx > 0) {
                    this.currentTabId = this.tabs[idx - 1].id
                } else {
                    this.currentTabId = -1
                }
            }
            this.tabs.splice(idx, 1)
        },

        getCurrentTabDOM() {
            const tabs = Array.prototype.slice.call(this.$refs.scrollBody.childNodes)
            return tabs[this.currentTabIndex]
        },

        scrollToCurrentTab() {
            if (!this.domReady) {
                return
            }

            const tab = this.getCurrentTabDOM()
            if (!tab) {
                return
            }

            // 可视宽度
            const viewWidth = this.$refs.scrollWrap.offsetWidth
            // 当前向左滑动距离
            const scrollDistance = -this.scrollLeft
            // 所有tab总宽度
            const bodyW = this.$refs.scrollBody.offsetWidth
            // tab的左侧坐标
            const tabL = tab.offsetLeft
            // tab宽度
            const tabW = tab.offsetWidth
            // tab右侧坐标
            const tabR = tabL + tabW

            if (bodyW <= viewWidth) {
                this.scrollLeft = 0
                return
            }

            if (tabL < scrollDistance) {
                // 在可视范围左侧，尽量显示到第一个
                this.scrollLeft = (tabL + viewWidth > bodyW) ? (-bodyW + viewWidth) : -tabL
                return
            }

            if (tabL >= scrollDistance && tabR <= viewWidth + scrollDistance) {
                // 在可视范围内，尽量保持位置
                if (scrollDistance + viewWidth > bodyW) {
                    this.scrollLeft = -bodyW + viewWidth
                }
                return
            }

            // 在可视范围右侧，tab显示到可视范围最右侧
            this.scrollLeft = -tabR + viewWidth
        },

        updateActiveBar() {
            if (!this.domReady) {
                return
            }

            const tab = this.getCurrentTabDOM()
            if (!tab) {
                return
            }

            // 光标跟随选中tab
            this.activeBarLeft = tab.offsetLeft + this.scrollLeft

            // 光标宽度和tab一致
            this.activeBarWidth = tab.offsetWidth
        },

        tabCls(id) {
            return {
                active: (id === this.currentTabId),
                unclosable: !this.closable
            }
        }
    }

}
</script>

