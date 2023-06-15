import { __ } from '@wordpress/i18n';
import { flushSync, useMemo, useReducer, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

import {
	useEventSource,
	useEventSourceListener,
} from '@react-nano/use-event-source';

import './editor.scss';
import { clamp } from '@content-control/utils';
import classNames from 'classnames';

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
		task?: string;
		progress?: number;
		total?: number;
	};
};

type UpgradeStatusState = {
	progress: number;
	total: number;
};

type TaskStatusState = {
	task: string;
	progress: number;
	total: number;
};

const messageReducer = ( state: SSEvent[], action: SSEvent ) => {
	return [ ...state, action ];
};

const UpgradeStatusDefaults = {
	progress: 0,
	total: 1,
};

const TaskStatusDefaults = {
	task: '',
	progress: 0,
	total: 1,
};

type UpgradeState = {
	started: boolean;
	logs: string[];
	showLogs: boolean;
	messages: SSEvent[];
	upgradeStatus: UpgradeStatusState;
	taskStatus: TaskStatusState;
};

const { hasUpgrades, upgradeNonce, upgradeUrl } = contentControlSettingsPage;

const UpgradeView = () => {
	const [ upgradeState, setUpgradeState ] = useState< UpgradeState >( {
		started: false,
		logs: [],
		showLogs: false,
		messages: [],
		upgradeStatus: UpgradeStatusDefaults,
		taskStatus: TaskStatusDefaults,
	} );

	const { started, logs, showLogs, messages, upgradeStatus, taskStatus } =
		upgradeState;

	const [ eventSource, eventSourceStatus ] = useEventSource(
		started ? `${ upgradeUrl }&nonce=${ upgradeNonce }` : '',
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

			const {
				message = '',
				task = '',
				progress = 0,
				total = 1,
			} = eventData;

			switch ( type ) {
				case 'upgrades:start':
					setUpgradeState( {
						...upgradeState,
						upgradeStatus: {
							...upgradeStatus,
							total,
							progress,
						},
						logs: [ ...logs, message ],
					} );
					break;

				case 'upgrades:progress':
					setUpgradeState( {
						...upgradeState,
						upgradeStatus: {
							...upgradeStatus,
							progress,
						},
						taskStatus: TaskStatusDefaults,

						logs: [ ...logs, message ],
					} );
					break;

				case 'upgrades:complete':
					setUpgradeState( {
						...upgradeState,
						upgradeStatus: {
							...upgradeStatus,
							progress: upgradeStatus.total,
						},
						taskStatus: TaskStatusDefaults,
						logs: [ ...logs, message ],
					} );
					break;

				case 'task:start':
					setUpgradeState( {
						...upgradeState,
						taskStatus: {
							...taskStatus,
							task,
							progress,
							total,
						},
						logs: [
							...logs,
							message.length
								? message
								: __( 'Starting: ', 'content-control' ) + task,
						],
					} );
					break;

				case 'task:progress':
					setUpgradeState( {
						...upgradeState,
						taskStatus: {
							...taskStatus,
							progress,
						},
					} );
					break;

				case 'task:error':
					setUpgradeState( {
						...upgradeState,
						logs: [ ...logs, `ERROR: ${ message }` ],
					} );
					break;

				case 'task:complete':
					setUpgradeState( {
						...upgradeState,
						taskStatus: {
							...taskStatus,
							progress: taskStatus.total,
						},
						logs: [ ...logs, message ],
					} );
					break;

				default:
					console.log( 'Unknown event:', type );
					break;
			}

			// Close the connection when the 'upgrades:complete' event is received
			if ( type === 'upgrades:complete' ) {
				eventSource?.close();
				console.log( 'EventSource connection closed.' );
			}
		},
		[ upgradeState ]
	);

	if ( ! hasUpgrades ) {
		return null;
	}

	const totalTasks = upgradeStatus.total;
	const completedTasks = upgradeStatus.progress;
	const completedOrRunningTasks = completedTasks + 1;
	const uncompletedTasks = totalTasks - completedTasks;
	const uncompletedAfterCurrentTask = uncompletedTasks - 1;

	const totalTaskSteps = taskStatus.total;
	const completedTaskSteps = taskStatus.progress;

	const upgradePercentage = completedTasks / totalTasks;
	const workingPercentage = completedOrRunningTasks / totalTasks;
	const taskPercentage = completedTaskSteps / totalTaskSteps;

	const workingFillWidth =
		completedTasks === totalTasks ? 0 : workingPercentage * 100;
	const completedFillWidth =
		completedTasks === totalTasks ? 100 : upgradePercentage * 100;

	const taskLeftOffset = useMemo(
		() => upgradePercentage * 100,
		[ completedOrRunningTasks, upgradePercentage ]
	);
	const taskRightOffset = ( uncompletedAfterCurrentTask / totalTasks ) * 100;
	const taskFillMaxWidth = 100 - taskLeftOffset - taskRightOffset;
	const taskFillWidth = taskStatus.task
		? taskPercentage * taskFillMaxWidth
		: 0;

	console.log( taskFillWidth );

	return (
		<div className="content-control-upgrades-panel">
			{ ! started ? (
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
								started: true,
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
							{ upgradePercentage > 0
								? Math.round( upgradePercentage * 100 )
								: 0 }
							%
						</div>
					</div>
					{ /*
					{ taskStatus.task && (
						<div className="upgrade-progress__task-name">
							{ taskStatus.task }
						</div>
					) } */ }

					<div className="upgrade-progress__bar">
						<div
							className={ classNames(
								'upgrade-progress__bar__fill',
								'upgrade-progress__bar__fill--next',
								workingPercentage >= 1 ? 'complete' : ''
							) }
							style={ {
								width: `${ clamp(
									// Set the width of the back fill to the est percentage after the task.
									workingFillWidth,
									0,
									100
								) }%`,
							} }
						/>
						<div
							className={ classNames(
								'upgrade-progress__bar__fill',
								'upgrade-progress__bar__fill--current',
								upgradePercentage >= 1 ? 'complete' : ''
							) }
							style={ {
								width: `${ clamp(
									// Set the width of the mid fill to the upgrade percentage of the est percentage after the task.
									completedFillWidth,
									0,
									100
								) }%`,
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
								// right: `${ taskRightOffset }%`,
								width: `${ clamp(
									// Set the width of the front fill to the task percentage.
									taskFillWidth,
									0,
									100
								) }%`,
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
