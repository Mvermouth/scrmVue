const path = require('path')

/**
 * 图标字体库配置
 */
module.exports = [

    // iview
    {
        name: 'ivu-icon',
        file: path.resolve(__dirname, '../../node_modules/iview/src/styles/common/iconfont/fonts/ionicons.ttf')
    },

    // fontawesome regular 
    {
        name: 'far',
        file: path.resolve(__dirname, '../vendors/fontawesome/webfonts/fa-regular-400.ttf')
    },

    // fontawesome solid
    {
        name: 'fas',
        file: path.resolve(__dirname, '../vendors/fontawesome/webfonts/fa-solid-900.ttf')
    },

    // fontawesome brands 
    {
        name: 'fab',
        file: path.resolve(__dirname, '../vendors/fontawesome/webfonts/fa-brands-400.ttf')
    },

    // iconfont
    {
        name: 'iconfont',
        file: path.resolve(__dirname, '../vendors/iconfont/iconfont.ttf')
    }

]