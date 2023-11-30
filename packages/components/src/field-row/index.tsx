import './editor.scss';

/**
 * Render a field with custom label and description in a row based flexbox.
 */
const FieldRow = ( {
	id,
	label,
	description,
	className,
	children,
}: {
	label: string;
	id?: string;
	description?: string;
	className?: string;
	children: React.ReactNode;
} ) => (
	<div className={ `components-field-row ${ className }` }>
		<div className="components-base-control">
			<label
				htmlFor={ id }
				className="components-truncate components-text components-input-control__label"
			>
				{ label }
			</label>
			<p className="components-base-control__help">{ description }</p>
		</div>
		<div className="components-base-control__field">{ children }</div>
	</div>
);

export default FieldRow;
