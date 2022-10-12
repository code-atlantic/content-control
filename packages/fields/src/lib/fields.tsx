import Field from './field';

const Fields = ( props ) => {
	const { fields } = props;

	return (
		<>
			{ fields.map( ( field, i ) => (
				<Field key={ i } { ...field } />
			) ) }
		</>
	);
};

export default Fields;
