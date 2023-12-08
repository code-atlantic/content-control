import { __ } from '@wordpress/i18n';
import { Children } from '@wordpress/element';
import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill( 'ContentControlBlockRules' );

type Props = React.PropsWithChildren< {} >;

export const RulesInspector = ( { children = [] }: Props ) => {
	return <Fill>{ children }</Fill>;
};

export const RulesInspectorSlot = ( { children }: Props ) => {
	return (
		<>
			<div className="cc_block-controls__block-rules-slot">
				{ Children.map( children, ( child, i ) => (
					<RulesInspector key={ i }>{ child }</RulesInspector>
				) ) }

				<Slot>
					{ ( fills ) => {
						return fills ? (
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
