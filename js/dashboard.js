
import { qs } from './utils/dom.utils.js'
import Login from './services/Login.js'
import Api from './services/Api.js'

document.saveElev = saveElev
Login.checkLogin()

////

async function saveElev() {
    const modalCreateElev = qs( '#js_create_elev' )

    const nume = qs( '#nume', modalCreateElev ).value
    const prenume = qs( '#prenume', modalCreateElev ).value
    const clasa = qs( '#clasa', modalCreateElev ).value
    const anul = qs( '#anul', modalCreateElev ).value

    const data = {
        nume,
        prenume,
        clasa,
        anul,
    }

    const response = await Api.post( 'saveElev', data )
    console.log( 'response', response )
}
