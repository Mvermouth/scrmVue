<template>
	<div>
		<div class="remark-history-info">
			<tabs value="remark_history_info">
				<tab-pane label="备注历史" name="remark_history_info"></tab-pane>
			</tabs>
			<no-paginator-page  ref="domainPage" v-bind="domainPageProps"></no-paginator-page>
		</div>
		<div class="add-remark">
			<tabs value="add-remark">
				<tab-pane label="新增备注" name="add-remark"></tab-pane>
			</tabs>
			<i-form>
				<form-item label="订单备注">
					<Row type="flex" align="bottom" justify="start">
						<Col span="16">
							<i-input class="w500" v-model="remark" type="textarea" :autosize="{minRows: 5,maxRows: 8}"></i-input>
						</Col>
						<Col span="4">
							<Button type="info" :loading="loading" @click="addRemark">添加</Button>
						</Col>
					</Row>
				</form-item>
			</i-form>
		</div>
	</div>	
</template>
<script>
import NoPaginatorPage from '../../../views/domain/no-paginator-page.vue'
import Order from '../../../models/ecommerse/order'
const width = App.options.styles.table.width

export default {
	components: {
		NoPaginatorPage
	},
	props: {
	 	order: {
			 type: Object,
			 required: true
		 }
	},
	data() {
		return {
				domainPageProps: {
					loadPage: async (pageNo,pageSize,filter,sort) =>{
						const result = await Order.orderRemarks(this.order.id)
						return {
								pageNo:1,
								pageSize: 20,
								content: result,
								total:result.length
							}
					},
					defaultCriterias :
						[
							{
								filterType: 'EQ',
								property: 'orderId',
								value: this.order.id
							}
						],
					defaultSort : [
						{
							'ignoreCase': false,
							'property': 'ctime',
							'type': 'DSC'
						}
					],
					columns: [
						{
							key: 'ctime',
							title: '时间',
							width: width.w_12,
							render(h, context){
								return <span>{dateformat(context.row.ctime,'yyyy-mm-dd HH:MM:ss')}</span>
							}
						},
						{
							key: 'content',
							title: '操作内容',
							width: width.w_20,
						},
						{
							key: 'creatorName',
							title: '添加人',
							width: width.w_10
						}
					]
			},
			remark:'',
			loading:false,

		}
	},
	methods:{
		async addRemark(){

			if(!this.remark){
				this.Message.error("备注内容不能为空!")
			}
			this.loading= true
			try {
				const result = await Order.addOrderRemark({ orderId: this.order.id, content : this.remark })
				this.loading = false
				this.$Notice.success({"title" : "添加备注成功!"})
				this.refresh()
				this.remark = ''
			} catch (error) {
				this.loading = false
				console.log("addRemark error:", error)
			}

		},
		async refresh(){
			this.$refs.domainPage.load()
		}
	}
}
</script>
