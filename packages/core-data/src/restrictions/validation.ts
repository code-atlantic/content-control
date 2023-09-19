import { __ } from '@wordpress/i18n';
import type { Restriction } from './types';

/**
 * Checks of the set values are valid.
 *
 * @param {Restriction} restriction Restriction to validate.
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
		! restriction.settings?.conditions?.items?.length &&
		restriction.status === 'publish'
	) {
		return {
			message: __(
				'Please provide at least one condition for this restriction before enabling it.',
				'content-control'
			),
			tabName: 'content',
		};
	}

	return true;
};
