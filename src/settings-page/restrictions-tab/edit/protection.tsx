import { __ } from '@wordpress/i18n';
import { TextControl, Notice } from '@wordpress/components';

type Props = ContentControl.Settings.Restrictions.EditTabProps;

const ProtectionTab = ( { values, onChange, updateValue }: Props ) => {

	return (
		<>
			<TextControl
				label={ __( 'Restriction label', 'content-control' ) }
				hideLabelFromVision={ true }
				placeholder={ __( 'Condition set label', 'content-control' ) }
				value={ values.title }
				onChange={ ( title ) => updateValue( 'title', title ) }
			/>

			{ values.title.length <= 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ __( 'Enter a label for this set.', 'content-control' ) }
				</Notice>
			) }
		</>
	);
};

export default ProtectionTab;
