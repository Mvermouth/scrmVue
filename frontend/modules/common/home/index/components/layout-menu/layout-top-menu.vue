<template>
    <Menu ref="topMenu" :class="[`${clsPrefix}-nav`, `${clsPrefix}-nav-after`]" :accordion="accordion" width="auto"
        :open-names="openedMenus"
        theme="light"
        mode="horizontal"
        @on-open-change="onMenuOpenedChange" @on-select="onSelectMenu">
        <layout-menu-item
            v-for="menu in menus"
            :key="menu.id"
            :menu="menu"
            :cls-prefix="clsPrefix"
            :opened-menus="openedMenus"
            :selected-menu="selectedMenu"
            :collapsed="collapsed"
            @on-select="onSelectMenu">
        </layout-menu-item>
    </Menu>
</template>
<script>
import LayoutMenuItem from './layout-menu-item.vue'
import { parseUrl, stringifyUrl } from '../../../../../../scripts/utils/url'

const getMenusMap = (menus, map) => {
    menus.forEach(it => {
        map[it.id] = it
        getMenusMap(it.children || [], map)
    })
    return map
}

const getMenusParentMap = (menus, parentId, map) => {
    menus.forEach(it => {
        map[it.id] = parentId || 0
        getMenusParentMap(it.children || [], it.id, map)
    })
    return map
}

const getMenusPathMap = (menus, map) => {
    menus.forEach(it => {
        map[normalizeUrl(it.url)] = it.id
        getMenusPathMap(it.children || [], map)
    })
    return map
}

const normalizeUrl = url => {
    const {path, query, hash} = parseUrl(url, true)
    delete query._tgt
    return stringifyUrl({path, query, hash})
}

export default {
    name: 'LayoutMenu',
    components: {
        LayoutMenuItem
    },
    props: {
        // 菜单数据
        menus: {
            type: Array,
            required: true
        },
        // 是否折叠
        collapsed: {
            type: Boolean,
            required: false,
            default: false
        },
        // 手风琴模式
        accordion: {
            type: Boolean,
            required: false,
            default: true
        },

        // 样式前缀
        clsPrefix: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            // 菜单预处理 menu id => menu
            menusMap: getMenusMap(this.menus, {}),

            // 数据预处理 menu id => parent menu id
            menusParentMap: getMenusParentMap(this.menus, 0, {}),

            // 数据预处理 menu path => menu id
            menusPathMap: getMenusPathMap(this.menus, {}),

            // 展开的菜单项
            openedMenus: [],

            // 折叠导航前展开的菜单项
            openedMenusBeforeCollapsed: [],

            // 选中的菜单项
            selectedMenu: 0,
        }
    },

    watch: {
        collapsed(newVal) {
            if (newVal) {
                // 折叠导航，关闭展开的菜单项
                this.openedMenusBeforeCollapsed = this.openedMenus
                this.openedMenus = []
                this.$nextTick(() => {
                    this.$refs.topMenu.updateOpened()
                })
            } else {
                // 打开导航，恢复之前展开的菜单项
                this.openedMenus = this.openedMenusBeforeCollapsed
                this.openedMenusBeforeCollapsed = []
                this.$nextTick(() => {
                    this.$refs.topMenu.updateOpened()
                })
            }
        },
        // 监听路由变化
        '$route': function() {
            // 根据地址，高亮对应菜单
            const id = this.menusPathMap[normalizeUrl(this.$route.fullPath)]
            if (!id) return

            const menu = this.menusMap[id]
            if (!menu) return

            if (this.selectedMenu !== id) this.selectedMenu = id

            // 高亮菜单直接展开
            if (!this.collapsed) {
                const opened = []
                let parentMenu = this.menusMap[this.menusParentMap[id]]
                while(parentMenu) {
                    opened.unshift(parentMenu.id)
                    parentMenu = this.menusMap[this.menusParentMap[parentMenu.id]]
                }
                if (opened.join('|') !== this.openedMenus.join('|')) {
                    this.onMenuOpenedChange(opened)
                }
            }
        }

    },

    methods: {

        // 展开菜单项目变化
        onMenuOpenedChange(opened) {
            if (!this.accordion) {
                this.openedMenus = opened
                return
            }

            // iview menu 的 accordion 模式，如果 submenu 不是 menu 的直接儿子，无法生效
            // 这里自己处理 accordion

            // 新打开的菜单
            const addMenus = _.difference(opened, this.openedMenus)
            if (addMenus.length === 0) {
                this.openedMenus = opened
                return
            }

            // 同级的菜单都要关闭
            const delMenus = addMenus.reduce((results, it) => {
                const parentId = this.menusParentMap[it]
                const parentMenu = this.menusMap[parentId];
                return results.concat((parentMenu ? parentMenu.children : this.menus).map(it => { return it.id }))
            }, [])

            _.each(delMenus, it => { _.pull(opened, it) })
            opened = opened.concat(addMenus)
            
            this.openedMenus = opened
            this.$nextTick(() => {
                this.$refs.topMenu.updateOpened()
            })
        },

        // 选中菜单项目
        onSelectMenu(id) {
            const menu = this.menusMap[id]
            if (menu && menu.funcType === 'menu') {
                this.$router.push(menu.url)
                this.selectedMenu = id
            }
        }
    }
}
</script>

