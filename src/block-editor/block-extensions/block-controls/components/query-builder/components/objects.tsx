/** External Imports */
import classNames from 'classnames';

/** Internal Imports */
import BuilderObject from './object';

/** Type Imports */
import {
	BuilderObjectsProps,
	Query,
	QueryLocigalOperator,
	QueryObject,
} from '../types';

const BuilderObjects = ( {
	type = 'group',
	query,
	onChange,
}: BuilderObjectsProps< Query > ) => {
	const { objects = [], logicalOperator } = query;

	const updateOperator = ( updatedOperator: QueryLocigalOperator ) =>
		onChange( {
			...query,
			logicalOperator: updatedOperator,
		} );

	const updateObject = ( updatedObject: QueryObject ) =>
		onChange( {
			...query,
			objects: objects.map( ( object ) =>
				object.key === updatedObject.key ? updatedObject : object
			),
		} );

	const removeObject = ( key: string ) =>
		onChange( {
			...query,
			objects: objects.filter( ( object ) => key !== object.key ),
		} );

	const moveObject = ( dragIndex: number, hoverIndex: number ) => {
		const draggedObject = objects[ dragIndex ];

		onChange(
			update( query, {
				objects: {
					$splice: [
						[ dragIndex, 1 ],
						[ hoverIndex, 0, draggedObject ],
					],
				},
			} )
		);
	};

	return (
		<div
			className={ classNames( [
				'cc__condition-editor__object-list',
				`cc__condition-editor__object-list--${ type }`,
			] ) }
		>
			{ objects &&
				objects.map( ( object, i ) => (
					<BuilderObject
						objectIndex={ i }
						key={ object.key }
						logicalOperator={ logicalOperator }
						updateOperator={ updateOperator }
						onChange={ ( values ) => updateObject( values ) }
						onDelete={ () => deleteObject( object.key ) }
						value={ object }
					/>
				) ) }
		</div>
	);
};

export default BuilderObjects;
