export default [
	{
		property: 'productName',
		filter: 'LIKE',
		label: '产品名称',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'code',
		filter: 'LIKE',
		label: '货号',
		render(h) { return <i-input v-model={this.model} placeholder='请输入'></i-input> }
	},
	{
		property: 'warehouseId',
		label: '仓库',
		filter: 'EQ',
		render(h) {
			const warehouses = this.$root.warehouses
			const options = warehouses.map(it => { return <i-option v-model={it.id}>{it.name}</i-option> })
			return <i-select v-model={this.model} placeholder='请选择仓库'>{options}</i-select>
		}
	}
]
