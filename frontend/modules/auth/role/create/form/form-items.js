
export default [
    {
        prop: 'name',
        label: '角色名称',
        rule: { required: true, message: '请填写角色' },
        render(h) {
            return <i-input v-model={this.model} placeholder="请填写角色"></i-input>
        }
    },

    {
        prop: 'permissionIds',
        label: '权限',
        default: [] ,
        render(h) {
            h = this.$root.$createElement
            return <priviledge-selector v-model={this.model}></priviledge-selector>
        }
    }
]