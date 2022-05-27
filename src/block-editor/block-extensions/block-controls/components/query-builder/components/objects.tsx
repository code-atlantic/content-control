/** External Imports */
import classNames from 'classnames';
import update from 'immutability-helper';

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
			onDragOver={ ( event ) => {
				// Allow drop by adding this event.
				event.preventDefault();
				event.stopPropagation();
				event.dataTransfer.dropEffect = 'move';
			} }
			onDrop={ ( event ) => {
				event.preventDefault();
				event.stopPropagation();
				try {
					const currentTarget = event.currentTarget;
					const data = JSON.parse(
						event.dataTransfer.getData( 'text' )
					);

					onChange( {
						...query,
						objects: objects.filter(
							( object ) => key !== object.key
						),
					} );
					console.log( { ...event } );
				} catch ( $e ) {}
			} }
			onDragEnter={ ( event ) => {
				// event.preventDefault();
			} }
			onDragLeave={ ( event ) => {
				// event.preventDefault();
			} }
		>
			{ objects &&
				objects.map( ( object, i ) => (
					<BuilderObject
						objectIndex={ i }
						key={ object.key }
						logicalOperator={ logicalOperator }
						updateOperator={ updateOperator }
						onChange={ ( values ) => updateObject( values ) }
						onDelete={ () => removeObject( object.key ) }
						value={ object }
						// onMove={ moveObject }
					/>
				) ) }
		</div>
	);
};

export default BuilderObjects;
