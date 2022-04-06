
import WebComponent from '../WebComponent.js'

const props = [
    'name',
    'avatar'
]

const data = {
    'showInfo': true
}

export default class extends WebComponent {
    constructor() {
        super({ 
            componentUrl: import.meta.url,
            props,
            data
        })
    }
    static get observedAttributes() {
        return [ ...props ]
    } 
    nameUpdate( value ) {
        this.refs.title.innerText = value
    }
    avatarUpdate( value ) {
        this.refs.image.setAttribute( 'src', value )
    }
    toggleInfo() {
        this.data.showInfo = !this.data.showInfo
    }
}
