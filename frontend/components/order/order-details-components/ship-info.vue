<template>
	<div>
		<div class="logistics-info">
			<tabs value="logistics_info">
				<tab-pane label="物流详情" name="logistics_info">
					<div v-if="shipInfo">
						<Form :label-width="120">
							<FormItem label="创建时间">
								<p>{{ctime}}</p>
							</FormItem>
							<FormItem label="收货人">
								<p>{{shipInfo.addressInf.consignee}}</p>
							</FormItem>
							<FormItem label="物流公司">
								<p>{{shipInfo.expressInf.name}}</p>
							</FormItem>
							<FormItem label="物流单号">
								<p>{{shipInfo.expressNo}}</p>
							</FormItem>
							<FormItem label="物流状态">
								<p>{{shipStatusText}}</p>
							</FormItem>
							<FormItem label="物流详情">
								<div v-if="shipInfo.expressInfo.length>0">
									<p v-for="item in shipInfo.expressInfo">{{item}}</p>
								</div>
								<p v-else>抱歉！暂无任何物流进展。</p>
							</FormItem>
						</Form>	
						<row style="margin-top: 20px;">
							<i-col span="4" offset="10">
								<i-button long size="large" type="success" :loading="loading" @click="refreshShipInfo">刷新</i-button>
							</i-col>
						</row>
					</div>
					<div v-else>
						<p>暂无任何物流信息!</p>
					</div>
				</tab-pane>
				<tab-pane label="编辑" name="edit_logistics_info" v-if= "shipInfo">
					<i-form :model="logisticsForms" :rules="ruleValidate">
						<form-item label="物流状态" prop="shipStatus">
							<i-select v-model="logisticsForms.shipStatus" class="w100">
								<i-option value= "shipping" key="shipping">已发货</i-option>
								<i-option value= "shipped" key="shipped">已签收</i-option>
							</i-select>
						</form-item>
						<form-item label="物流公司" prop="expressId">
							<i-select v-model="logisticsForms.expressId" class="w100">
								<i-option v-for="(logisticsCompany, index) in logisticsCompanys" :value="logisticsCompany.id" :key="`logisticsCompany_${index}`">{{logisticsCompany.name}}</i-option>
							</i-select>
						</form-item>
						<form-item label="物流单号" prop="expressNo">
							<i-input v-model="logisticsForms.expressNo" class="w200"></i-input>
						</form-item>
						<form-item label="修改原因">
							<i-input class="w500" v-model="logisticsForms.editReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></i-input>
						</form-item>
					</i-form>
					<div style="text-align: center"><i-button type="primary" :disabled ="updateDisabled" @click.native="edit">修改</i-button></div>
				</tab-pane>
			</tabs>
		</div>
	</div>	
</template>
<script>
import Order from '../../../models/ecommerse/order'
import ShipInfo from '../../../models/ecommerse/shipInfo'
import AppProxy from '../../../scripts/common/appProxy'
import AppRouter from '../../../configs/AppRoutes'
import shipInfo from '../../../models/ecommerse/shipInfo';
import Constants from '../../../configs/constant';
import { value2Text } from '../../../scripts/utils/misc';
const width = App.options.styles.table.width
 
export default {
	props: {
	 	order: {
			 type: Object,
			 required: true
		 }
	},
	data() {
		const expressNoValidate = (rule, value, callback) => {
            if (!/^[A-Za-z0-9]{5,20}$/.test(value)) {
                callback(new Error('请输入正确的快递单号!'));
            } else {
                callback();
            }
        }
		return {
			logisticsForms: {
				expressId: '',
				expressNo: '',
				shipStatus:'',
				editReason:''
			},
			ctime:'',
			updateDisabled: false,
			ruleValidate: {
				expressId: [
					{ required: false, message: '物流公司不能为空', trigger: 'blur' },
				],
				expressNo: [
					{ validator: expressNoValidate, trigger: 'blur' }
				]
			},
			logisticsCompanys: [],
			shipInfo: null,
			loading:false,
		}
	},
	async mounted() {
		this.init()
	},
	computed:{
		shipStatusText(){
			if(!this.shipInfo){
				return
			}
			return value2Text(Constants.ShipStatus,this.shipInfo.shipStatus)
		}
	},
	methods: {
		async init() {
			this.logisticsCompanys = await ShipInfo.expressList()
			this.logisticsForms.expressId = this.logisticsCompanys[0].id
			await this.getShipInfo()
		},
		async getShipInfo(){
			const filter = [
				{
					filterType: 'EQ',
					property: 'orderId',
					value: this.order.id
				},
				{
					filterType: 'EQ',
					property: 'deleted',
					value: false
				}
			]
			const shipInfoPage = await ShipInfo.page(1,1,filter,[])
			if(!_.isEmpty(shipInfoPage.content)){
				shipInfoPage.content.forEach(it=>{ it.expressInfo = it.expressInfo ?JSON.parse(it.expressInfo):[]})
				this.shipInfo = shipInfoPage.content[0]
				this.logisticsForms.expressId = this.shipInfo.expressId
				this.logisticsForms.expressNo = this.shipInfo.expressNo
				this.logisticsForms.shipStatus = this.shipInfo.shipStatus
				this.ctime = dateformat(shipInfo.ctime,'yyyy-mm-dd HH:MM:ss')
			}
		},
		async edit() {
			if(!this.logisticsForms.expressNo){
				this.$Notice.error({title: '物流单号不能为空'})
				return
			}
			const params = {
				orderId: this.order.id,
				expressId: this.logisticsForms.expressId,
				expressNo: this.logisticsForms.expressNo,
				shipStatus: this.logisticsForms.shipStatus
			}
			this.updateDisabled = true
			try {
				const result = await ShipInfo.update(params)
				this.updateDisabled = false
				this.$Notice.success({title: '修改物流成功'})
			} catch (error) {
				this.updateDisabled = false
				this.$Notice.error({title: '抱歉! 修改物流失败'})
			}
			await this.getShipInfo()
		},
		async refreshShipInfo(){
			this.loading =true
			try {
				await ShipInfo.refreshShipInfo(this.shipInfo.id)
				await this.getShipInfo()
				this.$Message.info('刷新物流信息成功!')
			} catch (error) {
				//this.$Message.info('刷新物流信息失败!')
			}
				this.loading =false
		} 
	}
}
</script>

