const path = require('path')

/**
 * 打包变量默认值
 */
module.exports = env => {

    const PROD = env.NODE_ENV === 'production'

    return {

        // 前置插入页面的第三方样式
        prependStyles: [
    
            // 默认样式文件
            `theme_default.${PROD ? 'min' : 'dev'}.css`
        ],
    
        // 后置插入页面的第三方样式
        appendStyles: [],
    
        // 前置插入页面的第三方脚本
        prependScripts: [],
    
        // 后置插入页面的第三方脚本
        appendScripts: [],

        // 拷贝到发布目录的资源，但不插入页面
        copy: [

            // UEditor
            path.resolve(__dirname, '../vendors/ueditor')

        ]
    }
}

