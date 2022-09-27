export const remapFieldsArgs = ( args: OldFieldArgs ) => {
	const remappedKeys = {
		// old: 'new',
		classes: 'className',
		desc: 'help',
		as_array: 'asArray',
		allow_html: 'allowHtml',
	};

	const remappedFieldArgs = { ...args };

	Object.entries( remappedKeys ).forEach( ( [ oldKey, newKey ] ) => {
		if ( oldKey in remappedFieldArgs ) {
			remappedFieldArgs[ newKey ] = remappedFieldArgs[ oldKey ];
			delete remappedFieldArgs[ oldKey ];
		}
	} );

	return remappedFieldArgs;
};
