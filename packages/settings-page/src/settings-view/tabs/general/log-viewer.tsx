import { useState, useEffect } from '@wordpress/element';
import { TextareaControl } from '@wordpress/components';

const { logUrl = false } = contentControlSettingsPage;

const LogViewer = () => {
	const [ logContent, setLogContent ] = useState( '' );

	useEffect( () => {
		if ( false === logUrl ) {
			return;
		}

		fetch( logUrl )
			.then( ( response ) => response.text() )
			.then( ( data ) => setLogContent( data ) )
			.catch( ( error ) => console.error( error ) );
	}, [] );

	return (
		<TextareaControl
			label="Log Contents"
			value={ logContent }
			onChange={ ( newContent ) => setLogContent( newContent ) }
		/>
	);
};

export default LogViewer;
