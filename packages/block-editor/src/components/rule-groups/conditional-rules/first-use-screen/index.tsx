import './index.scss';

import { Item, newGroup, newRule } from '@content-control/rule-engine';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

import { default as FirstUseIcon } from './first-use-icon';

type Props = {
	addItem: ( newItem: Item ) => void;
};

const FirstUseScreen = ( { addItem }: Props ) => {
	return (
		<div className="first-use-screen">
			<div className="first-use__flex-horizontal">
				<FirstUseIcon />
				<div className="first-use-screen__text">
					<strong>
						{ __( 'Content Control', 'content-control' ) }
					</strong>
					<h2>{ __( 'Conditional Logic', 'content-control' ) }</h2>
					<p>
						{ __(
							'Content Control is a powerful tool that allows you to control the visibility of content on your site. You can use it to hide content from specific users, show content to customers & more.',
							'content-control'
						) }
					</p>
					<Button
						variant="primary"
						href="https://contentcontrolpro.com/docs"
						target="_blank"
						text={ __( 'Get Started', 'content-control' ) }
					/>
				</div>
			</div>

			<div className="first-use__flex-horizontal">
				<div className="first-use-screen__add-rule">
					<h3>{ __( 'Conditions', 'content-control' ) }</h3>
					<p>
						{ __(
							'Add conditional rules to control the visibility of content.',
							'content-control'
						) }
					</p>
					<Button
						variant="link"
						onClick={ () => addItem( newRule() ) }
						icon={ plus }
					>
						{ __( 'Add condition', 'content-control' ) }
					</Button>
				</div>

				<div className="first-use-screen__add-group">
					<h3>{ __( 'Condition Groups', 'content-control' ) }</h3>
					<p>
						{ __(
							'Add group conditional rules for even finer control over visibility or for more complex scenarios.',
							'content-control'
						) }
					</p>
					<Button
						variant="link"
						onClick={ () => addItem( newGroup() ) }
						icon={ plus }
					>
						{ __( 'Add condition group', 'content-control' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default FirstUseScreen;
