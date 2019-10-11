const path = require('path')

/**
 * 打包配置
 */
module.exports = env => {

    return {

        // 开发环境
        development: {
    
            // 打包资源输出路径
            outputPath: path.resolve(__dirname, '../../public/s'),
    
            // 生成页面输出路径
            pageOutputPath: {
                ejs: path.resolve(__dirname, '../../views/s'),
                html: path.resolve(__dirname, '../../public/s')
            },
    
            // 资源访问url路径，如cdn等
            publicPath: '/s/'
        },
    
        // 测试环境
        alpha: {
            outputPath: path.resolve(__dirname, '../../public/s'),
            pageOutputPath: {
                ejs: path.resolve(__dirname, '../../views/s'),
                html: path.resolve(__dirname, '../../views/s')
            },
            publicPath: '/s/'
        },
    
        // 生产环境
        production: {
            outputPath: path.resolve(__dirname, '../../public/s'),
            pageOutputPath: {
                ejs: path.resolve(__dirname, '../../views/s'),
                html: path.resolve(__dirname, '../../views/s')
            },
            publicPath: '/s/'
        }

    }[env.NODE_ENV]
}
