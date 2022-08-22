declare namespace ContentControl.Settings.Restrictions {
	type EditProps = {
		values: Restriction;
		onSave: ( values: Restriction ) => void;
		onClose: () => void;
	};

	type EditTabProps = EditProps & {
		onChange: ( values: Restriction ) => void;
		updateValue: < K extends keyof Restriction >(
			key: K,
			newValue: Restriction[ K ]
		) => void;
	};
}
