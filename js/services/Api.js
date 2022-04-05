
import Config from '../config/Config.js'

const Api = {
    async get( method, data ) {
        let url = Config.API_URL

        url += `?method=${ method }`

        for ( const name in data ) {
            const value = data[ name ]
            url += `&params[${ name }]=${ value }`
        }

        const request = await fetch( url )
        const json = await request.json()

        return json
    },
    async post( method, data ) {
        const searchParams = new URLSearchParams();
        searchParams.append( 'method', method )

        for ( const name in data ) {
            const value = data[ name ]
            searchParams.set( name, value )
        }

        const request = await fetch( Config.API_URL, {
            method: 'post',
            body: searchParams,
        })

        const json = await request.json()
        
        return json
    }
}

export default Api
