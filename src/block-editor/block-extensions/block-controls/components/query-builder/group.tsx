import { useContext } from '@wordpress/element';

import { Query, QueryGroup } from './types';

import Rule from './rule';

type GroupProps = { group: QueryGroup; context: React.Context };

const Group = ( { group, context }: GroupProps ): JSX.Element => {
	const { comparison, not, children: query } = group;
	return (
		<>
			{ query &&
				query.map( ( obj ) => {
					if ( 'rule' === obj.type ) {
						return <Rule rule={ obj } />;
					} else if ( 'group' === obj.type ) {
						return <Group group={ obj } />;
					}

					return null;
				} ) }
		</>
	);
};

export default Group;
