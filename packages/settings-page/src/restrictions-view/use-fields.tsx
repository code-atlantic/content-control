import { applyFilters } from '@wordpress/hooks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { restrictionsStore } from '@content-control/core-data';

import type { Restriction } from '@content-control/core-data';

export type FieldDef = {
	component: JSX.Element;
	id: keyof Restriction[ 'settings' ];
	priority: number;
};

const useFields = () => {
	// const { tab: currentTab } = useEditor();

	const { updateEditorValues: updateValues } =
		useDispatch( restrictionsStore );

	const { values = {} as Restriction } = useSelect(
		( select ) => ( {
			values: select( restrictionsStore ).getEditorValues(),
			isEditorActive: select( restrictionsStore ).isEditorActive(),
		} ),
		[]
	);

	const { settings } = values;

	/**
	 * Update settings for the given restriction.
	 *
	 * @param {Partial< Restriction[ 'settings' ] >} newSettings Updated settings.
	 */
	const updateSettings = useCallback(
		( newSettings: Partial< Restriction[ 'settings' ] > ) => {
			updateValues( {
				...values,
				settings: {
					...values?.settings,
					...newSettings,
				},
			} );
		},
		[ updateValues, values ]
	);

	const updateField = < T extends keyof Restriction[ 'settings' ] >(
		field: T,
		value: Restriction[ 'settings' ][ T ]
	) => {
		updateSettings( {
			[ field ]: value,
		} );
	};

	const fieldIsVisible = (
		field: keyof Restriction[ 'settings' ],
		tab: string
	): boolean => {
		/**
		 * Allow external overrides via a filter with null default.
		 *
		 * @param {boolean|undefined}       show     The current value of the field.
		 * @param {string}                  field    The field name.
		 * @param {Restriction['settings']} settings The current settings.
		 * @param {string}                  tab      The current tab name.
		 * @return {boolean|undefined} The new value of the field.
		 */
		const show = applyFilters(
			'contentControl.restrictionEditor.fieldIsVisible',
			undefined,
			field,
			settings,
			tab // Tab name.
		) as boolean | undefined;

		// If the filter returned a value, use it.
		return show !== undefined ? show : true;
	};

	/**
	 * Define the fields to show in each tab.
	 *
	 * This should only be done once, so we memoize the result.
	 */
	const tabFields = useMemo( () => {
		/**
		 * Allow external overrides via a filter with null default.
		 *
		 * @param {Record<string, FieldDef[]>} fields         The current fields.
		 * @param {Restriction['settings']}    values         The current settings.
		 * @param {Function}                   updateSettings The updateSettings function.
		 *
		 * @return {Record<string, FieldDef[]>} The new fields.
		 */
		return applyFilters(
			'contentControl.restrictionEditor.tabFields',
			{},
			settings,
			updateSettings
		) as Record< string, FieldDef[] >;
	}, [ settings, updateSettings ] );

	/**
	 * Get the fields to render.
	 *
	 * @param {string} tab The current tab name.
	 * @return {FieldDef[]} The field components.
	 */
	const getTabFields = ( tab: string ): FieldDef[] => {
		const fields = applyFilters(
			`contentControl.restrictionEditor.tabFields.${ tab }`,
			tabFields[ tab ] ?? []
		) as FieldDef[];

		return fields
			.sort( ( a, b ) => a.priority - b.priority )
			.filter( ( field ) => fieldIsVisible( field.id, tab ) )
			.map( ( field ) => {
				/**
				 * Allow external overrides via a filter with null default.
				 *
				 * @param {JSX.Element} component The current field component.
				 * @param {string}      id        The field name.
				 * @param {string}      tab       The current tab name.
				 * @return {JSX.Element} The new field component.
				 */
				const component = applyFilters(
					'contentControl.restrictionEditor.renderField',
					field.component,
					field.id,
					tab
				) as JSX.Element;

				return {
					...field,
					component,
				};
			} );
	};

	return {
		values,
		fieldIsVisible,
		getTabFields,
		updateSettings,
		updateField,
	};
};

export default useFields;
