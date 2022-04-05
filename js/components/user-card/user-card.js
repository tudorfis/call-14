import Component from '../Component.js'

const props = [
    'name',
    'avatar'
]
export default class extends Component {
    showInfo = true

    constructor() {
        super({ componentUrl: import.meta.url, props })
    }
    static get observedAttributes() {
        return [ ...props ]
    }
    afterRender() {
        this.propsUpdate()
        this.toggleInfoUpdates()
    }
    toggleInfoUpdates() {
        this.refs[ 'info' ].style.display = this.showInfo ? 'block' : 'none'
        this.refs[ 'toggle-btn' ].innerText = this.showInfo ? 'Hide info' : 'Show info'
    }
    toggleInfo() {
        this.showInfo = !this.showInfo
        this.toggleInfoUpdates()
    }
    nameUpdate( value ) {
        this.refs[ 'title' ].innerText = value
    }
    avatarUpdate( value ) {
        this.refs[ 'image' ].setAttribute( 'src', value )
    }
}
