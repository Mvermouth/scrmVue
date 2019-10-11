import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
	async deleteConfigs(params){
        return await this.post(`${this.baseUrl}/deleteConfigs`, {"ids":params});
    }
}

export default new Model([
], '/marketing/taskConfig') ///taskcenter/taskConfig /marketing/timeline
//最后面的字符川是请求zhi地址，【配置不知道司马鬼