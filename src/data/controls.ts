const { restBase } = contentControlSettingsPage;

const restUrl = `${ wpApiSettings.root }${ restBase }/`;

type FetchOptions = { [ key: string ]: any };
type FetchArgs = {
	path: string;
	options: { [ key: string ]: any };
};

const fetchCredOpts = ( options: FetchOptions = {} ): RequestInit => ( {
	...options,
	headers: {
		...options.headers,
		'Content-Type': 'application/json',
		'X-WP-Nonce': wpApiSettings.nonce,
	},
	// ensures things work with cors.
	credentials: 'same-origin',
} );

export const fetch = ( path: string, options: FetchOptions = {} ) => {
	if ( options.body ) {
		options.body = JSON.stringify( options.body );
	}

	return {
		type: 'FETCH',
		path: `${ wpApiSettings.root }${ path }`,
		options: fetchCredOpts( options ),
	};
};

export const fetchWithCreds = (
	path: FetchArgs[ 'path' ],
	options: FetchArgs[ 'options' ]
) => {
	return new Promise( ( resolve, reject ) => {
		window
			.fetch( path, fetchCredOpts( options ) )
			.then( ( response ) => response.json() )
			.then( ( result ) => resolve( result ) )
			.catch( ( error ) => reject( error ) );
	} );
};

export default {
	FETCH( { path, options }: FetchArgs ) {
		return new Promise( ( resolve, reject ) => {
			window
				.fetch( path, options )
				.then( ( response ) => response.json() )
				.then( ( result ) => resolve( result ) )
				.catch( ( error ) => reject( error ) );
		} );
	},
};
