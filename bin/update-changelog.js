const fs = require( 'fs' );

// Read the current version number from package.json
const newVersion = process.argv[ 2 ];
// --- Format Date as MM/DD/YYYY ---
const today = new Date();
const month = String( today.getMonth() + 1 ).padStart( 2, '0' ); // Months are 0-indexed
const day = String( today.getDate() ).padStart( 2, '0' );
const year = today.getFullYear();
const releaseDate = `${ month }/${ day }/${ year }`; // Format as MM/DD/YYYY
// --- End Date Formatting ---

if ( ! newVersion ) {
	console.error( 'Please provide the new version number as an argument.' );
	process.exit( 1 );
}

// Check if --verbose or -v is passed
const isVerbose =
	process.argv.includes( '--verbose' ) || process.argv.includes( '-v' );

// Read and process CHANGELOG.md
const changelogFilePath = 'CHANGELOG.md';
const readmeFilePath = 'readme.txt';

let changelogContent = fs.readFileSync( changelogFilePath, 'utf8' );

// Improved pattern to capture unreleased changes
const unreleasedPattern = /^## Unreleased\s([\s\S]*?)(?=\n## |\n$)/m;
const unreleasedMatch = changelogContent.match( unreleasedPattern );

if ( ! unreleasedMatch ) {
	console.error( 'No unreleased changes found in CHANGELOG.md.' );
	process.exit( 1 );
}

const unreleasedChanges = unreleasedMatch[ 1 ]
	.trim()
	.split( '\n' )
	.filter( ( line ) => line.trim() !== '' );
const changeCount = unreleasedChanges.length;

// Format unreleased changes into a numbered list if verbose option is used
if ( isVerbose ) {
	const formattedConsoleChanges = unreleasedChanges
		.map(
			( change, index ) =>
				`${ index + 1 }. ${ change.replace( /^\-\s*/, '' ) }`
		)
		.join( '\n' );
	console.log( 'Unreleased Changes:\n' + formattedConsoleChanges );
}

// --- Format for CHANGELOG.md ---
// The captured lines already have the correct '-   ' format.
// Just join them together.
const formattedChangelogChanges = unreleasedChanges.join( '\n' );

// Update CHANGELOG.md with new version using the original lines
const updatedChangelog = changelogContent.replace(
	unreleasedPattern,
	`## Unreleased\n\n## v${ newVersion } - ${ releaseDate }\n\n${ formattedChangelogChanges }` // Use the joined original lines
);

fs.writeFileSync( changelogFilePath, updatedChangelog, 'utf8' );

// --- Format for readme.txt ---
const readmeContent = fs.readFileSync( readmeFilePath, 'utf8' );

// Pattern to find the changelog header and any immediate following whitespace
const changelogPattern = /(== Changelog ==\s*)/s;

if ( !changelogPattern.test( readmeContent ) ) {
	console.error( 'Could not find "== Changelog ==" section in readme.txt' );
	process.exit( 1 );
}

// Format unreleased changes: replace '-   ' with '* '
const formattedReadmeChanges = unreleasedChanges
	.map( ( change ) => `* ${ change.replace( /^\-\s*/, '' ).trim() }` ) // Replace '- ...' with '* ...' and trim potential leading space after replace
	.join( '\n' );

// Create the new version entry using '*'
const newReadmeVersionEntry = `= v${ newVersion } - ${ releaseDate } =\n\n${ formattedReadmeChanges }\n\n`;

// Replace the matched header and whitespace with itself followed by the new entry
const newReadmeContent = readmeContent.replace(
	changelogPattern,
	`$1${ newReadmeVersionEntry }`
);

// Remove the debugging code if it's no longer needed, or keep it for now
// --- Debugging Start ---
console.log( '--- Debug readme.txt ---' );
console.log( 'Pattern:', changelogPattern );
const matchResult = readmeContent.match( changelogPattern );
console.log( 'Match found:', matchResult ? 'Yes' : 'No' );
if ( matchResult ) {
	console.log( 'Matched text ($1):', JSON.stringify( matchResult[ 1 ] ) );
}
console.log( 'New entry:\n', newReadmeVersionEntry );
console.log( '--- Attempting to write new readme content (first 500 chars): ---' );
console.log( newReadmeContent.substring( 0, 500 ) );
console.log( '--- End Debug ---' );
// --- Debugging End ---

fs.writeFileSync( readmeFilePath, newReadmeContent.trim(), 'utf8' );

// Output the count of changes
console.log(
	`Changelog updated successfully with ${ changeCount } change(s).`
);
