type RestrictionsState = {
	restrictions: Restriction[];
};

interface RestrictionsStore {
	State: RestrictionsState;
	Selectors: typeof import('./selectors');
	Actions: typeof import('./actions');
}
