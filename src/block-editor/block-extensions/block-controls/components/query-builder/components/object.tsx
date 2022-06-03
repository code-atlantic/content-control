/** Internal Imports */
import BuilderRule from './rule';
import BuilderGroup from './group';

import classNames from 'classnames';

/** Type Imports */
import { BuilderObjectProps, QueryObject } from '../types';

function BuilderObject( {
	objectIndex,
	onChange,
	onDelete,
	logicalOperator,
	updateOperator,
	value: objectProps,
}: BuilderObjectProps< QueryObject > ) {
	const elementId = `query-builder-${ objectProps.type }--${ objectProps.id }`;

	const Wrapper = ( { children, className, ...wrapperProps } ) => {
		return (
			<div
				{ ...wrapperProps }
				// id={ elementId }
				onDrop={ ( event ) => {
					return false;
				} }
				className={ classNames( [
					'cc-condition-editor__object',
					className,
				] ) }
			>
				{ children }
			</div>
		);
	};

	switch ( objectProps.type ) {
		case 'rule':
			return (
				<BuilderRule
					objectWrapper={ Wrapper }
					objectIndex={ objectIndex }
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
					logicalOperator={ logicalOperator }
					updateOperator={ updateOperator }
				/>
			);
		case 'group':
			return (
				<BuilderGroup
					objectWrapper={ Wrapper }
					objectIndex={ objectIndex }
					onChange={ onChange }
					onDelete={ onDelete }
					value={ objectProps }
					logicalOperator={ logicalOperator }
					updateOperator={ updateOperator }
				/>
			);
	}
}

export default BuilderObject;
