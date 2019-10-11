
import clickoutside from './clickoutside'
import emotion from './emotion'
const directives = {
    clickoutside,
    emotion
}

export default function registerDirectives(Vue) {
    Object.keys(directives).forEach(it => {
        Vue.directive(it, directives[it])
    })
}