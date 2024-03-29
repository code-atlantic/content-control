import classNames, { type Argument as ClassNameType } from 'classnames';

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
	className?: ClassNameType;
	children: JSX.Element;
} ) => (
	<div className={ classNames( [ 'components-field-row', className ] ) }>
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
