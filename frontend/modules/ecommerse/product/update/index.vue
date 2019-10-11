<template>
    <div style="padding-bottom: 60px">
        <i-form ref="forms" :model="form" :rules="rules" :label-width="130" >
            <card class="card" :bordered="false">
                <p slot="title">商品信息</p>
                <div class="card-content">
                        <form-item label="商品名称" prop="name">
                            <i-input class="w500" v-model="form.name" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入商品标题"></i-input>
                        </form-item>
                        <form-item label="商品图片">
							<div v-for="(image, index) in form.productImages" class="addImage" :key="image.id">
								<img :src="image" alt="商品图片"/>
								<div class="upload-list-cover">
									<!-- <icon class="view" type="ios-eye-outline" @click.native="handleView(index)" :size="20"></icon> -->
                					<icon class="delete" type="ios-trash-outline" @click.native="handleRemove(index)" :size="20"></icon>
								</div>
							</div>
                            <div class="addImage select-icon" @click="() => selectors.productImage = true"><icon type="plus-round" :size="30"></icon></div>

							<select-image v-model="selectors.productImage" :multiple="true" @on-selected-assets="onSelectProductImages"></select-image>

                        </form-item>
                </div>
            </card>
            <card class="card">
				<div slot="title">
                	<Row type="flex" align="middle">
						<Col span="3">
							<p >价格/规格/库存</p>
						</Col>
						<Col span="20">
							<Alert show-icon v-if="warehouses.length>1" style="font-size:12px;">如果系统存在多个仓库时,编辑商品的时候无法更改库存信息,可在库存管理页面为商品分配库存</Alert>
						</Col>
					</Row>
				</div>
                <div class="card-content">
                    <form-item label="成本价" prop="costPrice">
                        <i-input class="w150" type="text" v-model="form.costPrice" Number>
                            <icon type="social-yen" slot="prepend"></icon>
                        </i-input>
                    </form-item>
                    <form-item label="销售价" prop="price">
                        <i-input class="w150" type="text" v-model="form.price" Number>
                            <icon type="social-yen" slot="prepend"></icon>
                        </i-input>
                    </form-item>
					<form-item v-if="form.spec==='one_spec'&&warehouses.length<=1" label="库存">
                        <i-input class="w300" type="text" v-model="form.quantity" number placeholder="请输入库存"></i-input>
                    </form-item>
                    <form-item label="商品编号">
                        <i-input class="w300" type="text" v-model="form.sn" placeholder="输入编号"></i-input>
                    </form-item>
                    <form-item label="规格" prop="spec">
						<radio-group v-model="form.spec">
							<radio label="one_spec">统一规格</radio>
							<radio label="more_spec">多规格</radio>
						</radio-group>
                    </form-item>
                    <form-item v-if="form.spec==='more_spec'" label="">
                        <more-spec-value :specs="specs" v-on:specsChanged="specsChanged"></more-spec-value>
                    </form-item>
                    <form-item v-if="form.spec==='more_spec'" label="价格库存">
                        <spec-warpper-table v-model="skus" :warehouses="warehouses" :specs="specs" ></spec-warpper-table>
                    </form-item>
                </div>
            </card>                                                                                                                                           
            <card class="card">
				<p slot="title">详情内容</p>
				<form-item :label-width="0.01">
					<vue-ueditor-wrap v-model="form.detail" :config="editorConfig"></vue-ueditor-wrap>
				</form-item>
            </card>
            <card class="card">
				<p slot="title">运费/其他</p>
                <div class="card-content" >
					<form-item label="商品品牌" prop="brandId">
                        <i-select v-model="form.brandId" class="w300">
        					<i-option v-for="brand in brandList" :value="brand.id" :key="brand.id">{{ brand.name }}</i-option>
  						</i-select>
                    </form-item>
                    <form-item label="商品分类">
                        <div>
                            <div><tag v-for="(item, index) in selectCategories" :key="`label_${index}`">{{item.name}}</tag></div>     
                            <div><i-button type="primary" @click="clickCategory">请选择分类</i-button></div>
                        </div>
                    </form-item>
                    <form-item label="商品标签" prop="tags">
                        <checkbox-group v-model="form.tags">
                            <checkbox label="热销"></checkbox>
                            <checkbox label="活动"></checkbox>
                            <checkbox label="清仓"></checkbox>
                            <checkbox label="新品"></checkbox>
                            <checkbox label="其他"></checkbox>
                        </checkbox-group>
                    </form-item>
					<!-- <form-item label="开售时间" >
                            <radio-group v-model="form.sale" vertical>
                                <radio label="onSale">立即开售</radio>
                                <radio label="notSale">开售时间 <date-picker v-model= "form.onsaleTime" :disabled="form.sale===true" type="datetime" placeholder="请选择开售时间" style="width: 200px"></date-picker></radio>
                            </radio-group>
                    </form-item> -->
                    <form-item label="上架状态">
                            <radio-group v-model="form.onSale">
                                <radio label="onSale">是</radio>
                                <radio label="notSale">否</radio>
                            </radio-group>
                    </form-item>
                </div>
            </card>
        </i-form>
        <div class="submit-btn" style="text-align: center"><i-button>取消</i-button><i-button type="primary" style="margin-left: 30px" :loading="loading" @click="updateProduct">保存</i-button></div>
    </div>
