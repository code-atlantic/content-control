/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const protectedRedirect = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
		<Path
			d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<Path
			d="M12 6L17 16L12 14L7 16L12 6Z"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</SVG>
);

export default protectedRedirect;
