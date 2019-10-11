import { parsePath } from '../../util/path'
import { parseQuery, stringifyQuery } from '../../util/query'
import ViewComponent from './view.vue'

export default {
    name: 'SingleIframeRouterView',
    functional: true,
    render (_, { props, children, parent, data }) {
        // directly use parent context's createElement() function
        // so that components rendered by router-view can resolve named slots
        const h = parent.$createElement
        const name = 'default'
        const route = parent.$route
        const component  = ViewComponent
        const matched = (route.matched && route.matched[0]) || {instances: {}}

        // attach instance registration hook
        // this will be called in the instance's injected lifecycle hooks
        data.registerRouteInstance = (vm, val) => {
            // val could be undefined for unregistration
            const current = matched.instances[name]
            if ((val && current !== vm) || (!val && current === vm)) {
                matched.instances[name] = val
            }
        }
        
        // also register instance in prepatch hook
        // in case the same component instance is reused across different routes
        (data.hook || (data.hook = {})).prepatch = (_, vnode) => {
            matched.instances[name] = vnode.componentInstance
        }
        
        // resolve props
        let propsToPass = data.props = resolveProps(route, matched.props && matched.props[name])
        if (propsToPass) {
            // clone to prevent mutation
            propsToPass = data.props = extend({}, propsToPass)
            // pass non-declared props as attrs
            const attrs = data.attrs = data.attrs || {}
            for (const key in propsToPass) {
                if (!component.props || !(key in component.props)) {
                    attrs[key] = propsToPass[key]
                    delete propsToPass[key]
                }
            }
        }

        // pass iframe src
        const {path, query, hash} = parsePath(route.fullPath)
        const queryObj = parseQuery(query)
        delete queryObj._tgt
        const queryStr = stringifyQuery(queryObj)
        const src = path + queryStr + hash
        data.props = data.props || {}
        data.props.src = data.props.src || src

        return h(component, data, children)
    }
}

function resolveProps (route, config) {
    switch (typeof config) {
        case 'undefined':
            return
        case 'object':
            return config
        case 'function':
            return config(route)
        case 'boolean':
            return config ? route.params : undefined
        default:
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    false,
                    `props in "${route.path}" is a ${typeof config}, ` +
                    `expecting an object, function or boolean.`
                )
            }
    }
}

function extend (to, from) {
    for (const key in from) {
        to[key] = from[key]
    }
    return to
}
  