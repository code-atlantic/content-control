import { __ } from '@wordpress/i18n';

const { hasSettingsUpgrades, hasRestrictionUpgrades } =
	contentControlSettingsPage;

const HasUpgrades = ( props: { type: 'settings' | 'restrictions' } ) => {
	const { type } = props;

	const hasUpgrades =
		type === 'settings' ? hasSettingsUpgrades : hasRestrictionUpgrades;

	const message = () => {
		switch ( type ) {
			case 'settings':
				return __(
					'You have upgrades available for your plugin settings.',
					'content-control'
				);
			case 'restrictions':
				return __(
					'You have upgrades available for your restrictions.',
					'content-control'
				);
			default:
				return '';
		}
	};

	return (
		<>
			{ hasUpgrades && (
				<div className="has-upgrades">
					<span>
						{ message() }
						{ ' ⤴' }
					</span>
				</div>
			) }
		</>
	);
};

export default HasUpgrades;
