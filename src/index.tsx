// This file serves to declare global window vars. No imports needed.
import '';

/* Global Var Declarations */
declare global {
	const wpApiSettings: {
		root: string;
		nonce: string;
	};

	const contentControlRuleEngine: {
		adminUrl: string;
		registeredRules: Record< EngineRuleType[ 'name' ], EngineRuleType >;
	};
}
