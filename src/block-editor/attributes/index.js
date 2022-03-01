/**
 * Add custom attributes for handling & targeting & visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
const controlAttributes = ( settings ) => {
	return {
		contentControls: {
			type: 'object',
			default: {
				enabled: false,
			},
		},
	};
};

export { controlAttributes };
