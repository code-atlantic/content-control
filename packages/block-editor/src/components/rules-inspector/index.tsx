import { createSlotFill } from '@wordpress/components';
import { Children } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const { Fill, Slot } = createSlotFill( 'ContentControlBlockRules' );

type Props = React.PropsWithChildren< {} >;

export const RulesInspector = ( { children = [] }: Props ) => {
	return <Fill>{ children }</Fill>;
};

export const RulesInspectorSlot = ( props: Props ) => {
	const { children } = props;

	// TODO Left off here, need to make sure slot is rendered within provider.
	// Further need to export these and consume them internally.
	// Then test if they work in external plugin.

	return (
		<>
			<div className="cc_block-controls__block-rules-slot">
				{ Children.map( children, ( child, i ) => (
					<RulesInspector key={ i }>{ child }</RulesInspector>
				) ) }

				<Slot>
					{ /* @ts-ignore */ }
					{ ( fills ) => {
						return fills.length > 0 ? (
							fills
						) : (
							<p>
								{ __( 'No block currently selected.', 'app' ) }
							</p>
						);
					} }
				</Slot>
			</div>
		</>
	);
};

export default RulesInspectorSlot;
