export const formatToSprintf = ( format: string ) =>
	format
		.split( ' ' )
		.map( ( str: string ) => {
			switch ( str ) {
				case '{category}':
					return '%1$s';
				case '{verb}':
					return '%2$s';
				case '{label}':
					return '%3$s';
				default:
					return str;
			}
		} )
		.join( ' ' );
