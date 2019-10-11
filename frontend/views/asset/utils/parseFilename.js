export default filename => {
    let name = ''
    let fileType = ''
    const tokens = filename.split('.')
    if (tokens.length > 1) {
        fileType = tokens[tokens.length - 1] 
        tokens.splice(tokens.length - 1, 1)
        name = tokens.join('.')
    } else {
        name = filename
    }
    return {name, fileType}
}