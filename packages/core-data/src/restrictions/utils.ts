import type { ApiRestriction, Restriction } from './types';

/**
 * Get resuource path for various configs.
 *
 * @param {number} id Restriction id.
 * @return {string} Resulting resource path.
 */
export const getResourcePath = (
	id: Restriction[ 'id' ] | undefined = undefined
): string => {
	const root = `content-control/v2/restrictions`;

	return id ? `${ root }/${ id }` : root;
};

export const convertApiRestriction = ( {
	title,
	content,
	excerpt,
	...restriction
}: ApiRestriction ): Restriction => {
	const newRestriction = {
		...restriction,
		title: typeof title === 'string' ? title : title.raw,
		content: typeof content === 'string' ? content : content.raw,
		description: typeof excerpt === 'string' ? excerpt : excerpt.raw,
	};

	return newRestriction;
};

export const convertRestrictionToApi = ( {
	description,
	...restriction
}: Partial< Restriction > ): Partial< ApiRestriction > => {
	const newRestriction = {
		...restriction,
		excerpt: description,
	};

	return newRestriction;
};
