import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';

import {
	useEventSource,
	useEventSourceListener,
} from '@react-nano/use-event-source';

import './editor.scss';
import { clamp } from '@content-control/utils';
import classNames from 'classnames';

type StatusState = {
	total: number;
	progress: number;
	currentTask?: {
		name: string;
		total: number;
		progress: number;
	};
};

type SSEvent = {
	type:
		| 'upgrades:start'
		| 'upgrades:progress'
		| 'upgrades:complete'
		| 'task:start'
		| 'task:progress'
		| 'task:complete';
	data: {
		message?: string;
		status: StatusState;
	};
};

const statusStateDefaults = {
	total: 1,
	progress: 0,
	currentTask: undefined,
};

type UpgradeState = {
	running: boolean;
	done: boolean;
	redirectCountdown: number;
	logs: string[];
	showLogs: boolean;
	status: StatusState;
};

const { hasUpgrades, upgradeNonce, upgradeUrl } = contentControlSettingsPage;

const UpgradeView = () => {
	const timerRef = useRef< NodeJS.Timeout | null >( null );

	const [ upgradeState, setUpgradeState ] = useState< UpgradeState >( {
		running: false,
		done: false,
		redirectCountdown: -1,
		logs: [],
		showLogs: false,
		status: statusStateDefaults,
	} );

	const { running, done, redirectCountdown, logs, showLogs, status } =
		upgradeState;

	const [ eventSource ] = useEventSource(
		running ? `${ upgradeUrl }&nonce=${ upgradeNonce }` : '',
		true
	);

	useEventSourceListener(
		eventSource,
		[
			'upgrades:start',
			'upgrades:progress',
			'upgrades:complete',
			'task:start',
			'task:progress',
			'task:error',
			'task:complete',
		],
		( { type, data } ) => {
			const eventData = JSON.parse( data ) as SSEvent[ 'data' ];

			const { message = '', status } = eventData;

			const newState = {
				...upgradeState,
				status,
				logs: message.length ? [ ...logs, message ] : logs,
			};

			switch ( type ) {
				case 'upgrades:start':
				case 'upgrades:progress':
				case 'upgrades:complete':
				case 'task:start':
				case 'task:complete':
				case 'task:progress':
					if ( type === 'upgrades:complete' ) {
						// newState.done = true;
						// newState.redirectCountdown = 15;
						// Close the connection when the 'upgrades:complete' event is received
						eventSource?.close();
					}

					setUpgradeState( newState );
					break;

				case 'task:error':
				case 'error':
					console.log( 'Error:', message, eventData );
					setUpgradeState( {
						...newState,
						logs: [
							...logs,
							`ERROR: ${ message }`,
							JSON.stringify( eventData ),
						],
					} );
					break;

				default:
					console.log( 'Unknown event:', type );
					break;
			}
		},
		[ upgradeState ]
	);

	if ( ! hasUpgrades ) {
		return null;
	}

	const { total: totalTasks, progress: completedTasks, currentTask } = status;

	const { progress: completedTaskSteps = NaN, total: totalTaskSteps = NaN } =
		currentTask || {};

	useEffect( () => {
		if ( ! running ) {
			return;
		}

		if ( done && redirectCountdown >= 0 ) {
			timerRef.current = setTimeout( () => {
				if ( 0 === redirectCountdown ) {
					window.location.reload();
				} else {
					setUpgradeState( {
						...upgradeState,
						redirectCountdown: redirectCountdown - 1,
					} );
				}
			}, 1000 );
		}
	}, [ done, redirectCountdown ] );

	// Calculate the number of tasks that have been completed or are currently running
	const completedOrRunningTasks = completedTasks + 1;
	const uncompletedAfterCurrentTask = totalTasks - completedTasks - 1;

	// Calculate the percentage of the upgrade that is complete
	const upgradePercentage = clamp(
		( completedTasks / totalTasks ) * 100,
		0,
		100
	);

	const workingPercentage = clamp(
		( completedOrRunningTasks / totalTasks ) * 100,
		0,
		100
	);

	const taskPercentage = completedTaskSteps / totalTaskSteps;

	// Calculate the leftoffset, max width, and width of the task progress bar
	const taskLeftOffset = upgradePercentage;

	const taskFillMaxWidth = useMemo( () => {
		const taskRightOffset =
			( uncompletedAfterCurrentTask / totalTasks ) * 100;

		return 100 - taskLeftOffset - taskRightOffset;
	}, [ taskLeftOffset, uncompletedAfterCurrentTask, totalTasks ] );

	const taskFillWidth = useMemo(
		() => ( status.currentTask ? taskPercentage * taskFillMaxWidth : 0 ),
		[ taskPercentage, taskFillMaxWidth, status.currentTask ]
	);

	return (
		<div className="content-control-upgrades-panel">
			{ ! running ? (
				<div className="upgrade-notice">
					<div className="notice-icon">
						<img
							src={ `${ contentControlSettingsPage.pluginUrl }assets/images/illustration-check.svg` }
						/>
					</div>
					<div className="notice-content">
						<h2>
							{ __(
								'Content Control requires an upgrade to the database.',
								'content-control'
							) }
						</h2>
						<p>
							{ __(
								'Click the button below to start the upgrade process.',
								'content-control'
							) }
						</p>
					</div>

					<Button
						variant={ 'secondary' }
						onClick={ () => {
							setUpgradeState( {
								...upgradeState,
								running: true,
							} );
						} }
					>
						{ __( 'Start Upgrades', 'content-control' ) }
					</Button>
				</div>
			) : (
				<div className="upgrade-progress">
					<div className="upgrade-progress__header">
						<h3 className="upgrade-progress__title">
							{ __( 'Upgrade Progress', 'content-control' ) }
						</h3>
						<div className="upgrade-progress__task-percentage">
							{ done ? (
								<Button
									onClick={ () => {
										clearTimeout( timerRef.current ?? 0 );
										window.location.reload();
									} }
									variant="link"
								>
									{ `${ __(
										'Reload',
										'content-control'
									) } (${ redirectCountdown })` }
								</Button>
							) : (
								`${ Math.round( upgradePercentage ) }%`
							) }
						</div>
					</div>

					<div className="upgrade-progress__bar">
						<div
							className={ classNames(
								'upgrade-progress__bar__fill',
								'upgrade-progress__bar__fill--next',
								workingPercentage >= 100 ? 'complete' : ''
							) }
							style={ {
								width: `${ workingPercentage }%`,
							} }
						/>
						<div
							className={ classNames(
								'upgrade-progress__bar__fill',
								'upgrade-progress__bar__fill--current',
								upgradePercentage >= 100 ? 'complete' : ''
							) }
							style={ {
								// Set the width of the mid fill to the upgrade percentage of the est percentage after the task.
								width: `${ upgradePercentage }%`,
							} }
						/>
						<div
							className={ classNames(
								'upgrade-progress__bar__fill',
								'upgrade-progress__bar__fill--task',
								taskPercentage >= 1 ? 'complete' : ''
							) }
							style={ {
								left: `${ taskLeftOffset }%`,
								// Set the width of the front fill to the task percentage.
								width: `${ clamp( taskFillWidth, 0, 100 ) }%`,
							} }
						>
							<div className="task-progress">
								{ taskPercentage > 0
									? Math.round( taskPercentage * 100 )
									: 0 }
								%
							</div>
						</div>
					</div>

					<div className="upgrade-progress__logs__header">
						<div className="upgrade-progress__logs__header__status">
							{ logs[ logs.length - 1 ] }
						</div>

						<Button
							variant="link"
							onClick={ () => {
								setUpgradeState( {
									...upgradeState,
									showLogs: ! showLogs,
								} );
							} }
						>
							{ showLogs
								? __( 'Hide Logs', 'content-control' )
								: __( 'Show Logs', 'content-control' ) }
						</Button>
					</div>

					{ showLogs && (
						<div className="upgrade-progress__logs">
							<div className="upgrade-progress__logs__content">
								{ logs.map( ( log, index ) => (
									<div key={ index }>{ log }</div>
								) ) }
							</div>
						</div>
					) }
				</div>
			) }
		</div>
	);
};

export default UpgradeView;
