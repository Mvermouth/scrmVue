import RestfulDomainModel from '../../base/RestfulDomainModel'

class Model extends RestfulDomainModel {
}
export default new Model([
    { id: { name: 'ID' } },
    { short_id: { name: '抖音号' } },
    { avatar_thumb: { name: '头像' } },
    { nickname: { name: '昵称' } },
    { follower_count: { name: '粉丝数' } },
    { live_commerce: { name: '是否商家' } },
    { wechat: { name: '微信' } },
    { signature: { name: '签名' } },
    { mtime: { name: '更新时间' } },
    { ctime: { name: '创建时间' } }
], '/clouddata_douyin/user')
