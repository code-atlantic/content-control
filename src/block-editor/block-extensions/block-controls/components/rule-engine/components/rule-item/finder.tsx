/** WordPress Imports */
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';

/** Internal Imports */
import { useRules } from '../../contexts';

/** Styles */
import './finder.scss';

type Props = React.PropsWithoutRef< {
	immediatelyFocus: boolean;
} >;

const Finder = () => {
	const { getRuleCategories, getRulesByCategory } = useRules();

	const [ currentSearch, setCurrentSearch ] = useState( {
		text: '',
		chosen: {
			category: '',
			verb: '',
			rule: '',
		},
	} );

	const nextSearchKey = Object.keys( currentSearch.chosen ).reduce<
		string | null
	>( ( next, key, i ) => {
		if ( next ) {
			return next;
		}

		return '' === currentSearch.chosen[ key ] ? key : next;
	}, null );

	const searchOptions = () => {
		switch ( nextSearchKey ) {
			case 'category':
				return getRuleCategories();

			case 'verb':
				return getRulesByCategory(
					currentSearch.chosen.category
				).reduce< string[] >( ( _verbs, rule ) => {
					if ( typeof rule.verbs !== 'undefined' ) {
						rule.verbs.forEach( ( verb ) => {
							if ( _verbs.indexOf( verb ) === -1 ) {
								_verbs.push( verb.toLowerCase() );
							}
						} );
					}

					return _verbs;
				}, [] );
			case 'rule':
				return getRulesByCategory( currentSearch.chosen.category )
					.filter(
						( rule ) =>
							rule.verbs?.indexOf( currentSearch.chosen.verb ) !==
							-1
					)
					.map( ( rule ) => rule.label.toLowerCase() );

			default:
				return [];
		}
	};

	const fallbackRef = useRef( null );

	return (
		<div className="cc-rule-engine-search-box">
			<FormTokenField
				isBorderless={ true }
				tokenizeOnSpace={ true }
				expandOnFocus={ true }
				__experimentalExpandOnFocus={ true }
				__experimentalShowHowTo={ true }
				value={ Object.values( currentSearch.chosen ).filter(
					( value ) => value !== ''
				) }
				suggestions={ searchOptions() }
				onChange={ ( tokens ) => {
					const _tokens = [ ...tokens ];

					const lastValue = _tokens.pop();

					if ( nextSearchKey ) {
						setCurrentSearch( {
							...currentSearch,
							chosen: {
								...currentSearch.chosen,
								[ nextSearchKey ]: lastValue,
							},
						} );
					}
				} }
			/>
		</div>
	);
};

export default Finder;
