import { ReactTags, ReactTagsAPI } from 'react-tag-autocomplete';

import { store as coreDataStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { Post, Taxonomy } from '@wordpress/core-data';
import type { Tag } from 'react-tag-autocomplete';

import type {
	ObjectSelectFieldProps,
	PostSelectFieldProps,
	TaxonomySelectFieldProps,
	WithOnChange,
} from '../types';

type ObjectOption = {
	id?: string | number;
	slug?: string;
	name?: string;
};

const ObjectSelectField = ({
	value,
	onChange,
	...fieldProps
}: WithOnChange<
	ObjectSelectFieldProps | PostSelectFieldProps | TaxonomySelectFieldProps
>) => {
	const inputRef = useRef<ReactTagsAPI>(null);
	const {
		entityKind = 'postType',
		entityType = 'post',
		// multiple = false,
	} = fieldProps;

	const [queryText, setQueryText] = useState('');
	const [selected, setSelected] = useState<Tag[]>([]);

	const queryArgs = {
		search: queryText,
		per_page: 10,
	};

	const { options } = useSelect(
		(select) => ({
			options: select(coreDataStore).getEntityRecords(
				entityKind,
				entityType,
				queryArgs
			) as (Taxonomy<'view'> | Post<'view'>)[],
		}),
		[entityKind, entityType, queryText]
	);

	// const onSelect = ( chosen: string ) => {
	// 	setSelected( [ ...selected, chosen ] );
	// };

	/**
	 * Focus the input when this component is rendered.
	 */
	useEffect(() => {
		const firstEl = inputRef.current;

		if (null !== firstEl) {
			// ReactTags exposed method, not HTML .focus().
			firstEl.input.focus();
		}
	}, []);

	return (
		<div className="cc-rule-engine-search-box">
			<ReactTags
				placeholderText={__('Select a rule', 'content-control')}
				ref={inputRef}
				selected={options.map(
					({ id, slug, name }: ObjectOption, i) => ({
						value: id ?? slug ?? i,
						label: name ?? slug ?? '',
					})
				)}
				suggestions={options.map(
					({ id, slug, name }: ObjectOption, i) => ({
						value: id ?? slug ?? i,
						label: name ?? slug ?? '',
					})
				)}
				onInput={setQueryText}
				onAdd={(chosen: Tag) => {
					setSelected([...selected, chosen]);
				}}
				onDelete={(tagIndex: number) =>
					setSelected(
						selected.filter((_: any, i: number) => i !== tagIndex)
					)
				}
				allowNew={false}
				allowBackspace={true}
			/>
		</div>
	);
};

export default ObjectSelectField;
