import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { chevronDown, chevronUp } from '@wordpress/icons';
import { Button, CheckboxControl, TextControl } from '@wordpress/components';
import { values } from 'lodash';

import './editor.scss';

type Props< T extends string | number > = {
	label?: string | React.ReactNode;
	placeholder: string;
	value: T[];
	options: { label: string; value: T; keywords?: string }[];
	onChange: ( value: T[] ) => void;
};

const SearchableMulticheckControl = < T extends string | number >( {
	label = '',
	placeholder = '',
	value = [],
	options = [],
	onChange = () => {},
}: Props< T > ) => {
	const [ searchText, setSearchText ] = useState< string >( '' );
	const [ sortDirection, setSortDirection ] = useState< 'ASC' | 'DESC' >(
		'ASC'
	);

	const isChecked = ( optValue: T ) => value.indexOf( optValue ) !== -1;
	const toggleOption = ( optValue: T ) => {
		onChange(
			isChecked( optValue )
				? [ ...value.filter( ( v ) => v !== optValue ) ]
				: [ ...value, optValue ]
		);
	};

	const filteredOptions = options.filter( ( { label, value, keywords } ) => {
		return (
			label.includes( searchText ) ||
			( typeof value === 'string' && value.includes( searchText ) ) ||
			( keywords && keywords.includes( searchText ) )
		);
	} );

	const sortedOptions = filteredOptions.sort( ( a, b ) => {
		if ( sortDirection === 'ASC' ) {
			return a.label > b.label ? 1 : -1;
		} else {
			return b.label > a.label ? 1 : -1;
		}
	} );

	return (
		<div className="component-searchable-multicheck-control">
			<TextControl
				label={ label }
				placeholder={ placeholder }
				value={ searchText }
				onChange={ setSearchText }
			/>

			<table>
				<thead>
					<tr>
						<th className="label-column">
							<Button
								text={ __( 'Name', 'content-control' ) }
								onClick={ () =>
									setSortDirection(
										'DESC' === sortDirection
											? 'ASC'
											: 'DESC'
									)
								}
								icon={
									'DESC' === sortDirection
										? chevronUp
										: chevronDown
								}
								iconPosition="right"
							/>
						</th>
						<td className="cb-column">
							{ __( 'Grant Access', 'content-control' ) }
						</td>
					</tr>
				</thead>
				<tbody>
					{ sortedOptions.map(
						( { label: optLabel, value: optValue } ) => (
							<tr key={ optValue.toString() }>
								<td>
									<span
										onClick={ () =>
											toggleOption( optValue )
										}
									>
										{ optLabel }
									</span>
								</td>
								<th className="cb-column">
									<CheckboxControl
										checked={ isChecked( optValue ) }
										onChange={ () =>
											toggleOption( optValue )
										}
									/>
								</th>
							</tr>
						)
					) }
				</tbody>
			</table>
		</div>
	);
};

export default SearchableMulticheckControl;
