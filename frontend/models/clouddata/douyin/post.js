import RestfulDomainModel from '../../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
}

export default new Model([
    { aweme_id: { name: 'ID' } },
    { desc: { name: '描述' } },
    { create_time: { name: '创建时间' } },
    { mtime: { name: '记录更新时间' } },
    { ctime: { name: '记录创建时间' } }
], '/clouddata_douyin/post')
