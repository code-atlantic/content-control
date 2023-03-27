import { Button, Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Section from '../settings-view/section';

const { pluginUrl } = contentControlSettingsPage;

const UpgradeView = () => {
	return (
		<Section title="Content Control Pro">
			<Flex>
				<FlexItem>
					<Flex direction="column" align="center" justify="center">
						<h3>{ __( 'Coming Soon!', 'content-control' ) }</h3>
						<p>
							{ __(
								'Content Control Pro will be available soon. Sign up for our newsletter to be notified when it is released.',
								'content-control'
							) }
						</p>
						<Button
							variant="primary"
							href="https://contentcontrolplugin.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							{ __( 'Learn More', 'content-control' ) }
						</Button>
					</Flex>
				</FlexItem>
				<FlexItem>
					<img
						src={ `${ pluginUrl }assets/images/pro-preview.svg` }
					/>
					<h3>{ __( 'Pro Features:', 'content-control' ) }</h3>
					<ul>
						<li>
							{ __(
								'Customize the block controls',
								'content-control'
							) }
						</li>
						<li>
							{ __(
								'Customize the block toolbar',
								'content-control'
							) }
						</li>
					</ul>
				</FlexItem>
			</Flex>
		</Section>
	);
};

export default UpgradeView;
