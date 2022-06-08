import { useState } from '@wordpress/element';

import {
	Button,
	Flex,
	FlexItem,
	Icon,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { cancelCircleFilled, check, edit } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const LabelControl = ( { value, onChange } ) => {
	const [ editLabelText, setEditLabelText ] = useState( null );

	return (
		<>
			{ null === editLabelText ? (
				<Flex justify="left" align="center">
					<FlexItem>
						<h4>
							{ value || __( 'Rule Group', 'content-control' ) }
						</h4>
					</FlexItem>
					<FlexItem
						style={ {
							paddingTop: 10,
						} }
					>
						<Button
							variant="link"
							label={ __( 'Edit label', 'content-control' ) }
							icon={ <Icon icon={ edit } size={ 18 } /> }
							onClick={ () => setEditLabelText( value ?? '' ) }
							isSmall={ true }
							style={ { color: '#1d2327' } }
						/>
					</FlexItem>
				</Flex>
			) : (
				<div style={ { margin: '0.875em 0' } }>
					<InputControl
						value={ editLabelText }
						onChange={ setEditLabelText }
						placeholder={ __( 'Group label', 'content-control' ) }
						suffix={
							<Flex gap={ 0 }>
								<FlexItem>
									<Button
										disabled={ value === editLabelText }
										label={ __(
											'Save',
											'content-control'
										) }
										icon={ check }
										onClick={ () => {
											onChange( editLabelText );
											setEditLabelText( null );
										} }
										isSmall={ true }
										style={ { color: 'green' } }
									/>
								</FlexItem>

								<FlexItem>
									<Button
										label={ __(
											'Cancel',
											'content-control'
										) }
										icon={ cancelCircleFilled }
										onClick={ () =>
											setEditLabelText( null )
										}
										isSmall={ true }
										style={ {
											color: 'lightcoral',
										} }
									/>
								</FlexItem>
							</Flex>
						}
					/>
				</div>
			) }
		</>
	);
};

export default LabelControl;
