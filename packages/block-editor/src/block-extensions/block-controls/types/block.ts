import type { Block, BlockInstance } from '@wordpress/blocks';
import type { BlockControlAttrs } from './model';

export type BlockWithControls = Block< BlockControlAttrs >;

export type BlockInstanceWithControls = BlockInstance< BlockControlAttrs >;
