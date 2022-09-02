/* WordPress Imports */
import { __ } from '@wordpress/i18n';

/* Internal Imports */
// TODO Migrate to @components.
import RuleEngine from '../../../block-editor/block-extensions/block-controls/components/rule-engine';

/* Type Imports */
import type { EditTabProps } from '.';

/* Global Var Imports */
const { registeredRules } = contentControlRuleEngine;

/** Filter rules for this context */
const restrictionRules = [ ...Object.values( registeredRules ) ];

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
					rules: restrictionRules,
				} }
			/>
		</div>
	);
};

export default ContentTab;
