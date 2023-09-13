import { __ } from '@wordpress/i18n';
import type { Restriction } from './types';

/**
 * Checks of the set values are valid.
 *
 * @return {boolean} True when set values are valid.
 */
export const validateRestriction = (
	restriction: Restriction
):
	| boolean
	| {
			message: string;
			tabName?: string;
			field?: string;
			[ key: string ]: any;
	  } => {
	if ( ! restriction ) {
		return false;
	}

	if ( ! restriction.title.length ) {
		return {
			message: __(
				'Please provide a name for this restriction.',
				'content-control'
			),
			tabName: 'general',
			field: 'title',
		};
	}

	if (
		! restriction.settings?.conditions?.items?.length
	) {
		return {
			message: __(
				'Please provide at least one condition for this restriction.',
				'content-control'
			),
			tabName: 'content',
		};
	}

	return true;
};
