type SearchArgs = {
	search: string;
	context?: 'view' | 'embed';
	page?: number;
	per_page?: number | string;
	type?: 'post' | 'term' | 'post-format' | string;
	subtype?: 'any' | 'post' | 'page' | 'category' | 'post_tag' | string;
	isInitialSuggestions?: boolean;
};

type SearchOptions = Omit< SearchArgs, 'search' | 'per_page' > & {
	perPage?: number;
};

type WPLinkSearchResult = {
	id: number;
	title: string;
	url: string;
	type: string;
};

type URLSearchQuery = {
	text: string;
	results: WPLinkSearchResult[];
	xtotal: number;
};

type URLSearchState = {
	currentQuery?: string;
	searchResults?: WPLinkSearchResult[];
	queries: Record< URLSearchQuery[ 'text' ], URLSearchQuery >;
	// Boilerplate
	dispatchStatus?: {
		[ Property in SettingsStore[ 'ActionNames' ] ]?: {
			status: string;
			error: string;
		};
	};
	error?: string;
};

interface URLSearchStore {
	StoreKey:
		| 'content-control/url-search'
		| typeof import('./index').STORE_NAME
		| typeof import('./index').store;
	State: URLSearchState;
	Actions: RemoveReturnTypes< typeof import('./actions') >;
	Selectors: OmitFirstArgs< typeof import('./selectors') >;
	ActionNames: keyof URLSearchStore[ 'Actions' ];
	SelectorNames: keyof URLSearchStore[ 'Selectors' ];
}
