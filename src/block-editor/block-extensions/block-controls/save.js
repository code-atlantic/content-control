import classnames from 'classnames';
import { blockControlsEnabled } from './utils';

/**
 * Add css classes to block element wrapper.
 *
 * @param {Object}         props                      Element props.
 * @param {Object}         blockType                  Blocks object.
 * @param {Object}         attributes                 Blocks attributes.
 * @param {Object|boolean} attributes.contentControls Block control settings.
 *
 * @return {Object} Block element props..
 */
const addWrapperClasses = (
	props,
	blockType,
	{ contentControls = {}, ...attributes }
) => {
	const { enabled: controlsEnabled = false, rules = {} } = contentControls;

	const { device: deviceRules = null } = rules;

	/**
	 * Bail early if block controls disabled and this block didn't previously have them configured.
	 *
	 * The use of && here is important. It prevents users from losing block settings if toggling
	 * advanced mode turned off.
	 */
	if ( ! blockControlsEnabled( blockType ) && ! controlsEnabled ) {
		return props;
	}

	if ( controlsEnabled ) {
		const classes = [ 'cc-block-control-enabled' ];

		if ( deviceRules ) {
			const { hideOn = {} } = deviceRules;

			Object.entries( hideOn ).map( ( [ device, hide = false ], i ) => {
				if ( hide ) {
					classes.push( `cc-block-hide-on--${device}` );
				}
			}

			// TODO Set up classes based on device controls.
		}

		props.className = classnames( props.className, ...classes );
	}

	return props;
};

export { addWrapperClasses };
