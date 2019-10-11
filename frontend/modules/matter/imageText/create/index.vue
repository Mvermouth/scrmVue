<style lang="less" scoped>
    .addImage {
        width: 120px;
        height: 120px;
        border: 1px dashed #d9d9d9;
        text-align: center;
        line-height: 118px;
        cursor: pointer;
        color: #999
    }
    .submit-btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        padding-top: 10px;
        background: #f5f5f5;
        z-index: 10000
    }
</style>

<template>
    <div style="padding-bottom: 60px">
        <card>
            <i-form :model="forms" :rules="rules" :label-width="120" style="padding-top: 20px">
                <form-item label="标题" props="title">
                   <i-input class="w500" v-model="forms.name" placeholder="请输入消息标题"></i-input>
                </form-item>
                <form-item label="作者">
                    <i-input class="w500" v-model="forms.metadata.author" placeholder="请输入作者"></i-input>
                </form-item>
                <form-item label="摘要">
                    <i-input class="w500" v-model="forms.metadata.description" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入摘要"></i-input>
                </form-item>
                <form-item label="封面图片">
                    <!-- <div class="addImage" @click="add"><icon type="plus-round" :size="30"></icon></div> -->
                    <div v-for="(image) in forms.images" class="addImage" :key="image.id">
						<img :src="image" alt="商品图片"/>
					</div>
                    <div class="addImage select-icon" @click="() => selectors.image = true"><icon type="ios-plus-empty" :size="30"/></div>
					<select-image v-model="selectors.image" @on-selected-assets="onSelectProductImages"></select-image>
                </form-item>
				<form-item :label-width="0.01">
                	<vue-ueditor-wrap v-model="forms.detail" :config="editorConfig"></vue-ueditor-wrap>
				</form-item>
		    </i-form>
        </card>
        <div class="submit-btn" style="text-align: center"><i-button>取消</i-button><i-button type="primary" style="margin-left: 30px" :loading="loading" @click="submit">保存</i-button></div>
    </div>
</template>

<script>
import SelectImage from '../../../../views/asset/selectors/select-image'
import Asset from '../../../../models/matter/asset'
export default {
	components: {
        SelectImage
	},
	data() {
		return {
			editorConfig: {
				UEDITOR_HOME_URL: `${PUBLIC_PATH}ueditor/`,
				serverUrl: '/ueditor',
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
			forms: {
				name: '',
				metadata:{
                    author:'',
                    description:'',
                    detail:''
                },
                images: []
			},
			rules: {
				title: [
					{ required: true, message: '标题为必填项', trigger: 'blur' }
				]
            },
            loading:false,
			selectors: {
				image: false
			}
		}
	},
	methods: {
        async submit(){
            if(_.isEmpty(this.forms.images)){
                return
            }
            this.loading = true
            const asset = {
                name:this.forms.name,
                url: this.forms.images[0],
                metadata:this.forms.metadata,
                type:'imageText'
            }
            try {
                await Asset.create(asset)
                this.loading = false
                this.$Notice.success({
					title: '发布图文成功!',
					duration: 5
			    })
            } catch (error) {
                this.loading = false
                this.$Notice.error({
					title: '发布图文失败!',
					duration: 5
			    })
            }

        },
       	onSelectProductImages(assets) {
			this.forms.images = assets.map(it => it.url)
		},
	}
}
</script>

