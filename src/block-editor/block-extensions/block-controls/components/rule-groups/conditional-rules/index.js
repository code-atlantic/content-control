import { Button, Modal, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ConditionalRules = ( props ) => {
	const { groupRules, setGroupRules } = props;

	const [ modalOpen, toggleModal ] = useState( false );

	const { anyAll = 'all' } = groupRules;

	const toggleDeviceRule = ( device, hide ) => {
		setGroupRules( {
			...groupRules,
			hideOn: {
				...hideOn,
				[ device ]: !! hide,
			},
		} );
	};

	return (
		<>
			<SelectControl
				label={ __(
					'Conditionally render this block if…',
					'content-control'
				) }
				help={
					<Button
						variant="link"
						text={ __( 'Add conditions', 'content-control' ) }
						onClick={ () => toggleModal( true ) }
					/>
				}
				onChange={ ( value ) => {
					setGroupRules( {
						...groupRules,
						anyAll: value,
					} );
				} }
				value={ anyAll }
				options={ [
					{
						value: 'all',
						label: __( 'All condition are met', 'content-control' ),
					},
					{
						value: 'any',
						label: __(
							'Any conditions are met',
							'content-control'
						),
					},
				] }
			/>

			{ modalOpen && (
				<Modal onRequestClose={ () => toggleModal( false ) }>
					Content
				</Modal>
			) }
		</>
	);
};

export default ConditionalRules;
