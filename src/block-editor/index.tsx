import './block-extensions';

/* Global Var Declarations */
declare global {
	const contentControlBlockEditorVars: {
		adminUrl: string;
		advancedMode: boolean;
		allowedBlocks: string[];
		excludedBlocks: string[];
	};
}
