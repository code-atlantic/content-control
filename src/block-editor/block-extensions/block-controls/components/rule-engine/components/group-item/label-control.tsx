/** WordPress Imports */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cancelCircleFilled, check, edit } from '@wordpress/icons';
import {
	Button,
	Flex,
	FlexItem,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';

const LabelControl = ( {
	value,
	onChange,
}: ControlledInputProps< string > ) => {
	const [ inputText, setInputText ] = useState< string | null >( null );

	return (
		<div className="cc-rule-engine-group-label">
			{ null === inputText ? (
				<Flex
					className="cc-rule-engine-group-label__text"
					justify="left"
					align="center"
				>
					<FlexItem>
						<h3>
							{ value || __( 'Rule Group', 'content-control' ) }
						</h3>
					</FlexItem>
					<FlexItem>
						<Button
							variant="link"
							label={ __( 'Edit label', 'content-control' ) }
							icon={ edit }
							iconSize={ 16 }
							onClick={ () => setInputText( value ?? '' ) }
							isSmall={ true }
							style={ { color: '#1d2327' } }
						/>
					</FlexItem>
				</Flex>
			) : (
				<div className="cc-rule-engine-group-label__editor">
					{ /* TODO Refactor this to not use Flex components */ }
					<InputControl
						value={ inputText }
						onChange={ setInputText }
						placeholder={ __( 'Group label', 'content-control' ) }
						suffix={
							<Flex
								className="cc-rule-engine-label-editor__buttons"
								gap={ 0 }
							>
								<FlexItem>
									<Button
										disabled={ value === inputText }
										label={ __(
											'Save',
											'content-control'
										) }
										icon={ check }
										iconSize={ 20 }
										onClick={ () => {
											onChange( inputText );
											setInputText( null );
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
										iconSize={ 20 }
										onClick={ () => setInputText( null ) }
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
		</div>
	);
};

export default LabelControl;
