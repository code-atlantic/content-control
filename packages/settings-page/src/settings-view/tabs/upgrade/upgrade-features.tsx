import { check } from '@wordpress/icons';
import { Flex, Icon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

const UpgradeFeatures = () => {
	return (
		<div className="upgrade-features">
			<p
				dangerouslySetInnerHTML={ {
					__html: sprintf(
						// translators: %s: Upgrade link.
						__(
							'To unlock the following features, <a href="%s" target="_blank">upgrade to Pro</a> and enter your license key above.',
							'content-control'
						),
						'https://contentcontrolplugin.com/pricing/?utm_campaign=upgrade-to-pro&utm_source=plugin-settings-page&utm_medium=plugin-ui&utm_content=license-tab-upgrade-text'
					),
				} }
			/>

			<Flex
				justify="flex-start"
				align="flex-start"
				wrap={ false }
				gap={ 10 }
			>
				<Flex direction={ 'column' } style={ { maxWidth: '40%' } }>
					<div className="upgrade-notice__feature">
						<h3>Monetizing Content Has Never Been So Easy</h3>
						<ul>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Content Teasers: </strong>Effortlessly
								create engaging, high-quality content teasers
								akin to those seen in the New York Times or WSJ.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>WooCommerce Integration: </strong>Build
								exclusive membership sites and tailor content
								access based on user purchase history, cart
								contents, and more.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Easy Digital Downloads: </strong>Limit
								access to users with active licenses or
								subscriptions, adding an extra layer of content
								protection.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Enhanced User Restrictions:</strong>
								Expand control beyond standard logins & user
								roles for more precise management.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Customized Login URLs: </strong>Redirect
								users seamlessly to tailored login and
								registration pages, enhancing user experience
								and site security.
							</li>
						</ul>
					</div>
				</Flex>

				<Flex direction={ 'column' } style={ { maxWidth: '40%' } }>
					<div className="upgrade-notice__feature">
						<h3>Advanced Block Controls:</h3>
						<ul>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Block Scheduling: </strong>Schedule
								content blocks for specific dates, times, or on
								a recurring basis, ensuring your site stays
								dynamic and relevant.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>WooCommerce Rules: </strong>Utilize
								rules based on customer purchase history or
								subscription status for targeted content
								delivery.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Easy Digital Download Rules: </strong>
								Manage content access based on digital cart
								contents and purchase history for a more
								personalized user experience.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>Boolean Logic: </strong>Employ AND, OR,
								NOT operations to create sophisticated and
								tailored content rules.
							</li>
							<li>
								<Icon icon={ check } size={ 28 } />
								<strong>More Rules: </strong>Advanced rule
								types, giving you unparalleled control over your
								content.
							</li>
						</ul>
					</div>
				</Flex>
			</Flex>
		</div>
	);
};

export default UpgradeFeatures;
