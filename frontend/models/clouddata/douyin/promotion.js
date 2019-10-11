import RestfulDomainModel from '../../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
}
export default new Model([
    { promotion_id: { name: 'ID' } },
    { gid: { name: '商品id' } },
    { image: { name: '图片' } },
    { title: { name: '名称' } },
    { price: { name: '价格' } },
    { sales: { name: '全网销量' } },
    { elastic_type: { name: 'elastic_type' } },
    { promotion_source: { name: 'promotion_source' } },
    { mtime: { name: '更新时间' } },
    { ctime: { name: '创建时间' } }
], '/clouddata_douyin/promotion')
