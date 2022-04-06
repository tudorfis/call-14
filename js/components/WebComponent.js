
const deepclone = obj => JSON.parse(JSON.stringify( obj ))

export default class extends HTMLElement {
    #finished = false

    constructor({ 
        templateContent = '',
        componentUrl = '',
        props = [],
        data = {}
    }) {
        super()
        
        this.templateContent = templateContent
        this.componentUrl = componentUrl
        this.props = props

        this.shadow = this.attachShadow({ mode: 'open' })
        this.storeData( data )
        this.init()
    }
    attributeChangedCallback(prop, oldValue, newValue) {
        if ( !this.#finished ) return

        const callbackFn = this[ `${ prop }Update`]
        console.log( 'asdsad', this[ `${ prop }Update`])

        if ( 
            callbackFn === undefined ||
            typeof callbackFn !== 'function' 
        ) return

        callbackFn.call( this, ...[newValue, oldValue] )
    }
    storeData( data ) {
        const vm = this

        this.data = new Proxy( deepclone( data ), {
            get( target, prop ) {
                const value = target[prop]
                return value                
            },
            set( target, prop, value ) {
                target[ prop ] = value
                vm.renderByProp( prop )
                return true
            }
        })
    }
    async init() {
        this.loaded = new Promise( resolve => {
            this.finishedLoading = resolve
        })

        if ( this.componentUrl ) {
            await this.import()
        }

        this.render()
    }
    async import() {
        const templateCss = this.componentUrl.replace( /js$/, 'css' )
        const templateHtml = this.componentUrl.replace( /js$/, 'html' )
        
        this.templateContent = `
            <style>${ await (await fetch( templateCss)).text() }</style>
            ${ await (await fetch( templateHtml)).text() }
        `
    }
    render() {
        const template = document.createElement( 'template' )
        template.innerHTML = this.templateContent
        
        this.shadow.innerHTML = ''
        this.shadow.appendChild( template.content.cloneNode( true ) )

        this.storeRefs()
        this.attachEvents()
        this.attachRenders()
        this.propsUpdate()
        this.callAfterRender()

        this.finishedLoading( this )
        this.#finished = true
    }
    propsUpdate() {
        this.props.forEach( prop => {
            if ( 
                this[ `${ prop }Update` ] === undefined ||
                typeof this[ `${ prop }Update` ] !== 'function' 
            ) return

            this[ `${ prop }Update` ]( this.attr( prop ) )
        })
    }
    callAfterRender() {
        this[ 'afterRender' ] ? this[ 'afterRender' ]() : void(0)
    }

    #refs = {}
    storeRefs() {
        this.qsa( '[ref]' ).forEach( element => {
            const refName = element.getAttribute( 'ref' )
            this.#refs[ refName ] = element
            element.removeAttribute( 'ref' )
        })
    }
    attachEvents() {
        [
            'click',
            'mouseover'
        ].forEach( eventName => {
            this.qsa( `[${ eventName }]` ).forEach( element => {
                const eventFn = element.getAttribute( eventName )
                
                if ( 
                    this[ eventFn ] === undefined ||
                    typeof this[ eventFn ] !== 'function'
                ) return

                element.addEventListener( eventName, e => {
                    this[ eventFn ].call( this, e )
                })

                element.removeAttribute( eventName )
            })
        })
    }

    #renders = {}
    #rendersConfig = {
        'show': function( vm, element, prop ) {
            element.style.display = vm.data[ prop ] ? '' : 'none'
        },
        'hide': function(  vm, element, prop ) {
            element.style.display = vm.data[ prop ] ? 'none' : ''
        },
    }
    attachRenders() {
        Object.keys( this.#rendersConfig ).forEach( binding => {
            this.#renders[ binding ] = {}

            this.qsa( `[${ binding }]` ).forEach( element => {
                const prop = element.getAttribute( binding )

                this.#renders[ binding ][ prop ] = this.#renders[ binding ][ prop ] || []
                this.#renders[ binding ][ prop ].push( element )

                this.#rendersConfig[ binding ]( this, element, prop )
            })
        })
    }
    renderByProp( prop ) {
        const arr = Object.keys( this.#renders ).map( key => {
            return [ key, this.#renders[ key ][ prop ] ]
        }).flat()

        while ( arr.length ) {
            const elements = arr.pop()
            const binding = arr.pop()

            elements.forEach( element => {
                this.#rendersConfig[ binding ]( this, element, prop )
            })
        }
    }

    get refs() {
        return this.#refs
    }
    qs( query ) {
        return this.shadow.querySelector( query )
    }
    qsa( query ) {
        return [ ...this.shadow.querySelectorAll( query ) ]
    }
    attr( attribute ) {
        return this.getAttribute( attribute )
    }
}