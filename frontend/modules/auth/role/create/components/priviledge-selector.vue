<template>
    <div :class="clsPrefix">
        <div>
            <Checkbox v-model="selectAll">选中全部</Checkbox>
            <Checkbox v-model="expandAll">展开全部</Checkbox>
        </div>
        <div class="content">
            <ul>
                <li class="resource css-sprites" v-for="resource in resources" :key="resource.id">
                    <i :class="['css-sprites', 'icon', resource.expand ? 'open-icon' : 'close-icon']" @click="displayAction(resource.id)"></i>
                    <Checkbox class="check-box" v-model="resource.select" @on-change="changeResourceSelect(resource.id, resource.select)" style="color:#000">{{resource.name}}</Checkbox>
                    <ul v-show="resource.expand" class="action">
                        <li v-if="resource.actions.length>0" v-for="action in resource.actions" :class="{'long-text': getStringLength(action.name) > 8 }" :key="action.id" style="float:left">
                            <i class="icon"></i>
                            <Checkbox class="check-box" v-model="action.select" @on-change="changeActionSelect(resource.id)" >{{action.name}}</Checkbox>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Resource from '../../../../../models/auth/resource'
import Permission from  '../../../../../models/auth/permission'
import Role from '../../../../../models/auth/role'
import { stringLength } from '../../../../../scripts/utils/misc'
export default {
 
    props: {

        value: {
            type: [Object, Array],
            required: true
        }
    },

    data() {
        return {
            clsPrefix: `${App.options.styles.prefix}priviledge-selector`,
            selectAll: false,
            expandAll: false,
            resources: [],
            model: this.value
        }
    },
    watch: {

        selectAll(val) {
            this.handleAllActions('select', val)
        },

        expandAll(val) {
            this.handleAllActions('expand', val)
        },

        value() {
            this.model = this.value
        },
        model() {
            this.$emit('input', this.model)
        },
        resources: {
            handler(val) {
                const permissionIds =[]
                _.forEach( val, it => {
                    _.map(it.actions, item => { if(item.select) permissionIds.push(item.id)})
                })
                this.model = permissionIds
            },
            deep: true
        }
    },

    mounted() {
        this.initData()
    },
    
    methods: {
        async initData() {
            const resourceList = await Resource.list()
            const permissionList = await Permission.list()

            const rolePermissions = this.value
            this.resources = this.handleResourceByPermission(resourceList, permissionList, rolePermissions)

        },

        //通过permission 处理资源，然后遍历资源得到权限树 resurceId === id
        handleResourceByPermission(resourceList, permissionList, rolePermissions) {
            _.forEach( resourceList, it => {
                it.expand = false
                it.select = false
                it.actions = []
                _.forEach( permissionList, item => {
                    if (item.resourceId === it.id) {
                        item.select = rolePermissions.indexOf(item.id) > -1 ? true : false
                        it.actions.push(item)
                    }
                })
                const selectedActions = _.some( it.actions, { select: false } )
                it.select =  it.actions.length > 0 && !selectedActions
            })
            return resourceList
            
        },
        //显示和隐藏actions
        displayAction(id) {
            _.some( this.resources, it => {
                if (it.id === id) {
                    it.expand = !it.expand
                }
            })
        },

        //关闭和选择所有actions
        changeResourceSelect(id, select) {
            _.some(this.resources, it => {
                if (it.id === id) {
                    it.select = select
                    _.forEach(it.actions, item => {
                        item.select = select
                    })
                }
            })
        },
        //判断所有actions被选择和关闭，相应的resource的select变成true或者false
        changeActionSelect(id) {
           _.some(this.resources, it => {
                if (it.id === id) {
                    const selectedActions = _.some( it.actions, { select: false } )
                    it.select =  it.actions.length > 0 && !selectedActions
                }
            })
        },
        //操作所有actions ,全部选择，全部展开等
        handleAllActions(type, Bool) {
            _.forEach(this.resources, it=> {
                it[type] = Bool
                _.forEach(it.actions, item => {
                    item[type] = Bool
                })
            })
        },
        getStringLength(name) {
            return  stringLength(name)
        }
    }
}
</script>

