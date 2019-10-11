import RestfulDomainModel from '../base/RestfulDomainModel'
//这里方法触发去对应的controler
class Model extends RestfulDomainModel {
    async page(params){
    	return {
			content: [
				{
					id: 1,
					platform_gid: '21825651880@chatroom',
					group_name:"掌上喵🔥捡漏075群【禁广告】",
					_create_time:"2019-09-23 16:53:28",
					platform_uid:"xiaod9391",
					custom_id: 'xiaod9391',
					pid: '8336880_70475314',
					uid: '16'
				}
			],
			pageNo: 1,
			pageSize: 10,
			total: 1
		}
        //return await this.post(`${this.baseUrl}/page`, params);
    }
}

export default new Model([
    { id: { name: 'ID', dataOnly: true }}
], '/robot/message') //请求地址
