import { __ } from '@wordpress/i18n';
import ListView from '@components/list-view';

const RestrictionsTab = () => {
	const items = [
		{
			id: 1,
			label: 'Restriction Set 1',
		},
		{
			id: 2,
			label: 'Restriction Set 2',
		},
		{
			id: 3,
			label: 'Restriction Set 3',
		},
		{
			id: 4,
			label: 'Restriction Set 4',
		},
	];

	return (
		<>
			<ListView
				items={ items }
				columns={ { label: __( 'Label' ) } }
				sortableColumns={ [ 'label' ] }
			/>
		</>
	);
};

export default RestrictionsTab;
