<style lang="less" scoped>
    @import './index.less';
</style>
<template>
    <div>
        <div class="pageHeader">
            <div class="detail">
                <div class="detail-logo"><img :src="site.logo_small" alt="logo"></div>
                <div class="detail-main">
                    <div class="title">
                        <h1>单号：{{order.sn}}</h1>
                        <div class="active">
                            <Button-group>
                                <Button type="ghost">操作</Button>
                                <Button type="ghost">操作</Button>
                                <Button type="ghost" icon="more"></Button>
                            </Button-group>
                            <Button type="primary">主操作</Button>
                        </div>
                    </div>
                    <div class="content">
						<description-info :descriptionInfos="createrOrderInfos" :layout="{xs:24,sm:12,md:12,lg:12}"></description-info>
                        <div class="extraContent">
                            <row>
                                <i-col :md="12" :lg="12">
                                    <div class="text-seconday">状态</div>
                                    <div class="heading">待审批</div>
                                </i-col>
                                <i-col :md="12" :lg="12">
                                    <div class="text-seconday">订单金额</div>
                                    <div class="heading">{{`￥ ${order.totalAmount}`}}</div>
                                </i-col>
                            </row> 
                        </div>
                    </div>
                </div>
            </div>
            <div class="nav-wrap">
                <div class="nav-tabs-scroll">
                    <div class="nav-tab-bar-animated nav-tab-ink-bar" :style="{'transform':'translate3d('+translateX+'px,0,0)','width':width+'px','display':'block'}"></div>
                    <div class="nav-tab-item" :class="{'nav-active':isActive('detail')}" @click="setActive('detail',0,60)">详情</div>
                </div>
            </div>
        </div>
		<row style="margin:24px 14px 0 14px">
			<card>
				<p slot="title">流程进度</p>
				<div class="process-card">
					<order-process :statusItems="orderStatus" :current="currentStatus"></order-process>
				</div>
			</card>
		</row>
        <row style="margin:24px 14px 0 14px">
            <Card>
                <p slot="title">用户信息</p>
                <div class="card-body">
                    <div class="content">
						<description-info :descriptionInfos="userInfos" :layout="{xs:24,sm:12,md:8,lg:8}"></description-info>
                    </div>
                </div>
            </Card>    
        </row>
        <row style="margin:24px 14px 0 14px">
            <Card>
                <p slot="title">商品详情</p>
                <div class="card-body">
                    <!-- <div class="noData">
                        <Icon type="sad-outline"></Icon>
                        "暂无数据"
                    </div> -->
					<domain-page  v-bind="domainPageProps"></domain-page>
                </div>
            </Card>    
        </row> 
    </div>
</template>
<script>
import DescriptionInfo from '../../../../components/order/description-info.vue'
import OrderProcess from '../../../../components/order/order-process.vue'
import Inventory from '../../../../models/ecommerse/inventory'
import DomainPage from '../../../../views/domain/page.vue'
import Constant from '../../../../configs/constant'
const width = App.options.styles.table.width
const site = App.data.site
export default {
	components: {
		DescriptionInfo,
		OrderProcess,
		DomainPage
	},
	props: {
		order: {
			type: Object,
			required: true
		}
	},
	computed: {
		createrOrderInfos() {
			return [
				{'下单人': this.order.metadata.createName || ''},
				{'归属员工': this.order.metadata.profileEmployeeName || ''},
				{'归属运营号': ''},
				{'创建时间': dateformat(this.order.ctime, 'yyyy-mm-dd HH:MM:ss')},
				{'支付方式': ''},
				{'预付金额': ''},
				{'员工备注': this.order.internalRemark || ''}
			]
		},
		userInfos() {
			return [
				{'收货人': this.order.address.consignee || ''},
				{'联系方式': this.order.address.mobile || ''},
				{'发货时间': dateformat('yyyy-mm-dd HH:MM:ss')},
				{'地区': `${this.order.address.state}、${this.order.address.city}、${this.order.address.district}`},
				{'地址': this.order.address.address || ''},
				{'邮编': this.order.address.zipCode || ''},
				{'买家备注': this.order.clientRemark || ''}
			]
		}
	},
    data(){
        return {
			site,
            nav_active:'detail',
            translateX:0,
			width:60,
			// 订单允许的操作
			actions: this.order.orderActions,
			allOrderStatus: Constant.OrderStatus,
			//订单状态
			orderStatus: [
				{title:'创建订单', content:'张银'},
				{title:'订单审核', content:'陈浩森'},
				{title:'仓库发货'},
				{title:'签收完成'}
			],
			//当前状态
			currentStatus: 2,
			//商品详情
			domainPageProps: {
				loadPage: async() => {
					return {
						pageNo: 1,
						pageSize: 20,
						total: this.order.orderItems.length,
						content: this.order.orderItems
					}
				},
				columns: [
					{
						key: 'productName',
						title: '商品名称',
						width: width.w_12
					},
					{
						key: 'extStr1',
						title: '商品货号',
						width: width.w_10
					},
					{
						key: 'extStr2',
						title: '规格',
						width: width.w_10
					},
					{
						key: 'price',
						title: '单价',
						width: width.w_10,
					},
					{
						key: 'quantity',
						title: '数量',
						width: width.w_10
					},
					{
						key: 'discountAmount',
						title: '优惠',
						width: width.w_10
					},
					{
						key: 'totalAmount',
						title: '总额',
						width: width.price
					}
				]
			}
        }
	},
	mounted() {
		
	},
    methods:{
        isActive:function(navItem){
            return this.nav_active == navItem;
        },
        setActive:function(navItem,x,y){
            this.nav_active = navItem;
            this.translateX = x;
            this.width = y;
        }
    }
}
</script>


