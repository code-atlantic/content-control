import { __ } from '@wordpress/i18n';

declare global {
	interface Window {
		contentControlBlockEditorVars: {
			userRoles: { [ key: string ]: string };
			rules: { [ key: string ]: OldFieldArgs };
			adminUrl: string;
		};
	}
}

const { userRoles, registeredRules } = window.contentControlBlockEditorVars;

const verbs = {
	are: __( 'Are', 'content-control' ),
	arenot: __( 'Are Not', 'content-control' ),
	is: __( 'Is', 'content-control' ),
	isnot: __( 'Is Not', 'content-control' ),
	has: __( 'Has', 'content-control' ),
	hasnot: __( 'Has Not', 'content-control' ),
	doesnothave: __( 'Does Not Have', 'content-control' ),
	does: __( 'Does', 'content-control' ),
	doesnot: __( 'Does Not', 'content-control' ),
	was: __( 'Was', 'content-control' ),
	wasnot: __( 'Was Not', 'content-control' ),
	were: __( 'Were', 'content-control' ),
	werenot: __( 'Were Not', 'content-control' ),
};

const builderRules: EngineRuleType[] | OldFieldArgs[] = [
	{
		name: 'user__is_logged_in',
		label: __( 'Logged In', 'content-control' ),
		category: __( 'User', 'content-control' ),
		format: '{category} {verb} {label}',
		verbs: [ verbs.is, verbs.isnot ],
	},
	{
		name: 'user__has_role',
		label: __( 'Role(s)', 'content-control' ),
		category: __( 'User', 'content-control' ),
		format: '{category} {verb} {label}',
		verbs: [ verbs.has, verbs.doesnothave ],
		fields: [
			{
				type: 'multicheck',
				id: 'roles',
				label: __( 'Role(s)', 'content-control' ),
				default: [ 'administrator' ],
				multiple: true,
				options: userRoles,
			},
		],
	},
	{
		name: 'user__has_commented',
		label: __( 'Commented', 'content-control' ),
		category: __( 'User', 'content-control' ),
		format: '{category} {verb} {label}',
		verbs: [ verbs.has, verbs.hasnot ],
		fields: [
			{
				id: 'comparison',
				type: 'select',
				options: [ '>=', '<=', '>', '<', '=' ],
				label: __( 'Comparison', 'content-control' ),
				default: '>=',
			},
			{
				type: 'number',
				id: 'number',
				label: __( 'More than', 'content-control' ),
			},
		],
	},
];

export const parseOldArgsToProps = ( args, value ) => {
	const { type } = args;

	const fieldProps = {
		className: [],
		default: args?.std,
	};

	// Deprecated Class Handling.
	if ( typeof args.classes !== 'undefined' ) {
		if ( 'string' === typeof args.classes ) {
			fieldProps.className.push( args.classes.split( ' ' ) );
		} else if ( Array.isArray( args.classes ) ) {
			fieldProps.className.push( args.classes );
		}
	}

	if ( typeof args.class !== 'undefined' ) {
		fieldProps.className.push( args.class );
	}

	if ( fieldProps.allowHtml ) {
		fieldProps.className.push( 'allows-html' );
	}

	switch ( type ) {
		case 'color':
			if ( typeof value === 'string' && value !== '' ) {
				fieldProps.defaultColor = value;
			}
			break;

		case 'objectselect':
		case 'postselect':
		case 'taxonomyselect':
			fieldProps.className.push( 'objectselect' );
			fieldProps.className.push(
				args.type === 'postselect' ? 'postselect' : 'taxonomyselect'
			);

			fieldProps.entityKind =
				args.type === 'postselect' ? 'postType' : 'taxonomy';
			fieldProps.entityType =
				args.type === 'postselect' ? args.post_type : args.taxonomy;

			break;
		case 'license_key':
			value = {
				key: '',
				license: {},
				messages: [],
				status: 'empty',
				expires: false,
				classes: false,
				...value,
			};

			fieldProps.className.push(
				'jp-cc-license-' + value.status + '-notice'
			);

			if ( value.classes ) {
				fieldProps.className.push( value.classes );
			}
			break;
	}

	// Dependencies

	// Dynamic Descriptions

	// Allow HTML

	return fieldProps;
};

// Field Registration
// 1. Process each condition.
//   1.a check if deprecated definition.
//   1.b map old args to new for deprecated.
//   1.c memoize them for consumption.

/**
 * 1. - Remap old keys to new ones.
 * 2. - Parse defaults
 * 3. - Build Type Props
 * 	3.a - Process props by type.
 *  3.b - Extract Required Props.
 * 4. Render Control
 */
