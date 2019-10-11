
export default class DomainModel {
    // 字段描述
    descriptor

    constructor(descriptor) {
    	this.descriptor = descriptor
    }

    get primaryKey() {
    	const field = this.descriptor ? this.descriptor.find(it => Object.values(it)[0].primaryKey) : null
    	return field ? Object.keys(field)[0] : 'id'
    }

    async page(pageNo, pageSize, filter, sort, shallow) {
    	throw new Error('not implemented!')
    }

    async retrieve(id) {
    	throw new Error('not implemented!')
    }

    async create(model) {
    	throw new Error('not implemented!')
    }

    async update(id, model) {
    	throw new Error('not implemented!')
    }

    async delete(id) {
    	throw new Error('not implemented!')
    }

    async batchRetrieve(ids) {
    	throw new Error('not implemented!')
    }

    async batchCreate(models) {
    	throw new Error('not implemented!')
    }

    async batchDelete(ids) {
    	throw new Error('not implemented!')
    }
}
