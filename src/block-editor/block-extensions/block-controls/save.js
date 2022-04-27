import classnames from 'classnames';
import { blockControlsEnabled } from './utils';

/**
 * Add class to elements to handle visibility on the front-end.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
const extraProps = ( extraProps, blockType, attributes ) => {
	const { contentControls: { controlsEnabled = false }= {} } = attributes;

	/**
	 * Bail early  if block controls disabled and  this block didn't previously have them configured.
	 *
	 * The use of && here is important. It prevents users from using "Advanced" mode to save
	 * controls for a block, disabling Advanced and losing block control setups.
	 */
	if ( ! blockControlsEnabled( blockType ) && ! controlsEnabled ) {
		return extraProps;
	}

	if ( contentControls.enabled ) {
		extraProps.className = classnames(
			extraProps.className,
			'cc-block-control-enabled'
		);
	}

	return extraProps;
};

export { extraProps };
