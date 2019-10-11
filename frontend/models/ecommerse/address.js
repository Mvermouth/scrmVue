import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {

}

export default new Model([
	{ id: { name: 'ID', dataonly: true }},
	{ consignee: { name: '收件人姓名' }},
	{ mobile: { name: '收件人手机' }},
	{ tel: { name: '固定电话', dataonly: true }},
	{ country: { name: '国家' }},
	{ state: { name: '省' }},
	{ city: { name: '城市' }},
	{ district: { name: '区域' }},
	{ address: { name: '地址' }},
	{ zipCode: { name: '邮编' }},
	{ email: { name: '邮箱' }}
], '/ecommerse/address')
