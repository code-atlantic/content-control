import { Button, Flex, Modal } from '@wordpress/components';
import { ModalProps } from '@wordpress/components/build-types/modal/types';
import { __ } from '@wordpress/i18n';

type Props = {
	message?: string;
	callback?: () => void;
	onClose: () => void;
	isDestructive?: boolean;
} & Partial< ModalProps >;

const ConfirmDialogue = ( {
	message,
	callback,
	onClose,
	isDestructive = false,
}: Props ) => {
	if ( ! message || ! message.length || ! callback ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Confirm Action', 'content-control' ) }
			onRequestClose={ onClose }
		>
			<p>{ message }</p>
			<Flex justify="right">
				<Button
					text={ __( 'Cancel', 'content-control' ) }
					onClick={ onClose }
				/>
				<Button
					variant="primary"
					text={ __( 'Confirm', 'content-control' ) }
					isDestructive={ isDestructive }
					onClick={ () => {
						callback();
						onClose();
					} }
				/>
			</Flex>
		</Modal>
	);
};

export default ConfirmDialogue;
