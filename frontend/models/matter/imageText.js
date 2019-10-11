import RestfulDomainModel from '../base/RestfulDomainModel'
class Model extends RestfulDomainModel {

}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ title: { name: '标题' }},
	{ coverImageUrl: { name: '封面图片' }},
	{ abstract: { name: '摘要' }},
	{ ctime: { name: '创建时间' }}
], '/matter/imageText')
