import { Status } from './constants';

/**
 * Get all restrictions.
 *
 * @param {RestrictionsState} state Current state.
 *
 * @return {Restriction[]} Restrictions.
 */
export const getRestrictions = ( state: RestrictionsState ): Restriction[] =>
	state.restrictions || [];

/**
 * Get current values for given restriction id.
 *
 * @param {RestrictionsState} state Current state.
 * @param {number}            id    Restriction ID.
 *
 * @return {Restriction} Restriction.
 */
export const getRestriction = (
	state: RestrictionsState,
	id: Restriction[ 'id' ] | null | undefined
): Restriction | undefined =>
	getRestrictions( state ).find( ( restriction ) => restriction.id === id );

/**
 * Check if the editor is active.
 *
 * @param {RestrictionsState} state Current state.
 *
 * @return {boolean} If editor is active.
 */
export const isEditorActive = ( state: RestrictionsState ): boolean => {
	const editorId = state?.editor?.id;

	if ( typeof editorId === 'string' && editorId === 'new' ) {
		return true;
	}

	return typeof editorId === 'number' && editorId > 0;
};

/**
 * Check if the editor is active.
 *
 * @param {RestrictionsState} state Current state.
 *
 * @return {number|"new"|undefined} If editor is active.
 */
export const getEditorId = ( state: RestrictionsState ): EditorID =>
	state?.editor?.id;

/**
 * Get current editor values.
 *
 * @param {RestrictionsState} state Current state.
 *
 * @return {Restriction|undefined} If editor is active.
 */
export const getEditorValues = (
	state: RestrictionsState
): RestrictionsState[ 'editor' ][ 'values' ] => state?.editor?.values;

/**
 * Get current status for dispatched action.
 *
 * @param {RestrictionsState} state      Current state.
 * @param {ActionNames}       actionName Action name to check.
 *
 * @return {string} Current status for dispatched action.
 */
export const getDispatchStatus = (
	state: RestrictionsState,
	actionName: ActionNames
): string | undefined => state?.dispatchStatus?.[ actionName ]?.status;

/**
 * Check if action is dispatching.
 *
 * @param {RestrictionsState}         state       Current state.
 * @param {ActionNames|ActionNames[]} actionNames Action name or array of names to check.
 *
 * @return {boolean} True if is dispatching.
 */
export const isDispatching = (
	state: RestrictionsState,
	actionNames: ActionNames | ActionNames[]
): boolean => {
	if ( ! Array.isArray( actionNames ) ) {
		return getDispatchStatus( state, actionNames ) === Status.Resolving;
	}

	let dispatching = false;

	for ( let i = 0; actionNames.length > i; i++ ) {
		dispatching =
			getDispatchStatus( state, actionNames[ i ] ) === Status.Resolving;

		if ( dispatching ) {
			return true;
		}
	}

	return dispatching;
};

/**
 * Check if action has finished dispatching.
 *
 * @param {RestrictionsState} state      Current state.
 * @param {ActionNames}       actionName Action name to check.
 *
 * @return {boolean} True if dispatched.
 */
export const hasDispatched = (
	state: RestrictionsState,
	actionName: ActionNames
): boolean => {
	const status = getDispatchStatus( state, actionName );

	return !! (
		status &&
		( [ Status.Success, Status.Error ] as string[] ).indexOf( status ) >= 0
	);
};

/**
 * Get dispatch action error if esists.
 *
 * @param {RestrictionsState} state      Current state.
 * @param {ActionNames}       actionName Action name to check.
 *
 * @return {string} Current error message.
 */
export const getDispatchError = (
	state: RestrictionsState,
	actionName: ActionNames
) => state?.dispatchStatus?.[ actionName ]?.error;
