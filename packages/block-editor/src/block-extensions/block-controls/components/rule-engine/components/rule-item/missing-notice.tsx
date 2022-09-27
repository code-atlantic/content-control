import { __, sprintf } from '@wordpress/i18n';

const MissingNotice = ( { name } ) => {
	return (
		<>
			<p>
				{ sprintf(
					/** translators: 1. name of the missing rule. */
					__(
						'Rule %s not found. Likely an error has occurred or extra rules may have been disabled.',
						'content-control'
					),
					name
				) }
			</p>
			<p>
				{ __(
					'Saving these block conditions now may result in loss of rule settings.',
					'content-control'
				) }
			</p>
		</>
	);
};

export default MissingNotice;
