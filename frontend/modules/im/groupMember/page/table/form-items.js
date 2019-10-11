export default [
    {
        property: 'contact.customID',
        filter: 'EQ',
        label: '运营微信号',
        render(h) { return <i-input v-model={this.model} placeholder="请输入"></i-input> }
    },
    {
        property: 'contact.nickname',
        filter: 'LIKE',
        label: '运营微信号',
        render(h) { return <i-input v-model={this.model} placeholder="请输入"></i-input> }
    }
]
