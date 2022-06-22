/** WordPress Imports */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cancelCircleFilled, check, edit } from '@wordpress/icons';
import { Button, TextControl } from '@wordpress/components';

const LabelControl = ( {
	value,
	onChange,
}: ControlledInputProps< string > ) => {
	const [ inputText, setInputText ] = useState< string | null >( null );

	return (
		<div className="cc-rule-engine-group-label">
			{ null === inputText ? (
				<div className="cc-rule-engine-group-label__text">
					<h3>{ value || __( 'Rule Group', 'content-control' ) }</h3>
					<Button
						label={ __( 'Edit label', 'content-control' ) }
						icon={ edit }
						iconSize={ 16 }
						onClick={ () => setInputText( value ?? '' ) }
					/>
				</div>
			) : (
				<div className="cc-rule-engine-group-label__editor">
					{ /* TODO Refactor this to not use Flex components */ }
					<TextControl
						value={ inputText }
						onChange={ setInputText }
						placeholder={ __( 'Group label', 'content-control' ) }
					/>
					<div className="buttons">
						<Button
							label={ __( 'Save', 'content-control' ) }
							className="save-button"
							icon={ check }
							iconSize={ 20 }
							onClick={ () => {
								onChange( inputText );
								setInputText( null );
							} }
							disabled={ value === inputText }
						/>
						<Button
							label={ __( 'Cancel', 'content-control' ) }
							className="cancel-button"
							icon={ cancelCircleFilled }
							iconSize={ 20 }
							onClick={ () => setInputText( null ) }
						/>
					</div>
				</div>
			) }
		</div>
	);
};

export default LabelControl;
