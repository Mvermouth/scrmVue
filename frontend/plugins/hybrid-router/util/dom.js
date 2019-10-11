import _ from 'lodash'

export const inBrowser = typeof window !== 'undefined'

export function matchesSelectorToParentElements (el, selector, baseNode) {
    let node = el
    
    const matchesSelectorFunc = [
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ].find(func => _.isFunction(node[func]))
    
    if (!_.isFunction(node[matchesSelectorFunc])) return false
    
    do {
        if (node[matchesSelectorFunc](selector)) return true
        if (node === baseNode) return false
        node = node.parentNode
    } while (node)
    
    return false
}