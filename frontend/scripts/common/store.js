/**
 * 存储模块
 */

// import()时需要添加注释指定chunkName
// import(/* webpackChunkName : "store" */'/path/to/store')
// 注意: babel 需要关闭 comments，否则注释会被trim

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const createStore = options => new Vuex.Store(options)

export { createStore, Vuex }