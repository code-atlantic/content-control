import { check } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

const featureList = [
	{
		text: __(
			'Block Scheduling - Schedule blocks on specific dates & times or recurring days.',
			'content-control'
		),
	},
	{
		text: __(
			'Customize Login URLs - Point users to custom login and registration pages.',
			'content-control'
		),
	},
	{
		text: __( 'Custom User Restrictions:', 'content-control' ),
		items: [
			__( 'Go beyond logged in & user roles', 'content-control' ),
			__(
				'WooCommerce - Create membership sites, restrict content based on purchase history, cart contents, and more.',
				'content-control'
			),
			__(
				'EDD - Restrict access unless have an active license or subscription',
				'content-control'
			),
		],
	},
	{
		text: __( 'Advanced Block Rules:', 'content-control' ),
		items: [
			__(
				'Dozens of advanced rule types, no limits.',
				'content-control'
			),
			__(
				'Boolean Logic (AND, OR, NOT) - Create complex rules.',
				'content-control'
			),
			__(
				'WooCommerce rule types, inluding customer purchase history or subscription status.',
				'content-control'
			),
			__(
				'Easy Digital Downloads rule types, including cart contents & purchase history.',
				'content-control'
			),
			__(
				'Presets - Create and save rule presets for easy reuse (coming soon).',
				'content-control'
			),
			__(
				'Custom Breakpoints & Media Queries - Control responsive blocks. (coming soon)',
				'content-control'
			),
		],
	},
];

const UpgradeFeatures = () => {
	return (
		<div className="upgrade-features">
			<p
				dangerouslySetInnerHTML={ {
					__html: sprintf(
						// translators: %s: Upgrade link.
						__(
							'To unlock the following features, <a href="%s" target="_blank">upgrade to Pro</a> and enter your license key below.',
							'content-control'
						),
						'https://contentcontrolplugin.com/pricing/?utm_campaign=upgrade-to-pro&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-tab-upgrade-text'
					),
				} }
			/>

			<ul className="upgrade-notice__feature-list">
				{ featureList.map( ( { text, items } ) => (
					<li key={ text }>
						<Icon icon={ check } size={ 28 } />
						<strong>{ text }</strong>
						{ items && (
							<ul>
								{ items.map( ( item ) => (
									<li key={ item }>
										<Icon icon={ check } size={ 28 } />
										<span>{ item }</span>
									</li>
								) ) }
							</ul>
						) }
					</li>
				) ) }
			</ul>
		</div>
	);
};

export default UpgradeFeatures;
