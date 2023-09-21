<?php
/**
 * Admin User Experience controller.
 *
 * @package ContentControl\Admin
 * @copyright (c) 2023 Code Atlantic LLC
 */

namespace ContentControl\Controllers\Admin;

use ContentControl\Base\Controller;

/**
 * UserExperience controller class.
 */
class UserExperience extends Controller {

	/**
	 * Initialize widget editor UX.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'plugin_action_links', [ $this, 'plugin_action_links' ], 10, 2 );
		add_action( "after_plugin_row_{$this->container->get('basename')}", [
			$this,
			'after_plugin_row',
		], 10, 2 );
	}

	/**
	 * Render plugin action links.
	 *
	 * @param array<string,string> $links Existing links.
	 * @param string               $file Plugin file path.
	 *
	 * @return mixed
	 */
	public function plugin_action_links( $links, $file ) {
		$basename = $this->container->get( 'basename' );

		if ( $file === $basename ) {
			$plugin_action_links = apply_filters(
				'content_control/plugin_action_links',
				[
					'upgrade'  => '<a target="_blank" href="https://contentcontrolplugin.com/pricing/?utm_campaign=upgrade-to-pro&utm_source=plugins-page&utm_medium=plugin-ui&utm_content=action-links-upgrade-text">' . __( 'Upgrade to Pro', 'content-control' ) . '</a>',
					'settings' => '<a href="' . admin_url( 'options-general.php?page=content-control-settings' ) . '">' . __( 'Settings', 'content-control' ) . '</a>',
				]
			);

			if ( $this->container->is_license_active() || $this->container->is_pro_active() ) {
				unset( $plugin_action_links['upgrade'] );
			}

			if ( substr( get_locale(), 0, 2 ) === 'en' ) {
				$plugin_action_links = array_merge( [ 'translate' => '<a href="' . sprintf( 'https://translate.wordpress.org/locale/%s/default/wp-plugins/content-control/', substr( get_locale(), 0, 2 ) ) . '" target="_blank">' . __( 'Translate', 'content-control' ) . '</a>' ], $plugin_action_links );
			}

			foreach ( $plugin_action_links as $link ) {
				array_unshift( $links, $link );
			}
		}

		return $links;
	}

	/**
	 * Add a row to the plugin list table.
	 *
	 * @param string                   $file Plugin file path.
	 * @param array<string,string|int> $plugin_data Plugin data.
	 *
	 * @return void
	 */
	public function after_plugin_row( $file, $plugin_data ) {
		$plugin_slug = $this->container->get( 'slug' );

		if ( $plugin_slug !== $plugin_data['slug'] ) {
			return;
		}

		$plugin_url = $this->container->get( 'url' );

		?>
		<!-- <tr class="plugin-update-tr active">
			<td colspan="3" class="plugin-update colspanchange">
				<div class="update-message notice inline notice-warning notice-alt">
					<p>
						<?php
						printf(
							/* translators: %1$s: Plugin name, %2$s: Plugin URL */
							esc_html__( 'You are using the %1$s plugin. Please visit the %2$s to learn how to use it.', 'content-control' ),
							'<strong>' . esc_html__( 'Content Control', 'content-control' ) . '</strong>',
							'<a href="' . esc_url( $plugin_url ) . '" target="_blank">' . esc_html__( 'plugin website', 'content-control' ) . '</a>'
						);
						?>
					</p>
				</div>
			</td>
		</tr> -->

		<?php
	}
}
