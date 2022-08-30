const { restBase } = contentControlSettingsPage;

const restUrl = `${ wpApiSettings.root }${ restBase }/`;

export const fetch = (
	path: string,
	options: { [ key: string ]: any } = {}
) => {
	options.headers = {
		'Content-Type': 'application/json',
		'X-WP-Nonce': wpApiSettings.nonce,
	};

	if ( options.body ) {
		options.body = JSON.stringify( options.body );
	}

	// ensures things work with cors.
	options.credentials = 'same-origin';

	return {
		type: 'FETCH',
		path: `${ wpApiSettings.root }${ path }`,
		options,
	};
};

export default {
	FETCH( {
		path,
		options,
	}: {
		path: string;
		options: { [ key: string ]: any };
	} ) {
		return new Promise( ( resolve, reject ) => {
			window
				.fetch( path, options )
				.then( ( response ) => response.json() )
				.then( ( result ) => resolve( result ) )
				.catch( ( error ) => reject( error ) );
		} );
	},
};