</template>

<script>
import MoreSpecValue from '../create/components/more-spec-value.vue'
import SpecWarpperTable from '../create/components/spec-warpper-table.vue'
import Product from '../../../../models/ecommerse/product'
import Brand from '../../../../models/ecommerse/brand'
import SelectCategory from '../create/components/select-category.vue'
import SelectImage from '../../../../views/asset/selectors/select-image'

import AppProxy from "../../../../scripts/common/appProxy"
import AppRoutes from "../../../../configs/AppRoutes"

import Warehouse from '../../../../models/ecommerse/warehouse.js'
const data = App.data.domain
export default {
	components: {
		MoreSpecValue,
		SpecWarpperTable,
		SelectCategory,
		SelectImage
	},
	data() {
		const specType = data.specs && data.specs.length >= 1 ? 'more_spec' : 'one_spec'
		let quantity = ''
		if(specType === 'one_spec' ){
			quantity = data.productSkus[0].quantity
		}
		return {
			warehouses: [],
			form: {
				id: data.id,
				name: data.name,
				productImages: data.imgs,
				costPrice:data.costPrice,
				price: data.price,
				quantity: quantity,
				brandId: data.brand? data.brand.id :'',
				spec: specType,
				sale: data.sale || true,
				onsaleTime: data.onsaleTime,
				onSale: data.onSale ? 'onSale' : 'notSale',
				tags: data.tags,
				detail: '',
				sn: data.sn||""

			},
			rules: {
				name: [
					{ required: true, message: '商品名称不能为空', trigger: 'blur' }
				],
				costPrice: [
					{pattern: /^[0-9]+.?[0-9]*/, message:'请输入合法的数字', trigger: 'change'},
					{pattern: /^[0-9]+.?[0-9]*/, message:'请输入合法的数字', trigger: 'blur'}
				],
				price: [
					{pattern: /^[0-9]+.?[0-9]*/, message:'请输入合法的数字', trigger: 'change'},
					{pattern: /^[0-9]+.?[0-9]*/, message:'请输入合法的数字', trigger: 'blur'}
				]
			},
			specs: data.specs,
			skus: data.productSkus,
			oldSkus:_.cloneDeep(data.productSkus), // 记录原始的sku
			editorConfig: {
				UEDITOR_HOME_URL: `${PUBLIC_PATH}ueditor/`,
				serverUrl: '/ueditor',
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
			loading: false,
			brandList: [],
			selectCategories: _.map(data.categorys, it => { return { id: it.id, name: it.name } }),
			selectors: {
				productImage: false
			}
		}
	},
	watch: {
		specs: {
			handler(val) {
			},
			deep: true
		},
		skus: {
			handler(val) {

			},
			deep: true
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		async init() {
			this.specs = _.map(data.specs, (it) => {
				return {
					id: it.id,
					name: it.name,
					isHaveImg: false,
					value: it.value,
					allowed: false
				}
			})
			const page = await Warehouse.pageNoAuth(1, 100,[{filterType:'EQ',property:'deleted',value:false}])
			this.warehouses = page.content
			// 加载品牌列表
			this.initBrandList()

		},
		async initBrandList() {
			const brandPage = await Brand.pageNoAuth(1, 100, [], [], true)
			this.brandList = brandPage.content
		},
		//改变规格
		specsChanged(val) {
			console.log("value:",val)
			this.specs = val.filter(it => !!it.id)
		},
		async updateProduct() {
			this.specs = this.specs.filter(it => !!it.id)
			if(this.form.name === '') {
				this.$Notice.error({title: '商品标题不能为空'})
				return 
			}
			if(_.isEmpty(this.form.productImages)) {
				this.$Notice.error({title: '至少上传一张商品图片'})
				return 
			}
			if(this.form.spec === 'one_spec' && this.form.price === '') {
				this.$Notice.error({title: '销售价格不能为空'})
				return 
			}

			if(this.form.spec === 'one_spec' && this.warehouses.length<=1 && this.form.quantity === '') {
				this.$Notice.error({title: '请为统一规格的商品填写库存'})
				return 
			}

			if (this.form.spec === 'more_spec' && this.skus.length === 0) {
				this.$Notice.error({ title: '您选择了多规格，请完善多规格的SKU信息!' })
				return
			}
			if (this.form.spec === 'more_spec' && this.skus.length === 0) {
				this.$Notice.error({ title: '您选择了多规格,你还未选择规格值!' })
				return
			}
			const sku = this.skus.find(it => (!_.isNumber(parseFloat(it.price))||!_.isNumber(parseInt(it.quantity))))
			if(sku){
				this.$Notice.error({ title: 'SKU中价格或者库存设置不正确!' })
				return
			}
			this.loading = true
			const params = {
				id: this.form.id,
				name: this.form.name,
				sn: this.form.sn,
				image:this.form.productImages[0],
				imgs: this.form.productImages,
				costPrice: this.form.costPrice,
				price: this.form.price,
				categories: this.selectCategories.map(it => { return it.id }),
				brandId: this.form.brandId,
				isFutureSold: this.form.isFutureSold,
				onsaleTime: this.form.onsaleTime,
				tags: this.form.tags,
				onSale: this.form.onSale === 'onSale',
			}
			let body
			if(this.form.spec === 'one_spec') {
				// 当原始就是默认规格时，还是已默认规格更新时
				let sku = null
				if(this.oldSkus.length === 1){
					sku = this.oldSkus[0]
				}else{
					sku = this.skus[0]
				}
				body = {
					product: params,
					skus: [{
						id : sku ? sku.id : null, 
						price: this.form.price,
						quantity: this.form.quantity
					}]
				}
			}else {
				const specs = this.specs.map(it=> {
					return {
						id: it.id,
						value: it.value
					}
				})
				body = {
					product: params,
					skus: this.skus,
					specs: specs
				}
			}
			try {	
				await Product.update(body)
				this.$Notice.success({
					title: '编辑商品成功!',
					duration: 5
				})
				this.loading = false

				AppProxy.do_push(AppRoutes.Product.page());
				setTimeout(()=>{
					App.event.$emit(Product.events.Update)
				},300);

			}catch(e) {
				this.$Notice.error({
					title: '商品编辑失败!',
					duration: 5
				})
				this.loading = false
			}
			
		},
		clickCategory() {
			App.modal({
				title: '选择分类',
				width: 'large',
				render: () => {
					return <select-category category={this.selectCategories} ></select-category>
				},
				onOk: selectCategory => {
					this.selectCategories = selectCategory.submit()
				}
			})
		},
		onSelectProductImages(assets) {
			this.form.productImages = assets.map(it => it.url)
		},
		handleRemove(index) {
			this.form.productImages.splice(index, 1)
		}
	}
}
</script>

