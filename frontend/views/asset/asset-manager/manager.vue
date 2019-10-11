<style lang="less" scoped>
.manager-layout {
  background: #f5f5f5;
  border: 1px solid #ccc;
  position: relative;
}
// .add-label {
// 	height: 30px;
// 	line-height: 30px;
// 	text-align: center
// }
</style>

<template>
  <div class="manager-layout">
    <row>
      <i-col span="4" style="padding: 20px 0">
        <label-manager :items="labels" :onItemSelect="onItemSelect"></label-manager>
        <!-- <div class="add-label">
					<i-button type="primary" size="small">添加标签</i-button>
        </div>-->
      </i-col>
      <i-col span="20" style="padding: 20px 10px; background: #fff">
        <domain-page ref="domainPage" v-bind="domainPageProps" @on-selected-rows="onSelectedRows"></domain-page>
        <Uploader
          ref="upload"
          url="/upload"
          :accept="accept"
          :multiple="true"
          @beforeUpload="_beforeUpload"
          @onProgress="_onUploadProgress"
          @onSuccess="_onUploadSuccess"
          @onError="_onUploadError"
          @onFormatError="_onFormatError"
          @onExceededSize="_onExceededSize"
        ></Uploader>
      </i-col>
    </row>
  </div>
</template>
<script>
import _ from "lodash";
import Asset from "../../../models/matter/asset";
import Tag from "../../../models/system/tag";
import DomainPage from "../../domain/page.vue";
import AssetWidget from "../widget";
import LabelManager from "../label-manager";

/**
 * 资源管理器
 */
