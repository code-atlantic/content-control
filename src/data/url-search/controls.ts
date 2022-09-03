import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import { getResourcePath } from './utils';

export const fetchLinkSuggestions = (
	search: string,
	searchOptions: SearchOptions = {}
) => {
	return {
		type: 'FETCH_LINK_SUGGESTIONS',
		search,
		searchOptions,
	};
};

export default {
	async FETCH_LINK_SUGGESTIONS( {
		search,
		searchOptions = {},
		settings = { disablePostFormats: false },
	}: {
		search: string;
		searchOptions: SearchOptions;
		settings: { [ key: string ]: any };
	} ): Promise< WPLinkSearchResult[] > {
		const {
			isInitialSuggestions = false,
			type = undefined,
			subtype = undefined,
			page = undefined,
			perPage = isInitialSuggestions ? 3 : 20,
		} = searchOptions;

		const { disablePostFormats = false } = settings;

		const queries: Promise< WPLinkSearchResult[] >[] = [];

		if ( ! type || type === 'post' ) {
			queries.push(
				apiFetch< WPLinkSearchResult[] >( {
					path: getResourcePath( {
						search,
						page,
						per_page: perPage,
						type: 'post',
						subtype,
					} ),
				} )
					.then( ( results ) => {
						return results.map( ( result ) => {
							return {
								...result,
								meta: { kind: 'post-type', subtype },
							};
						} );
					} )
					.catch( () => [] ) // Fail by returning no results.
			);
		}

		if ( ! type || type === 'term' ) {
			queries.push(
				apiFetch< WPLinkSearchResult[] >( {
					path: getResourcePath( {
						search,
						page,
						per_page: perPage,
						type: 'term',
						subtype,
					} ),
				} )
					.then( ( results ) => {
						return results.map( ( result ) => {
							return {
								...result,
								meta: { kind: 'taxonomy', subtype },
							};
						} );
					} )
					.catch( () => [] ) // Fail by returning no results.
			);
		}

		if ( ! disablePostFormats && ( ! type || type === 'post-format' ) ) {
			queries.push(
				apiFetch< WPLinkSearchResult[] >( {
					path: getResourcePath( {
						search,
						page,
						per_page: perPage,
						type: 'post-format',
						subtype,
					} ),
				} )
					.then( ( results ) => {
						return results.map( ( result ) => {
							return {
								...result,
								meta: { kind: 'taxonomy', subtype },
							};
						} );
					} )
					.catch( () => [] ) // Fail by returning no results.
			);
		}

		if ( ! type || type === 'attachment' ) {
			queries.push(
				apiFetch< WPLinkSearchResult[] >( {
					path: getResourcePath( {
						search,
						page,
						per_page: perPage,
					} ),
				} )
					.then( ( results ) => {
						return results.map( ( result ) => {
							return {
								...result,
								meta: { kind: 'media' },
							};
						} );
					} )
					.catch( () => [] ) // Fail by returning no results.
			);
		}

		const results_4 = await Promise.all( queries );
		return results_4
			.reduce(
				( accumulator: WPLinkSearchResult[], current ) =>
					accumulator.concat( current ),
				[]
			)
			.filter( ( result_4: { id: number } ) => {
				return !! result_4.id;
			} )
			.slice( 0, perPage )
			.map( ( result_5 ) => {
				const isMedia = result_5.type === 'attachment';

				return {
					id: result_5.id,
					// @ts-ignore fix when we make this a TS file
					url: isMedia ? result_5.source_url : result_5.url,
					title:
						// decodeEntities(
						isMedia
							? // @ts-ignore fix when we make this a TS file
							  result_5.title.rendered
							: result_5.title ||
							  '' ||
							  /* ) */ __( '(no title)' ),
					type: result_5.subtype || result_5.type,
					kind: result_5?.meta?.kind,
				};
			} );
	},
};
