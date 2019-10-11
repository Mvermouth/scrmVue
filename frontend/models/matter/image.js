import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {

}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ name: { name: '标题' }},
	{ url: { name: '图片链接地址' }}
], '/matter/image')
