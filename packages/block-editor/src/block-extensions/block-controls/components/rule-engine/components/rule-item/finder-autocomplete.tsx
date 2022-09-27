/** External Imports */
import { noop } from 'lodash';
import ReactTags from 'react-tag-autocomplete';

/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import {
	useRef,
	useEffect,
	useMemo,
	createInterpolateElement,
} from '@wordpress/element';

/** Internal Imports */
import { useRules } from '../../contexts';

/** Styles */
import './finder.scss';

type Props = { onSelect: ( ruleItem: Partial< RuleItem > ) => void };

const getFormattedRuleText = (
	format: string,
	{
		verb = '',
		label = '',
		category = '',
	}: { verb: string; label: string; category: string }
) =>
	format
		.split( ' ' )
		.map( ( str: string ) => {
			switch ( str ) {
				case '{category}':
					return category;
				case '{verb}':
					return verb;
				case '{label}':
					return label;
				default:
					return str;
			}
		} )
		.join( ' ' );

type SearchOption = { id: string; name: string; notOperand: boolean };

const Finder = ( { onSelect = noop }: Props ) => {
	const inputRef = useRef( null );
	const { getRules } = useRules();

	const searchOptions = useMemo(
		() =>
			getRules().reduce< SearchOption[] >( ( options, rule ) => {
				const {
					name,
					format,
					verbs = [ '', '' ],
					label,
					category,
				} = rule;

				if ( ! format || ! format.length ) {
					options.push( {
						id: name,
						name: `${ category } ${ label }`,
						notOperand: false,
					} );
					options.push( {
						id: name,
						name: `(!) ${ category } ${ label }`,
						notOperand: true,
					} );
				} else {
					options.push( {
						id: name,
						name: createInterpolateElement( format, {
							category,
							verb: verbs[ 0 ],
							label,
						} ),
						notOperand: false,
					} );
					options.push( {
						id: name,
						name: createInterpolateElement( format, {
							category,
							verb: verbs[ 1 ],
							label,
						} ),
						notOperand: true,
					} );
				}

				return options;
			}, [] ),
		[]
	);

	/**
	 * Focus the input when this component is rendered.
	 */
	useEffect( () => {
		const firstEl = inputRef.current;

		if ( null !== firstEl ) {
			firstEl.focusInput();
		}
	}, [] );

	return (
		<div className="cc-rule-engine-search-box">
			<ReactTags
				placeholderText={ __( 'Select a rule', 'content-control' ) }
				ref={ inputRef }
				// suggestions={ searchOptions }
				// tags={ currentSearch.tags.map( ( tag, i ) => ( {
				// 	id: i,
				// 	name: tag,
				// } ) ) }
				suggestions={ searchOptions.map( ( { name }, i ) => ( {
					id: i,
					name,
				} ) ) }
				onInput={ setCurrentSearch }
				onAddition={ ( { id }: { id: number } ) => {
					const ruleOption = searchOptions[ id ];

					onSelect( {
						name: ruleOption.id,
						notOperand: ruleOption.notOperand,
					} );
				} }
				onDelete={ () => {} }
				allowNew={ false }
				minQueryLength={ 1 }
			/>
		</div>
	);
};

export default Finder;
