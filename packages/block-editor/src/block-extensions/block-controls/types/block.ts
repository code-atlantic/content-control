import type { Block, BlockInstance } from '@wordpress/blocks';
import type { ControlGroups } from './model';

export interface BlockControls extends ControlGroups {
	enabled: boolean;
}

export type BlockControlAttrs = {
	contentControls?: BlockControls;
	[ key: string ]: any;
};

export type BlockWithControls = Block< BlockControlAttrs >;

export type BlockInstanceWithControls = BlockInstance< BlockControlAttrs >;
