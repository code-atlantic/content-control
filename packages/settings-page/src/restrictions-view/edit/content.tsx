import RuleEngine from '@content-control/rule-engine';
import { __ } from '@wordpress/i18n';

import type { EditTabProps } from '.';

const ContentTab = ( { values, updateSettings }: EditTabProps ) => {
	return (
		<div className="content-tab">
			<h3>
				{ __(
					'Apply this restriction if the user views content that is:',
					'content-control'
				) }
			</h3>
			<p>
				{ __(
					'When users visit your site, the plugin will check the viewed content against your selection below and permit or deny access.',
					'content-control'
				) }
			</p>

			<RuleEngine
				value={ values.settings.conditions }
				onChange={ ( conditions ) =>
					updateSettings( {
						conditions,
					} )
				}
				options={ {
					features: {
						notOperand: true,
						groups: true,
					},
					rulesFilter: ( rule ) => {
						const context = Array.isArray( rule.context )
							? rule.context
							: rule.context.split( ' ' );

						// Only content rules for this editor.
						return context.indexOf( 'content' ) >= 0;
					},
				} }
			/>
		</div>
	);
};

export default ContentTab;
