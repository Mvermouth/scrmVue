import RestfulDomainModel from '../base/RestfulDomainModel'
import Employee from '../erp/employee'

class Model extends RestfulDomainModel {

	
}

export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ platformId: { name: '平台', dataOnly: true }}
], '/testxct/profile')
