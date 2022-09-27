const cleanRestrictionData = ( restriction: Restriction ) => {
	const { id, slug, status, title, description, settings } = restriction;

	return {
		id,
		slug,
		status,
		title,
		description,
		settings,
	};
};

export { cleanRestrictionData };
