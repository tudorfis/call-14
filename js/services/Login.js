import { redirect } from '../utils/dom.utils.js'
import Api from './Api.js'

const Login = {
    async checkLogin() {
        const token = sessionStorage.getItem( 'token' )
    
        if ( !token ) {
            redirect( 'login.html' )
        }
        
        const data = {
            token
        }
    
        const response = await Api.get( 'checkLogin', data )
    
        if ( !response.valid ) {
            redirect( 'login.html' )
        }
    }
}

export default Login