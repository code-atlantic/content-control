const { restBase } = contentControlSettingsPage;

const restUrl = `${ wpApiSettings.root }${ restBase }/`;

export async function getData(
	route: string,
	onSuccess: ( data: any, response: Response | null ) => void,
	onStatusChange: (
		newStatus: string,
		response: Response | null
	) => void = () => {}
) {
	onStatusChange( 'fetching', null );

	const response = await fetch( restUrl + route, { method: 'GET' } );

	if ( response.ok ) {
		const responseData = await response.json();
		onSuccess( responseData, response );
		onStatusChange( 'success', response );
	} else {
		onStatusChange( 'error', response );
	}
}

export async function sendData(
	route: string,
	data: { [ key: string ]: any },
	onSuccess: ( data: any, response: Response | null ) => void,
	onStatusChange: (
		newStatus: string,
		response: Response | null
	) => void = () => {}
) {
	onStatusChange( 'sending', null );

	const response = await fetch( restUrl + route, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': wpApiSettings.nonce,
		},
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify( data ),
	} );

	if ( response.ok ) {
		const responseData = await response.json();
		onSuccess( responseData, response );
		onStatusChange( 'success', response );
	} else {
		onStatusChange( 'error', response );
	}
}
