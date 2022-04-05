
export function qs( query, element = document ) {
    return element.querySelector( query )
}

export function redirect( locationUrl, isAbsolute = false ) {
    const prefix = !isAbsolute ? './' : ''
    window.location = prefix + locationUrl
}
