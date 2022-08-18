/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial } from 'lodash';

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import { NavigableMenu, TabbableContainer } from '@wordpress/components';
import { withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import TabButton from './tab-button';

type Tab = {
	name: string;
	title: string;
	className: string | string[];
	[ key: string ]: any;
};

type Props = {
	instanceId: string | number;
	orientation?: 'horizontal' | 'vertical';
	activeClass?: string;
	tabsClass?: string;
	tabClass?: string;
	className?: string | string[];
	tabs: Tab[];
	selected?: string | null;
	onSelect: ( tabKey: string ) => void;
	children: ( selected: Tab ) => React.ReactNode;
};

const TabPanel = ( {
	instanceId,
	orientation = 'horizontal',
	activeClass = 'is-active',
	tabsClass = 'tabs',
	tabClass = 'tab',
	className,
	tabs,
	selected,
	onSelect,
	children,
}: Props ) => {
	const selectedTab = tabs.find( ( t ) => selected === t.name ) || tabs[ 0 ];
	const selectedId = instanceId + '-' + selectedTab.name;

	const eventRef = useRef< React.KeyboardEvent< HTMLDivElement > >();

	const handleClick = ( tabKey: string ) => {
		onSelect( tabKey );
	};

	const onNavigate = ( nextIndex: number, focusedElement: HTMLElement ) => {
		console.log( nextIndex, focusedElement );

		const event = eventRef.current;
		if (
			event?.target instanceof Element &&
			event.target.getAttribute( 'role' ) === 'tab'
		) {
			event.preventDefault();
		}

		focusedElement.click();
	};

	const onKeyDown: React.KeyboardEventHandler< HTMLDivElement > = (
		event
	) => {
		// Stores the event for use in onNavigate. We don't need to persist the event
		// since onNavigate is called during the original onKeyDown event handler.
		eventRef.current = event;
	};

	return (
		<div
			className={ classnames( className, 'cc-' + orientation + '-tabs' ) }
		>
			<NavigableMenu
				role="tablist"
				onNavigate={ onNavigate }
				onKeyDown={ onKeyDown }
				className={ classnames( [
					tabsClass,
					'components-tab-panel__tabs',
				] ) }
			>
				{ tabs.map( ( tab ) => (
					<TabButton
						className={ classnames(
							tabClass,
							'components-tab-panel__tab',
							tab.className,
							{
								[ activeClass ]: tab.name === selectedTab.name,
							}
						) }
						tabId={ instanceId + '-' + tab.name }
						aria-controls={ instanceId + '-' + tab.name + '-view' }
						selected={ tab.name === selectedTab.name }
						key={ tab.name }
						onClick={ partial( handleClick, tab.name ) }
					>
						{ tab.title }
					</TabButton>
				) ) }
			</NavigableMenu>
			{ selectedTab && (
				<div
					aria-labelledby={ selectedId }
					role="tabpanel"
					id={ selectedId + '-view' }
					className="components-tab-panel__tab-content"
					tabIndex={ 0 }
				>
					{ children && children( selectedTab ) }
				</div>
			) }
		</div>
	);
};

export default withInstanceId( TabPanel );
