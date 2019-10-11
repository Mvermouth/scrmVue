import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async bind(UDID) {
		return await this.post(`${this.baseUrl}/bind`, { UDID: UDID })
	}
	async unbind(id) {
		return await this.post(`${this.baseUrl}/unbind`, { id: id })
	}
	async updateDevicePreference(data) {
		return await this.post(`${this.baseUrl}/updateDevicePreference`, data)
	}
}
export default new Model([
	{ id: { name: 'ID', dataOnly: true }},
	{ UDID: { name: 'UDID', dataOnly: true }},
	{ ctime: { name: '录入系统时间', dataOnly: true }}
], '/dms/device')
