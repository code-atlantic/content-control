import { appendUrlParams } from '@data/utils';

export const getResourcePath = ( queryParams: SearchArgs = { search: '' } ) =>
	appendUrlParams( 'wp/v2/search', queryParams );
