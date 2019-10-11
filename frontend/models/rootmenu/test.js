import RestfulDomainModel from '../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
    async page(pageNo, pageSize, filter, sort) {
        // console.log(this.baseUrl);
        // var filter = {"deleted":{"NE":1}};
        // var pageNo = 1;
        // var pageSize = 1;
        // var sort = [];
        // return await this.post(`/search-srv/im_profile_views/page`, { pageNo, pageSize, filter, sort })
		return {"gg":"dw"}
	}
}

export default new Model([

], '/rootmenu/test')