export default {
  components: {
    DomainPage,
    AssetWidget,
    LabelManager
  },

  props: {
    // 是否开启上传
    enableUpload: {
      type: Boolean,
      required: false,
      default: true
    },

    // 上传资源的action配置，覆盖默认
    uploadAction: {
      type: Object,
      required: false
    },

    // 上传按钮文本，默认action时有效
    uploadText: {
      type: String,
      required: false,
      default: "上传素材"
    },

    // 上传按钮图标，默认action时有效
    uploadIcon: {
      type: String,
      required: false,
      default: "ivu-icon ivu-icon-ios-cloud-upload-outline"
    },

    /**
     * 开始上传回调
     *
     * 参数
     * 		file		iview upload的file实例
     * 返回
     * 		data		用户自定义数据
     */
    beforeUpload: {
      type: Function,
      required: false
    },

    /**
     * 上传进度回调
     *
     * 参数
     * 		event		iview upload的event事件
     * 		file		iview upload的file实例
     * 		uploadAsset	上传资源结构
     * 			{
     * 				file		// iview upload的file实例
     * 				progress	// 进度(0~100)
     * 				uploaded	// 已上传字节
     * 				error		// 上传错误信息
     * 				data		// 用户自定义数据
     * 				asset		// asset实例
     * 			}
     */
    onUploadProgress: {
      type: Function,
      required: false
    },

    /**
     * 上传成功回调
     *
     * 参数
     * 		result		上传结果信息
     * 		file		iview upload的file实例
     * 		uploadAsset	上传资源结构
     *
     * 返回
     * 		asset		asset实例
     */
    onUploadSuccess: {
      type: Function,
      required: false
    },

    /**
     * 上传失败回调
     *
     * 参数
     * 		result		上传结果信息
     * 		file		iview upload的file实例
     * 		uploadAsset	上传资源结构
     */
    onUploadError: {
      type: Function,
      required: false
    },

    /**
     * 上传异常回调
     *
     * 参数
     * 		error		异常
     * 		file		iview upload的file实例
     * 		uploadAsset	上传资源结构
     */
    onUploadException: {
      type: Function,
      required: false
    },

    /**
     * 文件格式错误
     *
     * 参数
     * 		error		异常
     * 		file		iview upload的file实例
     */
    onFormatError: {
      type: Function,
      required: false
    },

    /**
     * 文件超过大小限制
     *
     * 参数
     * 		error		异常
     * 		file		iview upload的file实例
     */
    onExceededSize: {
      type: Function,
      required: false
    },

    // 其它用户自定义的列表操作action
    actions: {
      type: Array,
      required: false,
      default() {
        return []; //[{delete: {unauthorize: true} }]
      }
    },

    // 过滤资源类型
    type: {
      type: [String, Array],
      required: false
    },

    // 尺寸规格 default|small
    size: {
      type: String,
      required: false,
      default: "default"
    },

    // 是否开启资源选择 true 多选|checkbox 多选|radio 单选|false 禁用选择
    selection: {
      type: [Boolean, String],
      required: false,
      default: false
    },

    // 资源筛选表单项
    formItems: {
      type: Array,
      required: false
    },

    // 资源筛选表单配置
    formProps: {
      type: Object,
      required: false,
      default() {
        return {
          labelWidth: 60,
          size: "small"
        };
      }
    },

    // 默认的资源筛选条件
    defaultCriterias: {
      type: Array,
      required: false
    },

    // 默认的资源排序规则
    defaultSort: {
      type: Array,
      required: false,
      default() {
        return [
          {
            ignoreCase: false,
            property: "ctime",
            type: "DSC"
          }
        ];
      }
    },
    uploadProps:{
      type:Object,
      required:true
    }
  },

  data() {
    return {
      // 上传中资源
      uploadAssets: [],
      accept: this.uploadProps.accept|| 'image/*',
      // 默认的上传操作
      defaultUploadAction: {
        unauthorize: true,
        type: "primary",
        title: this.uploadText,
        icon: this.uploadIcon,
        onAction: () => {
          this.upload();
        }
      },
      //所有标签
      labels: [{ id: "all", name: "全部" }],
      tag: "all"
    };
  },
  async mounted() {
    const tagPage = await Tag.page(
      1,
      20,
      [{ filterType: "EQ", property: "type", value: "asset" }],
      []
    );
    this.labels = _.concat(this.labels, tagPage.content);
  },
  computed: {
    // 资源筛选表单项
    domainFormItems() {
      const size = this.size;
      return (
        this.formItems || [
          {
            property: "name",
            filter: "LIKE",
            label: "名称",
            render(h) {
              return (
                <i-input
                  v-model={this.model}
                  placeholder="请输入"
                  size={size}
                />
              );
            }
          }
        ]
      );
    },

    // 资源默认查询条件
    domainCriterias() {
      if (this.defaultCriterias) return this.defaultCriterias;

      if (this.type) {
        const types = _.isArray(this.type) ? this.type : [this.type];
        return [
          {
            property: "type",
            filterType: "IN",
            value: types
          }
        ];
      }

      return [];
    },

    // 列表操作
    domainActions() {
      const actions = [];

      if (this.enableUpload) {
        if (this.uploadAction) {
          actions.push({ upload: this.uploadAction });
        } else {
          actions.push({ upload: this.defaultUploadAction });
        }
      }

      return [...actions, ...this.actions];
    },

    // 列表配置
    domainPageProps() {
      return {
        display: "grid",
        domain: Asset,
        loadPage: this.loadPage,
        actions: this.domainActions,
        renderGrid: (h, ctx) => {
          h = this.$createElement;
          return <asset-widget asset={ctx.row} />;
        },
        selection: this.selection,
        size: this.size,
        formItems: this.domainFormItems,
        formProps: this.formProps,
        defaultCriterias: this.domainCriterias,
        defaultSort: this.defaultSort,
        pageProps: {
          pageSizeOptions: [15],
          showElevator: true,
          showSizer: false
        },
        defaultPageSize: 15
      };
    }
  },

  methods: {
    async onItemSelect(item) {
      if (item.id === this.tag) {
        return;
      }
      this.tag = item.id;
      this.uploadAssets = [];
      this.$refs.domainPage.load();
    },
    /**
     * 查询素材列表数据
     */
    async loadPage(pageNo, pageSize, filter, sort) {
      // 列表刷新数据时，上传成功的后端已经记录，需要清理掉
      this.uploadAssets = this.uploadAssets.filter(it => !it.url && !it.error);
      // 在结果中追加上传中的素材
      if (this.tag !== "all") {
        filter.push({
          filterType: "EQ",
          property: "tags",
          value: this.tag
        });
      }
      const result = await Asset.page(pageNo, pageSize, filter, sort);
      if (pageNo === 1 && this.uploadAssets.length > 0) {
        result.content = this.uploadAssets.concat(result.content);
      }
      return result;
    },

    /**
     * 触发上传资源
     */
    upload() {
      this.$refs.upload.handleClick();
    },

    _beforeUpload(file) {
      const uploadAsset = {
        file,
        progress: 0,
        uploaded: 0,
        error: "",
        data: this.beforeUpload ? this.beforeUpload(file) : null,
        asset: null
      };
      this.uploadAssets.unshift(uploadAsset);
      this.$refs.domainPage.$refs.list.prepend(uploadAsset);
    },

    _onUploadProgress(event, file) {
      const uploadAsset = this.uploadAssets.find(
        it => it.file.uid === file.uid
      );
      uploadAsset.progress = event.percent;
      uploadAsset.uploaded = event.loaded;
      this.$refs.domainPage.$refs.list.replace(
        it => it === uploadAsset,
        uploadAsset
      );

      if (this.onUploadProgress)
        this.onUploadProgress(event, file, uploadAsset);
    },

    async _onUploadSuccess(result, file) {
      const uploadAsset = this.uploadAssets.find(
        it => it.file.uid === file.uid
      );
      if (result.code === 0) {
        const asset = this.onUploadSuccess(result, file, uploadAsset);
        asset.tags = [this.tag];
        uploadAsset.asset = await Asset.create(asset);
      } else {
        this.$Notice.error({
          title: `上传文件${file.name}失败: ${result.msg}`
        });
        uploadAsset.error = result.msg;
        if (this.onUploadError) this.onUploadError(result, file, uploadAsset);
      }
      this.$refs.domainPage.$refs.list.replace(
        it => it === uploadAsset,
        uploadAsset
      );
    },

    _onUploadError(error, file) {
      const uploadAsset = this.uploadAssets.find(
        it => it.file.uid === file.uid
      );
      uploadAsset.error = error;
      this.$Notice.error({
        title: `上传文件${file.name}失败: ${error.message}`
      });

      this.$refs.domainPage.$refs.list.replace(
        it => it === uploadAsset,
        uploadAsset
      );

      if (this.onUploadException)
        this.onUploadException(error, file, uploadAsset);
    },

    _onFormatError(file) {
      this.$Notice.error({ title: `文件${file.name}不是合法的格式` });
      if (this.onFormatError) this.onFormatError(error, file);
    },

    _onExceededSize(file) {
      this.$Notice.error({ title: `文件${file.name}大小超过限制` });
      if (this.onExceededSize) this.onExceededSize(error, file);
    },

    // 通知选中资源
    onSelectedRows(rows) {
      this.$emit("on-selected-assets", rows);
    }
  }
};
</script>

