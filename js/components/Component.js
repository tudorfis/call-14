
export default class extends HTMLElement {
    #attr = {}
    #refs = {}
    #finished = false

    constructor({ 
        templateContent = '', 
        componentUrl = '',
        props = []
    }) {
        super()

        this.templateContent = templateContent
        this.componentUrl = componentUrl
        this.props = props
        
        this.shadow = this.attachShadow({ mode: 'open' })
        this.init()
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if ( !this.#finished ) return

        const callbackFn = this[ `${ name }Update`]

        if ( callbackFn !== undefined ) {
            callbackFn.call( this, ...[newValue, oldValue] )
        }
    }
    async init() {
        this.loaded = new Promise((resolve, reject) => {
            this.loadedResolve = resolve
            this.loadedReject = reject
        })

        if ( this.componentUrl ) {
            await this.import()
        }
        
        this.render()
    }
    async import() {
        const templateCss = this.componentUrl.replace( '.js', '.css' )
        const templateHtml = this.componentUrl.replace( '.js', '.html' )
        
        this.templateContent = `
            <style>${ await ( await fetch( templateCss  )).text() }</style>
            ${ await ( await fetch( templateHtml  )).text() }
        `
    }
    async render() {
        const template = document.createElement( 'template' )
        template.innerHTML = this.templateContent
        
        this.shadow.innerHTML = ''
        this.shadow.appendChild( template.content )
        
        this.storeRefs()
        this.attachEvents()
        this.callAfterRender()
        this.loadedResolve( this )

        this.#finished = true
    }
    callAfterRender() {
        this[ 'afterRender' ] ? this.afterRender() : void(0)
    }
    propsUpdate() {
        this.props.forEach( prop => {
            this[ `${ prop }Update` ]( this.attr( prop ) )
        })
    }
    storeRefs() {
        this.qsa( '[ref]' ).forEach( element => {
            const refName = element.getAttribute( 'ref' )
            this.#refs[ refName ] = element
            element.removeAttribute( 'ref' )
        })
    }
    attachEvents() {
        ;[
            'click',
            'mouseover'
        ].forEach( eventName => {
            this.qsa( `[${ eventName }]` ).forEach( element => {
                if ( !element ) return

                const eventFn = element.getAttribute( eventName )

                element.addEventListener( eventName, e => {
                    if ( this[ eventFn ] === undefined ) return

                    this[ eventFn ].call( this, e )
                })

                element.removeAttribute( eventName )
            })
        })
    }
    qs( query ) {
        return this.shadow.querySelector( query )
    }
    qsa( query ) {
        return [ ...this.shadow.querySelectorAll( query ) ]
    }
        
    get refs() {
        return this.#refs
    }
    attr( attrName ) {
        if ( !this.#attr[ attrName ] ) {
            this.#attr[ attrName ] = this.getAttribute( attrName )
        }

        return this.#attr[ attrName ]
    }
}