import _ from 'lodash'

/**
 * 设置表单项的默认值
 * 
 * @param {*} formItems 
 * @param {*} defaults 
 */
export function setFormItemsDefaults(formItems, defaults) {
    return formItems.map(it => {
        const item = _.cloneDeep(it)
        const value = _.get(defaults, it.prop)
        item.default = (value === undefined || value === null) ? item.default : value
        return item
    })
}