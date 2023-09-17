import { useState } from '@wordpress/element';

import {
	Button,
	Flex,
	FlexItem,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { cancelCircleFilled, check, edit } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

const LabelControl = ( { value, onChange } ) => {
	const [ editLabelText, setEditLabelText ] = useState( null );

	return (
		<div className="cc-query-builder-group-label">
			{ null === editLabelText ? (
				<Flex
					className="cc-query-builder-group-label__text"
					justify="left"
					align="center"
				>
					<FlexItem>
						<h4>
							{ value || __( 'Rule Group', 'content-control' ) }
						</h4>
					</FlexItem>
					<FlexItem>
						<Button
							variant="link"
							label={ __( 'Edit label', 'content-control' ) }
							icon={ edit }
							iconSize={ 16 }
							onClick={ () => setEditLabelText( value ?? '' ) }
							isSmall={ true }
							style={ { color: '#1d2327' } }
						/>
					</FlexItem>
				</Flex>
			) : (
				<div className="cc-query-builder-group-label__editor">
					<InputControl
						value={ editLabelText }
						onChange={ setEditLabelText }
						placeholder={ __( 'Group label', 'content-control' ) }
						suffix={
							<Flex
								className="cc-query-builder-label-editor__buttons"
								gap={ 0 }
							>
								<FlexItem>
									<Button
										disabled={ value === editLabelText }
										label={ __(
											'Save',
											'content-control'
										) }
										icon={ check }
										iconSize={ 20 }
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
										iconSize={ 20 }
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
		</div>
	);
};

export default LabelControl;
