/**
 * External dependencies
 */
import styled from '@emotion/styled';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';

const SingleColumnItem = styled( ToolsPanelItem )`
	grid-column: span 1;
`;

export default SingleColumnItem;
