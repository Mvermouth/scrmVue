const fs = require('fs')
const path = require('path')
const md5File = require('md5-file')
const findParentDir = require('find-parent-dir')

/**
 * 收集资源信息
 * 
 * @param {String} file
 */
const collectAssetInfo = file => {
    // 文件信息
    let stat = null
    try { stat = fs.statSync(file) } catch(e) {}

    // 文件版本
    const version = stat && stat.isFile() ? collectAssetVersion(file) : ''

    return {stat, version, file}
}

/**
 * 计算文件版本
 * 
 * @param {*} file 
 */
const collectAssetVersion = file => {

    let version = ''

    if (file.match(/node_modules\//)) {
        // 查询到package.json获取版本信息
        try {
            const dir = findParentDir.sync(path.dirname(file), 'package.json')
            if (dir) {
                version = require(path.join(dir, 'package.json')).version
            }
        } catch (e) {}
    }

    // 文件md5作为版本信息
    if (!version) {
        version = md5File.sync(file)
    }

    return version
}

module.exports = {
    collectAssetInfo,
    collectAssetVersion
}