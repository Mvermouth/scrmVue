export default [
    {
        property: 'title',
        filter: 'LIKE',
        label: '变量值',
        render(h) { return <i-input v-model={this.model} placeholder="请输入"></i-input> }
    }

]
