/**
 * 路由功能模块
 */

// import()时需要添加注释指定chunkName
// import(/* webpackChunkName : "router" */'/path/to/router')
// 注意: babel 需要关闭 comments，否则注释会被trim

import Vue from 'vue'
import HybridRouter from '../../plugins/hybrid-router'

Vue.use(HybridRouter)

const createRouter = options => {
    App.router = new HybridRouter(options)
    return App.router
} 

export { createRouter, HybridRouter }