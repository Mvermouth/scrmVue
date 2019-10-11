import RenderContent from './render-content'
import RenderForm from './render-form'
import Grid from './grid'
import ListForm from './list/form'
import ListPageLoader from './list/loader/page-loader'
import ListPaginator from './list/paginator'
import ListSelectionsDesc from './list/misc/selections-desc'
import ListActions from './list/misc/actions'
import ListTableView from './list/view/table-view'
import ListGridView from './list/view/grid-view'
import IconFont from './icon-font'
import RemoteSelect from './remote-select'
import RemoteCascader from './remote-cascader'
import limitWordNumTextarea from './limit-word-num-textarea'
import TagsInput from './tags-input'
import InputMoney from './input-money'
import ImAvatar from './im/im-avatar.vue'
import contactStatisticsInfoWidget from './im/contact-statistics-info-widget.vue'
import ImAccountInfoWidget from './im/im-account-info-widget.vue'
import ImContactInfoWidget from './im/im-contact-info-widget.vue'
import ImEmployeeInfoWidget from './im/im-employee-info-widget.vue'
import ImOrderInfoWidget from './im/im-order-info-widget.vue'
import ImDeviceInfoWidget from './im/im-device-info-widget.vue'
import ImAccountOwerInfoWidget from './im/im-account-ower-info-widget.vue'
import DmsDeviceInfo from './dms/dms-device-info.vue'
import DmsEmployeeInfo from './dms/dms-employee-info.vue'
import AddressCascader from './address-cascader'
import CategoryCascader from './category-cascader'
import inputNumberRange from './input-number-range'
import DescriptionList from './description-list'
import ReplyDetail from './autoreply/reply-detail.vue'
import Uploader from './uploader'

 

const components = {
	RenderContent,
	RenderForm,
	Grid,
	ListForm,
	ListPageLoader,
	ListPaginator,
	ListSelectionsDesc,
	ListActions,
	ListTableView,
	ListGridView,
	IconFont,
	RemoteSelect,
	RemoteCascader,
	limitWordNumTextarea,
	TagsInput,
	InputMoney,
	ImAvatar,
	contactStatisticsInfoWidget,
	ImAccountInfoWidget,
	ImContactInfoWidget,
	ImEmployeeInfoWidget,
	ImOrderInfoWidget,
	ImDeviceInfoWidget,
	ImAccountOwerInfoWidget,
	AddressCascader,
	inputNumberRange,
	DescriptionList,
	CategoryCascader,
	Uploader,
	DmsDeviceInfo,
	DmsEmployeeInfo,
	ReplyDetail
}

export default function registerComponents(Vue) {
	Object.keys(components).forEach(it => {
		Vue.component(it, components[it])
	})
}
