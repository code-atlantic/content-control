import { check } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

const featureList = [
	{
		text: __(
			'WooCommerce Integration - Create membership sites, drip content, and more',
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
		text: __( 'Advanced Block Rules:', 'content-control' ),
		items: [
			__(
				'Scheduling - Schedule blocks on specific dates & times.',
				'content-control'
			),
			__(
				'Boolean Logic (AND, OR, NOT) - Create complex rules.',
				'content-control'
			),
			__(
				'Presets - Create and save rule presets for easy reuse',
				'content-control'
			),
			__(
				'Custom Breakpoints & Media Queries - Control responsive blocks.',
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
						__(
							'To unlock the following features, <a href="%s" target="_blank">upgrade to Pro</a> and enter your license key below.',
							'content-control'
						),
						'https://contentcontrolplugin.com/pricing/?utm_campaign=admin&utm_source=licenses&utm_medium=pricing'
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
