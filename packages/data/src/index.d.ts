/* Broken @wordpress/data type overrides */
declare module '@wordpress/data' {
	function createRegistry(
		storeConfigs?: Object,
		parent?: Object | null
	): {
		registerGenericStore: Function;
		registerStore: Function;
		subscribe: Function;
		select: Function;
		dispatch: Function;
		register: Function;
		registerStoreInstance: Function;
	};
}
