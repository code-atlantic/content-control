<?php
/**
 * Generated stub declarations for Content Control.
 *
 * @see https://contentcontrolplugin.com/
 * @see https://github.com/php-stubs/content-control-stubs
 */

namespace ContentControl\RuleEngine {
	/**
	 * Rules registry
	 */
	class Rules {

		/**
		 * Array of rules.
		 *
		 * @var array<string,array<string,mixed>>
		 */
		private $data = [];
		/**
		 * Current global rule instance.
		 *
		 * @var Rule
		 */
		public $current_rule = null;
		/**
		 * Get the current global rule instance.
		 *
		 * @param Rule|null|false $rule Rule instance to set.
		 * @return Rule|null
		 */
		public function current_rule( $rule = false ) {
		}
		/**
		 * Set up rules list.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Register new rule type.
		 *
		 * @param array<string,mixed> $rule New rule to register.
		 * @return void
		 */
		public function register_rule( $rule ) {
		}
		/**
		 * Check if rule is valid.
		 *
		 * @param array<string,mixed> $rule Rule to test.
		 * @return boolean
		 */
		public function is_rule_valid( $rule ) {
		}
		/**
		 * Get array of all registered rules.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		public function get_rules() {
		}
		/**
		 * Get a rule definition by name.
		 *
		 * @param string $rule_name Rule definition or null.
		 * @return array<string,mixed>|null
		 */
		public function get_rule( $rule_name ) {
		}
		/**
		 * Get array of registered rules filtered for the block-editor.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		public function get_block_editor_rules() {
		}
		/**
		 * Get list of verbs.
		 *
		 * @return array<string,string> List of verbs with translatable text.
		 */
		public function get_verbs() {
		}
		/**
		 * Get a list of common text strings.
		 *
		 * @return array<string,string>
		 */
		protected function get_common_text_strings() {
		}
		/**
		 * Get a list of built in rules.
		 *
		 * @return void
		 */
		protected function register_built_in_rules() {
		}
		/**
		 * Get a list of user rules.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		protected function get_user_rules() {
		}
		/**
		 * Get a list of general content rules.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		protected function get_general_content_rules() {
		}
		/**
		 * Get a list of WP post type rules.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		protected function get_post_type_rules() {
		}
		/**
		 * Generate post type taxonomy rules.
		 *
		 * @param string $name Post type name.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		protected function get_post_type_tax_rules( $name ) {
		}
		/**
		 * Generates conditions for all public taxonomies.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		protected function get_taxonomy_rules() {
		}
		/**
		 * Get an array of rule default values.
		 *
		 * @return array<string,mixed> Array of rule default values.
		 */
		public function get_rule_defaults() {
		}
		/**
		 * Register & remap deprecated conditions to rules.
		 *
		 * @return void
		 */
		protected function register_deprecated_rules() {
		}
		/**
		 * Parse rules that are still registered using the older deprecated methods.
		 *
		 * @param array<string,mixed> $old_rules Array of old rules to manipulate.
		 * @return array<string,mixed>
		 */
		public function parse_old_rules( $old_rules ) {
		}
		/**
		 * Remaps keys & values from an old `condition` into a new `rule`.
		 *
		 * @param array<string,mixed> $old_rule Old rule definition.
		 * @return array<string,mixed> New rule definition.
		 */
		public function remap_old_rule( $old_rule ) {
		}
		/**
		 * Get an array of old rule default values.
		 *
		 * @return array<string,mixed> Array of old rule default values.
		 */
		private function get_old_rule_defaults() {
		}
	}
	/**
	 * Handler for rule engine.
	 *
	 * @package ContentControl\RuleEngine
	 */
	class Handler {

		/**
		 * All sets for this handler.
		 *
		 * @var Set[]
		 */
		public $sets;
		/**
		 * Whether check requires `any`|`all`|`none` sets to pass.
		 *
		 * @var string
		 */
		public $any_all_none;
		/**
		 * Build a list of sets.
		 *
		 * @param array{id:string,label:string,query:array<mixed>}[] $sets Set data.
		 * @param string                                             $any_all_none Whether require `any`|`all`|`none` sets to pass checks.
		 */
		public function __construct( $sets, $any_all_none = 'all' ) {
		}
		/**
		 * Check if this set has JS based rules.
		 *
		 * @return bool
		 */
		public function has_js_rules() {
		}
		/**
		 * Checks the rules of all sets using the any/all comparitor.
		 *
		 * @return boolean
		 */
		public function check_rules() {
		}
	}
}

namespace ContentControl\Plugin {
	/**
	 * Prerequisite handler.
	 *
	 * @version 1.0.0
	 */
	class Prerequisites {

		/**
		 * Cache accessible across instances.
		 *
		 * @var array<string,array<string,mixed>>
		 */
		public static $cache = [];
		/**
		 * Array of checks to perform.
		 *
		 * @var array{type:string,version:string}[]
		 */
		protected $checks = [];
		/**
		 * Array of detected failures.
		 *
		 * @var array{type:string,version:string}[]
		 */
		protected $failures = [];
		/**
		 * Instantiate prerequisite checker.
		 *
		 * @param array{type:string,version:string}[] $requirements Array of requirements.
		 */
		public function __construct( $requirements = [] ) {
		}
		/**
		 * Check requirements.
		 *
		 * @param boolean $return_on_fail Whether it should stop processing if one fails.
		 *
		 * @return bool
		 */
		public function check( $return_on_fail = false ) {
		}
		/**
		 * Render notices when appropriate.
		 *
		 * @return void
		 */
		public function setup_notices() {
		}
		/**
		 * Handle individual checks by mapping them to methods.
		 *
		 * @param array{type:string,version:string} $check Requirement check arguments.
		 *
		 * @return bool
		 */
		public function check_handler( $check ) {
		}
		/**
		 * Report failure notice to the queue.
		 *
		 * @param array{type:string,version:string} $check_args Array of check arguments.
		 *
		 * @return void
		 */
		public function report_failure( $check_args ) {
		}
		/**
		 * Get a list of failures.
		 *
		 * @return array{type:string,version:string}[]
		 */
		public function get_failures() {
		}
		/**
		 * Check PHP version against args.
		 *
		 * @param array{type:string,version:string} $check_args Array of args.
		 *
		 * @return bool
		 */
		public function check_php( $check_args ) {
		}
		/**
		 * Check PHP version against args.
		 *
		 * @param array{type:string,version:string} $check_args Array of args.
		 *
		 * @return bool
		 */
		public function check_wp( $check_args ) {
		}
		/**
		 * Check plugin requirements.
		 *
		 * @param array{type:string,version:string,name:string,slug:string,version:string,check_installed:bool,dep_label:string} $check_args Array of args.
		 *
		 * @return bool
		 */
		public function check_plugin( $check_args ) {
		}
		/**
		 * Internally cached get_plugin_data/get_file_data wrapper.
		 *
		 * @param string $slug Plugins `folder/file.php` slug.
		 * @param string $header Specific plugin header needed.
		 * @return mixed
		 */
		private function get_plugin_data( $slug, $header = null ) {
		}
		/**
		 * Check if plugin is active.
		 *
		 * @param string $slug Slug to check for.
		 *
		 * @return bool
		 */
		protected function plugin_is_active( $slug ) {
		}
		/**
		 * Get php error message.
		 *
		 * @param array{type:string,version:string} $failed_check_args Check arguments.
		 *
		 * @return string
		 */
		public function get_php_message( $failed_check_args ) {
		}
		/**
		 * Get wp error message.
		 *
		 * @param array{type:string,version:string} $failed_check_args Check arguments.
		 *
		 * @return string
		 */
		public function get_wp_message( $failed_check_args ) {
		}
		/**
		 * Get plugin error message.
		 *
		 * @param array{type:string,version:string,name:string,slug:string,version:string,check_installed:bool,dep_label:string,not_activated?:bool|null,not_updated?:bool|null} $failed_check_args Get helpful error message.
		 *
		 * @return string
		 */
		public function get_plugin_message( $failed_check_args ) {
		}
		/**
		 * Render needed admin notices.
		 *
		 * @return void
		 */
		public function render_notices() {
		}
	}
	/**
	 * Class Install
	 *
	 * @since 1.0.0
	 */
	class Install {

		/**
		 * Activation wrapper.
		 *
		 * @param bool $network_wide Weather to activate network wide.
		 *
		 * @return void
		 */
		public static function activate_plugin( $network_wide ) {
		}
		/**
		 * Deactivation wrapper.
		 *
		 * @param bool $network_wide Weather to deactivate network wide.
		 *
		 * @return void
		 */
		public static function deactivate_plugin( $network_wide ) {
		}
		/**
		 * Uninstall the plugin.
		 *
		 * @return void
		 */
		public static function uninstall_plugin() {
		}
		/**
		 * Handle single & multisite processes.
		 *
		 * @param bool                $network_wide Weather to do it network wide.
		 * @param callable            $method Callable method for each site.
		 * @param array<string,mixed> $args Array of extra args.
		 *
		 * @return void
		 */
		private static function do_multisite( $network_wide, $method, $args = [] ) {
		}
		/**
		 * Activate on single site.
		 *
		 * @return void
		 */
		public static function activate_site() {
		}
		/**
		 * Deactivate on single site.
		 *
		 * @return void
		 */
		public static function deactivate_site() {
		}
		/**
		 * Uninstall single site.
		 *
		 * @return void
		 */
		public static function uninstall_site() {
		}
	}
	/**
	 * Upgrader class.
	 *
	 * NOTE: For wordpress.org admins: This is only used if:
	 * - The user explicitly entered a license key.
	 * - They further opened a window to our site allowing the user to authorize the connection & installation of the pro upgrade.
	 *
	 * @package ContentControl
	 */
	class Upgrader {

		/**
		 * Container.
		 *
		 * @var Container
		 */
		private $c;
		/**
		 * Initialize license management.
		 *
		 * @param Container $c Container.
		 */
		public function __construct( $c ) {
		}
		/**
		 * Maybe load functions & classes required for upgrade.
		 *
		 * Purely here due to prevent possible random errors.
		 *
		 * @return void
		 */
		public function maybe_load_required_files() {
		}
		/**
		 * Log a message to the debug log if enabled.
		 *
		 * Here to prevent constant conditional checks for the debug mode.
		 *
		 * @param string $message Message.
		 * @param string $type    Type.
		 *
		 * @return void
		 */
		public function debug_log( $message, $type = 'INFO' ) {
		}
		/**
		 * Get credentials for the current request.
		 *
		 * @return bool
		 */
		public function get_fs_creds() {
		}
		/**
		 * Activate a plugin.
		 *
		 * @param string $plugin_basename The plugin basename.
		 * @return bool|\WP_Error
		 */
		public function activate_plugin( $plugin_basename ) {
		}
		/**
		 * Install a plugin from file.
		 *
		 * @param string $file The plugin file.
		 *
		 * @return bool|\WP_Error
		 */
		public function install_plugin( $file ) {
		}
	}
	/**
	 * Connection management.
	 *
	 * NOTE: For wordpress.org admins: This is not called in the free, hosted version. This is only used if:
	 * - The user explicitly entered a license key.
	 * - This then opens a window to our site allowing the user to authorize the connection & installation of pro.
	 *
	 * @package ContentControl
	 */
	class Connect {

		const API_URL              = 'https://upgrade.contentcontrolplugin.com/';
		const TOKEN_OPTION_NAME    = 'content_control_connect_token';
		const NONCE_OPTION_NAME    = 'content_control_connect_nonce';
		const ERROR_REFERRER       = 1;
		const ERROR_AUTHENTICATION = 2;
		const ERROR_USER_AGENT     = 3;
		const ERROR_SIGNATURE      = 4;
		const ERROR_NONCE          = 5;
		const ERROR_WEBHOOK_ARGS   = 6;
		/**
		 * Container.
		 *
		 * @var \ContentControl\Base\Container
		 */
		private $c;
		/**
		 * Initialize license management.
		 *
		 * @param \ContentControl\Base\Container $c Container.
		 */
		public function __construct( $c ) {
		}
		/**
		 * Check if debug mode is enabled.
		 *
		 * @return bool
		 */
		public function debug_mode_enabled() {
		}
		/**
		 * Generate a new authorizatin token.
		 *
		 * @return string
		 */
		public function generate_token() {
		}
		/**
		 * Get the current token.
		 *
		 * @return string|false
		 */
		public function get_access_token() {
		}
		/**
		 * Get the current nonce.
		 *
		 * @param string $token Token.
		 *
		 * @return string|false
		 */
		public function get_nonce_name( $token ) {
		}
		/**
		 * Log a message to the debug log if enabled.
		 *
		 * Here to prevent constant conditional checks for the debug mode.
		 *
		 * @param string $message Message.
		 * @param string $type    Type.
		 *
		 * @return void
		 */
		public function debug_log( $message, $type = 'INFO' ) {
		}
		/**
		 * Get header Authorization
		 *
		 * @return null|string
		 */
		public function get_request_authorization_header() {
		}
		/**
		 * Get access token from header.
		 *
		 * @return string|null
		 */
		public function get_request_token() {
		}
		/**
		 * Get nonce from header.
		 *
		 * @return string|null
		 */
		public function get_request_nonce() {
		}
		/**
		 * Get the OAuth connect URL.
		 *
		 * @param string $license_key License key.
		 *
		 * @return array{url:string,back_url:string}
		 */
		public function get_connect_info( $license_key ) {
		}
		/**
		 * Kill the connection with no permission.
		 *
		 * @param int          $error_no Error number.
		 * @param string|false $message Error message.
		 *
		 * @return void
		 */
		public function kill_connection( $error_no = self::ERROR_REFERRER, $message = false ) {
		}
		/**
		 * Verify the user agent.
		 *
		 * @return void
		 */
		public function verify_user_agent() {
		}
		/**
		 * Verify the referrer.
		 *
		 * @return void
		 */
		public function verify_referrer() {
		}
		/**
		 * Verify the nonce.
		 *
		 * @deprecated 2.0.0 Don't use, it doesn't work as its a separate server making request.
		 *
		 * @return void
		 */
		public function verify_nonce() {
		}
		/**
		 * Verify the authentication token.
		 *
		 * @return void
		 */
		public function verify_authentication() {
		}
		/**
		 * Generate signature hash.
		 *
		 * This must match the hash generated on the server.
		 *
		 * @see \ontentControlUpgrader\App::generate_hash()
		 *
		 * @param array<string,mixed>|string $data Data to hash.
		 * @param string                     $token Token to hash with.
		 * @return string
		 */
		public function generate_hash( $data, $token ) {
		}
		/**
		 * Verify the signature of the requester.
		 *
		 * @return void
		 */
		public function verify_signature() {
		}
		/**
		 * Validate the connection.
		 *
		 * @return void
		 */
		public function validate_connection() {
		}
		/**
		 * Verify the connection.
		 *
		 * @return void
		 */
		public function process_verify_connection() {
		}
		/**
		 * Get the webhook args.
		 *
		 * @return array{file:string,type:string,slug:string,force:boolean}
		 */
		public function get_webhook_args() {
		}
		/**
		 * Verify and return webhook args.
		 *
		 * @param array{file:string,type:string,slug:string,force:bool} $args The webhook args.
		 *
		 * @return void
		 */
		public function verify_webhook_args( $args ) {
		}
		/**
		 * Listen for incoming secure webhooks from the API server.
		 *
		 * @return void
		 */
		public function process_webhook() {
		}
		/**
		 * Install a plugin.
		 *
		 * @param array{file:string,type:string,slug:string,force:bool} $args The file args.
		 * @return void
		 */
		public function install_plugin( $args ) {
		}
	}
	/**
	 * License management.
	 *
	 * NOTE: For wordpress.org admins: This is only used if:
	 * - The user explicitly entered a license key.
	 *
	 * @package ContentControl
	 */
	class License {

		/**
		 * EDD API URL.
		 *
		 * @var string
		 */
		const API_URL = 'https://contentcontrolplugin.com/edd-sl-api/';
		/**
		 * Item ID.
		 *
		 * @var int
		 */
		const ID = 45;
		/**
		 * Option key.
		 *
		 * @var string
		 */
		const OPTION_KEY = 'content_control_license';
		/**
		 * License data
		 *
		 * @var array<string,mixed>|null
		 */
		private $license_data;
		/**
		 * Initialize license management.
		 */
		public function __construct() {
		}
		/**
		 * Register hooks.
		 *
		 * @return void
		 */
		public function register_hooks() {
		}
		/**
		 * Autoregister license.
		 *
		 * @return void
		 */
		public function autoregister() {
		}
		/**
		 * Schedule cron jobs.
		 *
		 * @return void
		 */
		public function schedule_crons() {
		}
		/**
		 * Get license data.
		 *
		 * @return array{key:string|null,status:array<string,mixed>|null}
		 */
		public function get_license_data() {
		}
		/**
		 * Get license key.
		 *
		 * @return string
		 */
		public function get_license_key() {
		}
		/**
		 * Get license status.
		 *
		 * @param bool $refresh Whether to refresh license status.
		 *
		 * @return array<string,mixed> Array of license status data.
		 */
		public function get_license_status( $refresh = false ) {
		}
		/**
		 * Get license level.
		 *
		 * Only used in pro version.
		 *
		 * @return int Integer representing license level.
		 */
		public function get_license_level() {
		}
		/**
		 * Update license data.
		 *
		 * @param array{key:string|null,status:array<string,mixed>|null} $license_data License data.
		 *
		 * @return bool
		 */
		public function udpate_license_data( $license_data ) {
		}
		/**
		 * Update license key.
		 *
		 * @param string $key License key.
		 *
		 * @return void
		 */
		public function update_license_key( $key ) {
		}
		/**
		 * Update license status.
		 *
		 * @param array<string,mixed> $license_status License status data.
		 *
		 * @return void
		 */
		public function update_license_status( $license_status ) {
		}
		/**
		 * Get license expiration from license status data.
		 *
		 * @param bool $as_datetime Whether to return as DateTime object.
		 *
		 * @return \DateTime|false|null
		 */
		public function get_license_expiration( $as_datetime = false ) {
		}
		/**
		 * Fetch license status from remote server.
		 * This is a blocking request.
		 *
		 * @return void
		 */
		public function refresh_license_status() {
		}
		/**
		 * Get license status from remote server.
		 *
		 * @return array<string,mixed> License status data.
		 *
		 * @throws \Exception If there is an error.
		 */
		private function check_license() {
		}
		/**
		 * Activate license.
		 *
		 * @param string $key License key.
		 *
		 * @return array<string,mixed> License status data.
		 *
		 * @throws \Exception If there is an error.
		 */
		public function activate_license( $key = null ) {
		}
		/**
		 * Deactivate license.
		 *
		 * @return array<string,mixed> License status data.
		 *
		 * @throws \Exception If there is an error.
		 */
		public function deactivate_license() {
		}
		/**
		 * Convert license error to human readable message.
		 *
		 * @param array<string,mixed> $license_status License status data.
		 *
		 * @return string
		 */
		public function get_license_error_message( $license_status ) {
		}
		/**
		 * Remove license.
		 *
		 * @return void
		 */
		public function remove_license() {
		}
		/**
		 * Check if license is active.
		 *
		 * @return bool
		 */
		public function is_license_active() {
		}
	}
	/**
	 * Class Options
	 */
	class Options {

		/**
		 * Unique Prefix per plugin.
		 *
		 * @var string
		 */
		public $prefix;
		/**
		 * Action namespace.
		 *
		 * @var string
		 */
		public $namespace;
		/**
		 * Initialize Options on run.
		 *
		 * @param string $prefix Settings key prefix.
		 */
		public function __construct( $prefix = 'content_control' ) {
		}
		/**
		 * Get Settings
		 *
		 * Retrieves all plugin settings
		 *
		 * @return array<string,mixed> settings
		 */
		public function get_all() {
		}
		/**
		 * Get an option
		 *
		 * Looks to see if the specified setting exists, returns default if not
		 *
		 * @param string $key Option key.
		 * @param bool   $default_value Default value.
		 *
		 * @return mixed|void
		 */
		public function get( $key = '', $default_value = false ) {
		}
		/**
		 * Update an option
		 *
		 * Updates an setting value in both the db and the global variable.
		 * Warning: Passing in an empty, false or null string value will remove
		 *          the key from the _options array.
		 *
		 * @since 1.0.0
		 *
		 * @param string          $key The Key to update.
		 * @param string|bool|int $value The value to set the key to.
		 *
		 * @return boolean True if updated, false if not.
		 */
		public function update( $key = '', $value = false ) {
		}
		/**
		 * Update many values at once.
		 *
		 * @param array<string,mixed> $new_options Array of new replacement options.
		 *
		 * @return bool
		 */
		public function update_many( $new_options = [] ) {
		}
		/**
		 * Remove an option
		 *
		 * @param string|string[] $keys Can be a single string  or array of option keys.
		 *
		 * @return boolean True if updated, false if not.
		 */
		public function delete( $keys ) {
		}
		/**
		 * Remaps option keys.
		 *
		 * @param array<string,string> $remap_array an array of $old_key => $new_key values.
		 *
		 * @return bool
		 */
		public function remap_keys( $remap_array = [] ) {
		}
	}
	/**
	 * Logging class.
	 */
	class Logging {

		/**
		 * Log file prefix.
		 */
		const LOG_FILE_PREFIX = 'content-control-';
		/**
		 * Whether the log file is writable.
		 *
		 * @var bool|null
		 */
		private $is_writable;
		/**
		 * Log file name.
		 *
		 * @var string
		 */
		private $filename = '';
		/**
		 * Log file path.
		 *
		 * @var string
		 */
		private $file = '';
		/**
		 * File system API.
		 *
		 * @var \WP_Filesystem_Base|null
		 */
		private $fs;
		/**
		 * Log file content.
		 *
		 * @var string|null
		 */
		private $content;
		/**
		 * Initialize logging.
		 */
		public function __construct() {
		}
		/**
		 * Register hooks.
		 *
		 * @return void
		 */
		public function register_hooks() {
		}
		/**
		 * Gets the Uploads directory
		 *
		 * @return bool|array{path: string, url: string, subdir: string, basedir: string, baseurl: string, error: string|false} An associated array with baseurl and basedir or false on failure
		 */
		public function get_upload_dir() {
		}
		/**
		 * Gets the uploads directory URL
		 *
		 * @param string $path A path to append to end of upload directory URL.
		 * @return bool|string The uploads directory URL or false on failure
		 */
		public function get_upload_dir_url( $path = '' ) {
		}
		/**
		 * Chek if logging is enabled.
		 *
		 * @return bool
		 */
		public function enabled() {
		}
		/**
		 * Get working WP Filesystem instance
		 *
		 * @return \WP_Filesystem_Base|false
		 */
		public function fs() {
		}
		/**
		 * Check if the log file is writable.
		 *
		 * @return boolean
		 */
		public function is_writable() {
		}
		/**
		 * Get things started
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Get the log file path.
		 *
		 * @return string
		 */
		public function get_file_path() {
		}
		/**
		 * Retrieves the url to the file
		 *
		 * @return string|bool The url to the file or false on failure
		 */
		public function get_file_url() {
		}
		/**
		 * Retrieve the log data
		 *
		 * @return false|string
		 */
		public function get_log() {
		}
		/**
		 * Delete the log file and token.
		 *
		 * @return void
		 */
		public function delete_logs() {
		}
		/**
		 * Log message to file
		 *
		 * @param string $message The message to log.
		 *
		 * @return void
		 */
		public function log( $message = '' ) {
		}
		/**
		 * Log unique message to file.
		 *
		 * @param string $message The unique message to log.
		 *
		 * @return void
		 */
		public function log_unique( $message = '' ) {
		}
		/**
		 * Get the log file contents.
		 *
		 * @return false|string
		 */
		public function get_log_content() {
		}
		/**
		 * Set the log file contents in memory.
		 *
		 * @param mixed $content The content to set.
		 * @param bool  $save    Whether to save the content to the file immediately.
		 * @return void
		 */
		private function set_log_content( $content, $save = false ) {
		}
		/**
		 * Retrieve the contents of a file.
		 *
		 * @param string|boolean $file File to get contents of.
		 *
		 * @return false|string
		 */
		protected function get_file( $file = false ) {
		}
		/**
		 * Write the log message
		 *
		 * @param string $message The message to write.
		 *
		 * @return void
		 */
		protected function write_to_log( $message = '' ) {
		}
		/**
		 * Save the current contents to file.
		 *
		 * @return void
		 */
		public function save_logs() {
		}
		/**
		 * Get a line count.
		 *
		 * @return int
		 */
		public function count_lines() {
		}
		/**
		 * Truncates a log file to maximum of 250 lines.
		 *
		 * @return void
		 */
		public function truncate_log() {
		}
		/**
		 * Set up a new log file.
		 *
		 * @return void
		 */
		public function setup_new_log() {
		}
		/**
		 * Delete the log file.
		 *
		 * @return void
		 */
		public function clear_log() {
		}
		/**
		 * Log a deprecated notice.
		 *
		 * @param string $func_name Function name.
		 * @param string $version Versoin deprecated.
		 * @param string $replacement Replacement function (optional).
		 *
		 * @return void
		 */
		public function log_deprecated_notice( $func_name, $version, $replacement = null ) {
		}
	}
	/**
	 * Class Plugin
	 *
	 * @package ContentControl\Plugin
	 *
	 * @version 2.0.0
	 */
	class Core {

		/**
		 * Exposed container.
		 *
		 * @var Container
		 */
		public $container;
		/**
		 * Array of controllers.
		 *
		 * Useful to unhook actions/filters from global space.
		 *
		 * @var Container
		 */
		public $controllers;
		/**
		 * Initiate the plugin.
		 *
		 * @param array<string,string|bool> $config Configuration variables passed from main plugin file.
		 */
		public function __construct( $config ) {
		}
		/**
		 * Update & track version info.
		 *
		 * @return void
		 */
		protected function check_version() {
		}
		/**
		 * Process old version data.
		 *
		 * @param array<string,string|null> $data Array of data.
		 * @return array<string,string|null>
		 */
		protected function process_version_data_migration( $data ) {
		}
		/**
		 * Internationalization.
		 *
		 * @return void
		 */
		public function load_textdomain() {
		}
		/**
		 * Add default services to our Container.
		 *
		 * @return void
		 */
		public function register_services() {
		}
		/**
		 * Update & track version info.
		 *
		 * @return array<string,\ContentControl\Base\Controller>
		 */
		protected function registered_controllers() {
		}
		/**
		 * Initiate internal components.
		 *
		 * @return void
		 */
		protected function initiate_controllers() {
		}
		/**
		 * Register controllers.
		 *
		 * @param array<string,Controller> $controllers Array of controllers.
		 * @return void
		 */
		public function register_controllers( $controllers = [] ) {
		}
		/**
		 * Get a controller.
		 *
		 * @param string $name Controller name.
		 *
		 * @return Controller|null
		 */
		public function get_controller( $name ) {
		}
		/**
		 * Initiate internal paths.
		 *
		 * @return void
		 */
		protected function define_paths() {
		}
		/**
		 * Utility method to get a path.
		 *
		 * @param string $path Subpath to return.
		 * @return string
		 */
		public function get_path( $path ) {
		}
		/**
		 * Utility method to get a url.
		 *
		 * @param string $path Sub url to return.
		 * @return string
		 */
		public function get_url( $path = '' ) {
		}
		/**
		 * Get item from container
		 *
		 * @param string $id Key for the item.
		 *
		 * @return mixed Current value of the item.
		 */
		public function get( $id ) {
		}
		/**
		 * Set item in container
		 *
		 * @param string $id Key for the item.
		 * @param mixed  $value Value to set.
		 *
		 * @return void
		 */
		public function set( $id, $value ) {
		}
		/**
		 * Get plugin option.
		 *
		 * @param string        $key Option key.
		 * @param boolean|mixed $default_value Default value.
		 * @return mixed
		 */
		public function get_option( $key, $default_value = false ) {
		}
		/**
		 * Get plugin permissions.
		 *
		 * @return array<string,string> Array of permissions.
		 */
		public function get_permissions() {
		}
		/**
		 * Get plugin permission for capability.
		 *
		 * @param string $cap Permission key.
		 *
		 * @return string User role or cap required.
		 */
		public function get_permission( $cap ) {
		}
		/**
		 * Check if pro version is installed.
		 *
		 * @return boolean
		 */
		public function is_pro_installed() {
		}
		/**
		 * Check if pro version is active.
		 *
		 * @return boolean
		 */
		public function is_pro_active() {
		}
		/**
		 * Check if license is active.
		 *
		 * @return boolean
		 */
		public function is_license_active() {
		}
	}
	/**
	 * Autoloader class.
	 */
	class Autoloader {

		/**
		 * Static-only class.
		 */
		private function __construct() {
		}
		/**
		 * Require the autoloader and return the result.
		 *
		 * If the autoloader is not present, let's log the failure and display a nice admin notice.
		 *
		 * @param string $name Plugin name for error messaging.
		 * @param string $path Path to the plugin.
		 *
		 * @return boolean
		 */
		public static function init( $name = '', $path = '' ) {
		}
		/**
		 * If the autoloader is missing, add an admin notice.
		 *
		 *  @param string $plugin_name Plugin name for error messaging.
		 *
		 * @return void
		 */
		protected static function missing_autoloader( $plugin_name = '' ) {
		}
	}
}

namespace ContentControl\Models\RuleEngine {
	/**
	 * Handler for condition items.
	 *
	 * @package ContentControl
	 */
	abstract class Item {

		/**
		 * Item id.
		 *
		 * @var string
		 */
		public $id;
		/**
		 * Return the checks as an array of information.
		 *
		 * Useful for debugging.
		 *
		 * @return array<mixed>
		 */
		abstract public function get_check_info();
	}
	/**
	 * Handler for condition groups.
	 *
	 * @package ContentControl
	 */
	class Group extends \ContentControl\Models\RuleEngine\Item {

		/**
		 * Group id.
		 *
		 * @var string
		 */
		public $id;
		/**
		 * Group label.
		 *
		 * @var string
		 */
		public $label;
		/**
		 * Group query.
		 *
		 * @var Query
		 */
		public $query;
		/**
		 * Build a group.
		 *
		 * @param array{id:string,label:string,query:array<mixed>} $group Group data.
		 */
		public function __construct( $group ) {
		}
		/**
		 * Check if this group has JS based rules.
		 *
		 * @return bool
		 */
		public function has_js_rules() {
		}
		/**
		 * Check this groups rules.
		 *
		 * @return bool
		 */
		public function check_rules() {
		}
		/**
		 * Check this groups rules.
		 *
		 * @return array<bool|null|array<bool|null>>
		 */
		public function get_checks() {
		}
		/**
		 * Return the rule check as an array of information.
		 *
		 * Useful for debugging.
		 *
		 * @return array<mixed>
		 */
		public function get_check_info() {
		}
	}
	/**
	 * Handler for condition rules.
	 *
	 * @package ContentControl
	 */
	class Rule extends \ContentControl\Models\RuleEngine\Item {

		/**
		 * Unique Hash ID.
		 *
		 * @var string
		 */
		public $id;
		/**
		 * Rule name.
		 *
		 * @var string
		 */
		public $name;
		/**
		 * Rule options.
		 *
		 * @var array<string,mixed>
		 */
		public $options;
		/**
		 * Rule not operand.
		 *
		 * @var boolean
		 */
		public $not_operand;
		/**
		 * Rule extras.
		 *
		 * Such as post type or taxnomy like meta.
		 *
		 * @var array<string,mixed>
		 */
		public $extras = [];
		/**
		 * Rule is frontend only.
		 *
		 * @var boolean
		 */
		public $frontend_only = false;
		/**
		 * Rule definition.
		 *
		 * @var array<string,mixed>|null
		 */
		public $definition;
		/**
		 * Rule is deprecated.
		 *
		 * @var boolean
		 */
		public $deprecated = false;
		/**
		 * Build a rule.
		 *
		 * @param array{id:string,name:string,notOperand:bool,options:array<string,mixed>,extras:array<string,mixed>} $rule Rule data.
		 */
		public function __construct( $rule ) {
		}
		/**
		 * Parse rule options based on rule definitions.
		 *
		 * @param array<string,mixed> $options Array of rule opions.
		 * @return array<string,mixed>
		 */
		public function parse_options( $options = [] ) {
		}
		/**
		 * Check the results of this rule.
		 *
		 * @return bool
		 */
		public function check_rule() {
		}
		/**
		 * Check the results of this rule.
		 *
		 * @return bool True if rule passes, false if not.
		 */
		private function run_check() {
		}
		/**
		 * Check if this rule's callback is based in JS rather than PHP.
		 *
		 * @return bool
		 */
		public function is_js_rule() {
		}
		/**
		 * Return the rule check as boolean or null if the rule is JS based.
		 *
		 * @return bool|null
		 */
		public function get_check() {
		}
		/**
		 * Return the rule check as an array of information.
		 *
		 * Useful for debugging.
		 *
		 * @return array<string,mixed>|null
		 */
		public function get_check_info() {
		}
	}
	/**
	 * Handler for condition sets.
	 *
	 * @package ContentControl
	 */
	class Set {

		/**
		 * Set id.
		 *
		 * @var string
		 */
		public $id;
		/**
		 * Set label.
		 *
		 * @var string
		 */
		public $label;
		/**
		 * Set query.
		 *
		 * @var Query
		 */
		public $query;
		/**
		 * Build a set.
		 *
		 * @param array{id:string,label:string,query:array<mixed>} $set Set data.
		 */
		public function __construct( $set ) {
		}
		/**
		 * Check if this set has JS based rules.
		 *
		 * @return bool
		 */
		public function has_js_rules() {
		}
		/**
		 * Check this sets rules.
		 *
		 * @return bool
		 */
		public function check_rules() {
		}
		/**
		 * Get the check array for further post processing.
		 *
		 * @return array<bool|null|array<bool|null>>
		 */
		public function get_checks() {
		}
		/**
		 * Return the checks as an array of information.
		 *
		 * Useful for debugging.
		 *
		 * @return array<string,mixed>
		 */
		public function get_check_info() {
		}
	}
	/**
	 * Handler for condition queries.
	 *
	 * @package ContentControl
	 */
	class Query {

		/**
		 * Query logical comparison operator.
		 *
		 * @var string `and` | `or`
		 */
		public $logical_operator;
		/**
		 * Query items.
		 *
		 * @var Item[]
		 */
		public $items;
		/**
		 * Build a query.
		 *
		 * @param array{logicalOperator:string,items:array<mixed>} $query Query data.
		 */
		public function __construct( $query ) {
		}
		/**
		 * Check if this query has any rules.
		 *
		 * @return bool
		 */
		public function has_rules() {
		}
		/**
		 * Check if this query has JS based rules.
		 *
		 * @return bool
		 */
		public function has_js_rules() {
		}
		/**
		 * Check rules in a recursive nested pattern.
		 *
		 * @return bool
		 */
		public function check_rules() {
		}
		/**
		 * Return the checks as an array.
		 *
		 * Useful for debugging or passing to JS.
		 *
		 * @return array<bool|null|array<bool|null>>
		 */
		public function get_checks() {
		}
		/**
		 * Return the checks as an array of information.
		 *
		 * Useful for debugging.
		 *
		 * @return array<mixed>
		 */
		public function get_check_info() {
		}
	}
}

namespace ContentControl\Models {
	/**
	 * Model for restriction sets.
	 *
	 * @version 3.0.0
	 * @since   2.1.0
	 *
	 * @package ContentControl\Models
	 */
	class Restriction {

		/**
		 * Current model version.
		 *
		 * @var int
		 */
		const MODEL_VERSION = 3;
		/**
		 * Post object.
		 *
		 * @var \WP_Post
		 */
		private $post;
		/**
		 * Restriction id.
		 *
		 * @var int
		 */
		public $id = 0;
		/**
		 * Restriction slug.
		 *
		 * @var string
		 */
		public $slug;
		/**
		 * Restriction label.
		 *
		 * @var string
		 */
		public $title;
		/**
		 * Restriction description.
		 *
		 * @var string|null
		 */
		public $description;
		/**
		 * Restriction Message.
		 *
		 * @var string|null
		 */
		public $message;
		/**
		 * Restriction status.
		 *
		 * @var string
		 */
		public $status;
		/**
		 * Restriction priority.
		 *
		 * @var int
		 */
		public $priority;
		/**
		 * Restriction Condition Query.
		 *
		 * @var Query
		 */
		public $query;
		/**
		 * Restriction Settings.
		 *
		 * @var array<string,mixed>
		 */
		public $settings;
		/**
		 * Data version.
		 *
		 * @var int
		 */
		public $data_version;
		/**
		 * Build a restriction.
		 *
		 * @param \WP_Post|array<string,mixed> $restriction Restriction data.
		 */
		public function __construct( $restriction ) {
		}
		/**
		 * Map old v1 restriction to new v2 restriction object.
		 *
		 * @param array<string,mixed> $restriction Restriction data.
		 *
		 * @return void
		 */
		public function setup_v1_restriction( $restriction ) {
		}
		/**
		 * Get the restriction settings array.
		 *
		 * @return array<string,mixed>
		 */
		public function get_settings() {
		}
		/**
		 * Get a restriction setting.
		 *
		 * Settings are stored in JS based camelCase. But WP prefers snake_case.
		 *
		 * This method supports camelCase based dot.notation, as well as snake_case.
		 *
		 * @param string $key Setting key.
		 * @param mixed  $default_value Default value.
		 *
		 * @return mixed|false
		 */
		public function get_setting( $key, $default_value = false ) {
		}
		/**
		 * Check if this set has JS based rules.
		 *
		 * @return bool
		 */
		public function has_js_rules() {
		}
		/**
		 * Check this sets rules.
		 *
		 * @return bool
		 */
		public function check_rules() {
		}
		/**
		 * Check if this restriction applies to the current user.
		 *
		 * @return bool
		 */
		public function user_meets_requirements() {
		}
		/**
		 * Get the description for this restriction.
		 *
		 * @return string
		 */
		public function get_description() {
		}
		/**
		 * Get the message for this restriction.
		 *
		 * @uses \get_the_content()
		 * @uses \ContentControl\get_default_denial_message()
		 *
		 * @param string $context Context. 'display' or 'raw'.
		 *
		 * @return string
		 */
		public function get_message( $context = 'display' ) {
		}
		/**
		 * Whether to show excerpts for posts that are restricted.
		 *
		 * @return bool
		 */
		public function show_excerpts() {
		}
		/**
		 * Check if this uses the redirect method.
		 *
		 * @return bool
		 */
		public function uses_redirect_method() {
		}
		/**
		 * Check if this uses the replace method.
		 *
		 * @return bool
		 */
		public function uses_replace_method() {
		}
		/**
		 * Get edit link.
		 *
		 * @return string
		 */
		public function get_edit_link() {
		}
		/**
		 * Convert this restriction to an array.
		 *
		 * @return array<string,mixed>
		 */
		public function to_array() {
		}
		/**
		 * Convert this restriction to a v1 array.
		 *
		 * @return array<string,mixed>
		 */
		public function to_v1_array() {
		}
	}
}

namespace ContentControl\RestAPI {
	/**
	 * Rest API Settings Controller Class.
	 */
	class Settings extends \WP_REST_Controller {

		/**
		 * Endpoint namespace.
		 *
		 * @var string
		 */
		protected $namespace = 'content-control/v2';
		/**
		 * Route base.
		 *
		 * @var string
		 */
		protected $base = 'settings';
		/**
		 * Register API endpoint routes.
		 *
		 * @return void
		 */
		public function register_routes() {
		}
		/**
		 * Get plugin settings.
		 *
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_settings() {
		}
		/**
		 * Update plugin settings.
		 *
		 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function update_settings( $request ) {
		}
		/**
		 * Check update settings permissions.
		 *
		 * @return WP_Error|bool
		 */
		public function update_settings_permissions() {
		}
		/**
		 * Get settings schema.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		public function get_schema() {
		}
	}
	/**
	 * Rest API Settings Controller Class.
	 */
	class BlockTypes extends \WP_REST_Controller {

		/**
		 * Endpoint namespace.
		 *
		 * @var string
		 */
		protected $namespace = 'content-control/v2';
		/**
		 * Route base.
		 *
		 * @var string
		 */
		protected $base = 'blockTypes';
		/**
		 * Register API endpoint routes.
		 *
		 * @return void
		 */
		public function register_routes() {
		}
		/**
		 * Get block type list.
		 *
		 * @return WP_Error|WP_REST_Response
		 */
		public function get_block_types() {
		}
		/**
		 * Update plugin settings.
		 *
		 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function update_block_types( $request ) {
		}
		/**
		 * Check update settings permissions.
		 *
		 * @return WP_Error|bool
		 */
		public function update_block_types_permissions() {
		}
		/**
		 * Get settings schema.
		 *
		 * @return array<string,mixed>
		 */
		public function get_schema() {
		}
	}
	/**
	 * Rest API Licensing Controller Class.
	 */
	class License extends \WP_REST_Controller {

		/**
		 * Endpoint namespace.
		 *
		 * @var string
		 */
		protected $namespace = 'content-control/v2';
		/**
		 * Route base.
		 *
		 * @var string
		 */
		protected $base = 'license';
		/**
		 * Register API endpoint routes.
		 *
		 * @return void
		 */
		public function register_routes() {
		}
		/**
		 * Clean private or unnecessary data from license data before returning it.
		 *
		 * @param array{key:string,status:array<string,mixed>} $license_data License data.
		 * @return array{key:string,status:array<string,mixed>}
		 */
		public function clean_license_data( $license_data ) {
		}
		/**
		 * Clean license status.
		 *
		 * @param array{key:string,status:array<string,mixed>} $license_status License status.
		 *
		 * @return (array|string)[]
		 *
		 * @psalm-return array<'key'|'status', array<string, mixed>|string>
		 * @phpstan-return array{key: string, status: array<string, mixed>|string}
		 */
		public function clean_license_status( $license_status ) {
		}
		/**
		 * Get plugin license.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function get_license() {
		}
		/**
		 * Update plugin license key.
		 *
		 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function update_license_key( $request ) {
		}
		/**
		 * Remove plugin license key.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function remove_license() {
		}
		/**
		 * Activate plugin license.
		 *
		 * @param WP_REST_Request<array<string,mixed>> $request Request object.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function activate_license( $request ) {
		}
		/**
		 * Activate pro plugin.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function activate_pro() {
		}
		/**
		 * Deactivate plugin license.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function deactivate_license() {
		}
		/**
		 * Get plugin license status.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function get_status() {
		}
		/**
		 * Refresh plugin license status.
		 *
		 * @return \WP_Error|\WP_REST_Response
		 */
		public function refresh_license_status() {
		}
		/**
		 * Check update settings permissions.
		 *
		 * @return bool
		 */
		public function manage_license_permissions() {
		}
	}
	/**
	 * Rest API Object Search Controller Class.
	 */
	class ObjectSearch extends \WP_REST_Controller {

		/**
		 * Endpoint namespace.
		 *
		 * @var string
		 */
		protected $namespace = 'content-control/v2';
		/**
		 * Route base.
		 *
		 * @var string
		 */
		protected $base = 'objectSearch';
		/**
		 * Register API endpoint routes.
		 *
		 * @return void
		 */
		public function register_routes() {
		}
		/**
		 * Get block type list.
		 *
		 * @param \WP_REST_Request<array<string,mixed>> $request Request object.
		 *
		 * @return WP_Error|WP_REST_Response
		 */
		public function object_search( $request ) {
		}
		/**
		 * Get a list of posts for a select list.
		 *
		 * @param string              $post_type Post type(s) to query.
		 * @param array<string,mixed> $args   Query arguments.
		 * @param boolean             $include_total Whether to include the total count in the response.
		 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
		 */
		public function post_type_selectlist_query( $post_type, $args = [], $include_total = false ) {
		}
		/**
		 * Get a list of terms for a select list.
		 *
		 * @param string              $taxonomy Taxonomy(s) to query.
		 * @param array<string,mixed> $args   Query arguments.
		 * @param boolean             $include_total Whether to include the total count in the response.
		 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
		 */
		public function taxonomy_selectlist_query( $taxonomy, $args = [], $include_total = false ) {
		}
		/**
		 * Get a list of users for a select list.
		 *
		 * @param array<string,mixed> $args Query arguments.
		 * @param bool                $include_total Whether to include the total count in the response.
		 *
		 * @return array{items:array<int,string>,totalCount:int}|array<int,string>
		 */
		public function user_selectlist_query( $args = [], $include_total = false ) {
		}
	}
}

namespace ContentControl\Interfaces {
	/**
	 * Localized controller class.
	 */
	interface Upgrade {

		/**
		 * Return label for this upgrade.
		 *
		 * @return string
		 */
		public function label();
		/**
		 * Return full description for this upgrade.
		 *
		 * @return string
		 */
		public function description();
		/**
		 * Check if this upgrade is required.
		 *
		 * @return bool
		 */
		public function is_required();
		/**
		 * Check if prerequisites are met.
		 *
		 * @return bool
		 */
		public function prerequisites_met();
		/**
		 * Run the upgrade.
		 *
		 * @return void|\WP_Error|false
		 */
		public function run();
	}
}

namespace ContentControl\Base {
	/**
	 * Base Upgrade class.
	 */
	abstract class Upgrade implements \ContentControl\Interfaces\Upgrade {

		/**
		 * Type.
		 *
		 * @var string Uses data versioning types.
		 */
		const TYPE = '';
		/**
		 * Version.
		 *
		 * @var int
		 */
		const VERSION = 1;
		/**
		 * Stream.
		 *
		 * @var \ContentControl\Services\UpgradeStream|null
		 */
		public $stream;
		/**
		 * Upgrade constructor.
		 */
		public function __construct() {
		}
		/**
		 * Upgrade label
		 *
		 * @return string
		 */
		abstract public function label();
		/**
		 * Return full description for this upgrade.
		 *
		 * @return string
		 */
		public function description() {
		}
		/**
		 * Check if the upgrade is required.
		 *
		 * @return bool
		 */
		public function is_required() {
		}
		/**
		 * Get the type of upgrade.
		 *
		 * @return string
		 */
		public function get_type() {
		}
		/**
		 * Check if the prerequisites are met.
		 *
		 * @return bool
		 */
		public function prerequisites_met() {
		}
		/**
		 * Get the dependencies for this upgrade.
		 *
		 * @return string[]
		 */
		public function get_dependencies() {
		}
		/**
		 * Run the upgrade.
		 *
		 * @return void|\WP_Error|false
		 */
		abstract public function run();
		/**
		 * Run the upgrade.
		 *
		 * @param \ContentControl\Services\UpgradeStream $stream Stream.
		 *
		 * @return bool|\WP_Error
		 */
		public function stream_run( $stream ) {
		}
		/**
		 * Return the stream.
		 *
		 * If no stream is available it returns a mock object with no-op methods to prevent errors.
		 *
		 * @return \ContentControl\Services\UpgradeStream|(object{
		 *      send_event: Closure,
		 *      send_error: Closure,
		 *      send_data: Closure,
		 *      update_status: Closure,
		 *      update_task_status: Closure,
		 *      start_upgrades: Closure,
		 *      complete_upgrades: Closure,
		 *      start_task: Closure,
		 *      update_task_progress:Closure,
		 *      complete_task: Closure
		 * }&\stdClass) Stream.
		 */
		public function stream() {
		}
	}
}

namespace ContentControl\Upgrades {
	/**
	 * Restrictions v2 migration.
	 */
	class Restrictions_2 extends \ContentControl\Base\Upgrade {

		const TYPE    = 'restrictions';
		const VERSION = 2;
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get the dependencies for this upgrade.
		 *
		 * @return string[]
		 */
		public function get_dependencies() {
		}
		/**
		 * Run the migration.
		 *
		 * @return void|\WP_Error|bool
		 */
		public function run() {
		}
		/**
		 * Migrate a given restriction to the new post type.
		 *
		 * @param array<string,mixed> $restriction Restriction data.
		 *
		 * @return bool True if successful, false otherwise.
		 */
		public function migrate_restriction( $restriction ) {
		}
	}
	/**
	 * Settings v2 migration.
	 */
	class Settings_2 extends \ContentControl\Base\Upgrade {

		const TYPE    = 'settings';
		const VERSION = 2;
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get the dependencies for this upgrade.
		 *
		 * @return string[]
		 */
		public function get_dependencies() {
		}
		/**
		 * Run the migration.
		 *
		 * @return void
		 */
		public function run() {
		}
	}
	/**
	 * Backup before v2 migration.
	 */
	abstract class Backup extends \ContentControl\Base\Upgrade {

		const TYPE    = 'backup';
		const VERSION = 1;
		/**
		 * The label for the file.
		 *
		 * @var string
		 */
		protected $file_label = 'Content Control v1 Data Backup';
		/**
		 * The file name.
		 *
		 * @var string
		 */
		protected $file_name = 'content-control_v1_data-backup.json';
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get v1 data.
		 *
		 * @return array<string,mixed>
		 */
		abstract public function get_data();
		/**
		 * Run the migration.
		 *
		 * @return void|\WP_Error|false
		 */
		public function run() {
		}
	}
	/**
	 * Backup before v2 migration.
	 */
	class Backup_2 extends \ContentControl\Base\Upgrade {

		const TYPE    = 'backup';
		const VERSION = 2;
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get v1 data.
		 *
		 * @return array<string,mixed>
		 */
		public function get_v1_data() {
		}
		/**
		 * Run the migration.
		 *
		 * @return void|\WP_Error|false
		 */
		public function run() {
		}
	}
	/**
	 * User meta v2 migration.
	 */
	class UserMeta_2 extends \ContentControl\Base\Upgrade {

		const TYPE    = 'user_meta';
		const VERSION = 2;
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get the dependencies for this upgrade.
		 *
		 * @return string[]
		 */
		public function get_dependencies() {
		}
		/**
		 * Get the remaps for this upgrade.
		 *
		 * @var array<string,string>
		 */
		private $remaps = [
			'_jp_cc_reviews_already_did'        => 'content_control_reviews_already_did',
			'_jp_cc_reviews_dismissed_triggers' => 'content_control_reviews_dismissed_triggers',
			'_jp_cc_reviews_last_dismissed'     => 'content_control_reviews_last_dismissed',
		];
		/**
		 * Check if the upgrade is required.
		 *
		 * @return bool
		 */
		public function is_required() {
		}
		/**
		 * Run the migration.
		 *
		 * @return void
		 */
		public function run() {
		}
	}
	/**
	 * Version 2 migration.
	 */
	class PluginMeta_2 extends \ContentControl\Base\Upgrade {

		const TYPE    = 'plugin_meta';
		const VERSION = 2;
		/**
		 * Get the label for the upgrade.
		 *
		 * @return string
		 */
		public function label() {
		}
		/**
		 * Get the dependencies for this upgrade.
		 *
		 * @return string[]
		 */
		public function get_dependencies() {
		}
		/**
		 * Get the remaps for this upgrade.
		 *
		 * @var array<string,string>
		 */
		private $remaps = [ 'jp_cc_reviews_installed_on' => 'content_control_installed_on' ];
		/**
		 * Check if the upgrade is required.
		 *
		 * @return bool
		 */
		public function is_required() {
		}
		/**
		 * Run the upgrade.
		 *
		 * @return void
		 */
		public function run() {
		}
	}
}

namespace ContentControl\QueryMonitor {
	/**
	 * Debug data collector.
	 *
	 * @phpstan-template T of \ContentControl\QueryMonitor\Data
	 */
	class Collector extends \QM_DataCollector {

		/**
		 * Collector ID.
		 *
		 * @var string
		 */
		public $id = 'content-control';
		/**
		 * The data.
		 *
		 * @var Data
		 * @phpstan-var T
		 */
		protected $data;
		/**
		 * Name of the output class.
		 *
		 * @return string
		 */
		public function name() {
		}
		/**
		 * Set up.
		 *
		 * @return void
		 */
		public function set_up() {
		}
		/**
		 * Tear down.
		 *
		 * @return void
		 */
		public function tear_down() {
		}
		/**
		 * Listen for user_can_view_content filter.
		 *
		 * @param bool                                 $user_can_view Whether content is restricted.
		 * @param int|null                             $post_id Post ID.
		 * @param \ContentControl\Models\Restriction[] $restrictions Restrictions.
		 *
		 * @return bool
		 */
		public function filter_user_can_view_content( $user_can_view, $post_id, $restrictions ) {
		}
		/**
		 * Listen for restrict_main_query action.
		 *
		 * @param \ContentControl\Models\Restriction $restriction Restriction.
		 *
		 * @return void
		 */
		public function action_restrict_main_query( $restriction ) {
		}
		/**
		 * Listen for restrict_main_query action.
		 *
		 * @param \ContentControl\Models\Restriction $restriction Restriction.
		 * @param int[]                              $post_ids    Post IDs.
		 *
		 * @return void
		 */
		public function action_restrict_main_query_post( $restriction, $post_ids ) {
		}
		/**
		 * Data to expose on the Query Monitor debug bar.
		 *
		 * @return void
		 */
		public function process() {
		}
	}
	/**
	 * QueryMonitor Output
	 */
	class Output extends \QM_Output_Html {

		/**
		 * Collector instance.
		 *
		 * @var QM_Collector Collector.
		 */
		protected $collector;
		/**
		 * Constructor
		 *
		 * @param QM_Collector $collector Collector.
		 */
		public function __construct( $collector ) {
		}
		/**
		 * Name of the output class.
		 *
		 * @return string
		 */
		public function name() {
		}
		/**
		 * Adds QM Memcache stats to admin panel
		 *
		 * @param array<string,string> $title Array of QM admin panel titles.
		 *
		 * @return array<string,string>
		 */
		public function admin_title( $title ) {
		}
		/**
		 * Add content-control class
		 *
		 * @param array<string,string> $classes Array of QM classes.
		 *
		 * @return array<int<0,max>|string,string>
		 */
		public function admin_class( $classes ) {
		}
		/**
		 * Adds Memcache stats item to Query Monitor Menu
		 *
		 * @param array<string,array<string,string>> $_menu Array of QM admin menu items.
		 *
		 * @return array<string,array<string,string>>
		 */
		public function admin_menu( $_menu ) {
		}
		/**
		 * Output the data.
		 *
		 * @return void
		 */
		public function output() {
		}
		/**
		 * Output the data.
		 *
		 * @return void
		 */
		public function output_global_settings() {
		}
		/**
		 * Output the data.
		 *
		 * @return void
		 */
		public function output_main_query_restrictions() {
		}
		/**
		 * Output the data.
		 *
		 * @return void
		 */
		public function output_post_restrictions() {
		}
	}
	/**
	 * Class data collector for structured data.
	 */
	class Data extends \QM_Data {

		/**
		 * Main query restriction.
		 *
		 * @var \ContentControl\Models\Restriction|null
		 */
		public $main_query_restriction = null;
		/**
		 * Main query post restrictions.
		 *
		 * @var array<array{restriction: \ContentControl\Models\Restriction, posts: int[]}>
		 */
		public $restrict_main_query_posts = [];
		/**
		 * List of posts checked for restrictions and their restrictions.
		 *
		 * @var array<array<string,mixed>>
		 */
		public $user_can_view_content = [];
	}
}

namespace ContentControl\Interfaces {
	/**
	 * Localized controller class.
	 */
	interface Controller {

		/**
		 * Handle hooks & filters or various other init tasks.
		 *
		 * @return void
		 */
		public function init();
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled();
	}
}

namespace ContentControl\Base {
	/**
	 * Localized container class.
	 */
	abstract class Controller implements \ContentControl\Interfaces\Controller {

		/**
		 * Plugin Container.
		 *
		 * @var \ContentControl\Plugin\Core
		 */
		public $container;
		/**
		 * Initialize based on dependency injection principles.
		 *
		 * @param \ContentControl\Plugin\Core $container Plugin container.
		 * @return void
		 */
		public function __construct( $container ) {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
	}
}

namespace ContentControl\Controllers\Compatibility {
	/**
	 * BetterDocs controller class.
	 */
	class BetterDocs extends \ContentControl\Base\Controller {

		/**
		 * Initiate hooks & filter.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
		/**
		 * Get intent for BetterDocs.
		 *
		 * @param array<string,mixed> $intent Intent.
		 *
		 * @return array<string,mixed>
		 */
		public function get_rest_api_intent( $intent ) {
		}
	}
	/**
	 * QueryMonitor
	 */
	class QueryMonitor extends \ContentControl\Base\Controller {

		/**
		 * Initialize the class
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
		/**
		 * Register collector.
		 *
		 * @return void
		 */
		public function register_collector() {
		}
		/**
		 * Add Query Monitor outputter.
		 *
		 * @param array<string,\QM_Output_Html> $output Outputters.
		 * @return array<string,\QM_Output_Html> Outputters.
		 */
		public function register_output_html( $output ) {
		}
	}
	/**
	 * Divi controller class.
	 */
	class Divi extends \ContentControl\Base\Controller {

		/**
		 * Initialize widget editor UX.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
		/**
		 * Conditionally disable Content Control for Divi builder.
		 *
		 * @param boolean $protection_is_disabled Whether protection is disabled.
		 * @return boolean
		 */
		public function protection_is_disabled( $protection_is_disabled ) {
		}
	}
	/**
	 * TheEventsCalendar controller class.
	 */
	class TheEventsCalendar extends \ContentControl\Base\Controller {

		/**
		 * Initiate hooks & filter.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
		/**
		 * Handle restrictions on the main query.
		 *
		 * When the main query is set to be redirected, TEC was cancelling the redirect. Returing true will allow the redirect to happen.
		 *
		 * @return void
		 */
		public function restrict_main_query() {
		}
	}
	/**
	 * Elementor controller class.
	 */
	class Elementor extends \ContentControl\Base\Controller {

		/**
		 * Initialize widget editor UX.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Check if controller is enabled.
		 *
		 * @return bool
		 */
		public function controller_enabled() {
		}
		/**
		 * Conditionally disable Content Control for Elementor builder.
		 *
		 * @param boolean $is_disabled Whether protection is disabled.
		 * @return boolean
		 */
		public function protection_is_disabled( $is_disabled ) {
		}
		/**
		 * Add Elementor font post type to ignored post types.
		 *
		 * @param string[] $post_types Post types to ignore.
		 * @return string[]
		 */
		public function post_types_to_ignore( $post_types ) {
		}
		/**
		 * Check if Elementor builder is active.
		 *
		 * @return boolean
		 */
		public function elementor_builder_is_active() {
		}
	}
}

namespace ContentControl\Controllers {
	/**
	 * Class Shortcodes
	 *
	 * @package ContentControl
	 */
	class Shortcodes extends \ContentControl\Base\Controller {

		/**
		 * Initialize Widgets
		 */
		public function init() {
		}
		/**
		 * Process the [content_control] shortcode.
		 *
		 * @param array<string,string|int|null> $atts Array or shortcode attributes.
		 * @param string                        $content Content inside shortcode.
		 *
		 * @return string
		 */
		public function content_control( $atts, $content = '' ) {
		}
		/**
		 * Takes set but empty attributes and sets them to true.
		 *
		 * These are typically valueless boolean attributes.
		 *
		 * @param array<string|int,string|int|null> $atts Array of shortcode attributes.
		 *
		 * @return (int|null|string|true)[]
		 *
		 * @psalm-return array<int|string, int|null|string|true>
		 */
		public function normalize_empty_atts( $atts = [] ) {
		}
	}
}

namespace ContentControl\Controllers\Frontend {
	/**
	 * Class Frontend
	 */
	class Blocks extends \ContentControl\Base\Controller {

		/**
		 * Initialize Hooks & Filters.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Adds custom attributes to allowed block attributes.
		 *
		 * @return void
		 */
		public function register_block_attributes() {
		}
		/**
		 * Check if block has controls enabled.
		 *
		 * @param array<string,mixed> $block Block to be checked.
		 * @return boolean Whether the block has Controls enabled.
		 */
		public function has_block_controls( $block ) {
		}
		/**
		 * Get blocks controls if enabled.
		 *
		 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
		 * @return array{enabled:bool,rules:array<string,mixed>}|null Controls if enabled.
		 */
		public function get_block_controls( $block ) {
		}
		/**
		 * Check block rules to see if it should be hidden from user.
		 *
		 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
		 *
		 * @return boolean Whether the block should be hidden.
		 */
		public function should_hide_block( $block ) {
		}
		/**
		 * Short curcuit block rendering for hidden blocks.
		 *
		 * @param string|null         $pre_render   The pre-rendered content. Default null.
		 * @param array<string,mixed> $parsed_block The block being rendered.
		 * @param \WP_Block|null      $parent_block If this is a nested block, a reference to the parent block.
		 *
		 * @return string|null
		 */
		public function pre_render_block( $pre_render, $parsed_block, $parent_block ) {
		}
		/**
		 * Check block rules to see if it should be hidden from user.
		 *
		 * @param bool                                   $should_hide Whether the block should be hidden.
		 * @param array<string,array<string,mixed>|null> $rules  Rules to check.
		 * @return bool
		 */
		public function block_user_rules( $should_hide, $rules ) {
		}
		/**
		 * Get any classes to be added to the outer block element.
		 *
		 * @param array{attrs:array<string,mixed>} $block Block to get controls for.
		 * @return null|string[]
		 */
		public function get_block_control_classes( $block ) {
		}
		/**
		 * Filter the block attributes, primarily to add classes and control visibility.
		 *
		 * References: https://github.com/WordPress/gutenberg/search?l=PHP&q=%27render_block%27
		 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/layout.php#L317
		 * - https://github.com/WordPress/gutenberg/blob/e776b4f00f690ce9cf21c027ebf5e7442420d716/lib/block-supports/duotone.php#L503
		 * - https://github.com/WordPress/gutenberg/blob/9aab0c4f60c78d19aae0af3351a2b66f8fa4c162/lib/block-supports/elements.php#L54-L72
		 *
		 * @param string              $block_content Blocks rendered html.
		 * @param array<string,mixed> $block Array of block properties.
		 *
		 * @return string
		 */
		public function render_block( $block_content, $block ) {
		}
		/**
		 * Print the styles for the block controls.
		 *
		 * @return void
		 */
		public function print_block_styles() {
		}
	}
	/**
	 * Class ContentControl\Frontend\Widgets
	 */
	class Widgets extends \ContentControl\Base\Controller {

		/**
		 * Initialize Widgets Frontend.
		 */
		public function init() {
		}
		/**
		 * Checks for and excludes widgets based on their chosen options.
		 *
		 * @param array<string,array<string>> $widget_areas An array of widget areas and their widgets.
		 *
		 * @return array<string,array<string>> The modified $widget_area array.
		 */
		public function exclude_widgets( $widget_areas ) {
		}
		/**
		 * Is customizer.
		 *
		 * @return boolean
		 */
		public function is_customize_preview() {
		}
	}
}

namespace ContentControl\Controllers\Frontend\Restrictions {
	/**
	 * Class for handling global restrictions of the post contents.
	 *
	 * @package ContentControl
	 */
	class PostContent extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 */
		public function init() {
		}
		/**
		 * Enable filters.
		 *
		 * @return void
		 */
		public function enable_filters() {
		}
		/**
		 * Disable filters.
		 *
		 * @return void
		 */
		public function disable_filters() {
		}
		/**
		 * Filter post content when needed.
		 *
		 * NOTE: If we got this far with restricted content, this is the last attempt to protect
		 * it. This serves as the default fallback protection method if all others fail.
		 *
		 * @param string $content Content of post being checked.
		 *
		 * @return string
		 */
		public function filter_the_content_if_restricted( $content ) {
		}
		/**
		 * Filter post excerpt when needed.
		 *
		 * @param string   $post_excerpt The post excerpt.
		 * @param \WP_Post $post         Post object.
		 *
		 * @return string
		 */
		public function filter_the_excerpt_if_restricted( $post_excerpt, $post = null ) {
		}
	}
	/**
	 * Class for handling global restrictions of the query posts.
	 *
	 * @package ContentControl
	 */
	class QueryTerms extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Register hooks.
		 *
		 * @return void
		 */
		public function register_hooks() {
		}
		/**
		 * Late hooks.
		 *
		 * @return void
		 */
		public function enable_query_filtering() {
		}
		/**
		 * Handle restricted content appropriately.
		 *
		 * NOTE. This is only for filtering terms, and should not
		 *       be used to redirect or replace the entire page.
		 *
		 * @param \WP_Term[]          $terms      Array of terms to filter.
		 * @param string              $taxonomy   The taxonomy.
		 * @param array<string,mixed> $query_vars Array of query vars.
		 * @param \WP_Term_Query      $query The WP_Query instance (passed by reference).
		 *
		 * @return \WP_Term[]
		 */
		public function restrict_query_terms( $terms, $taxonomy, $query_vars, $query ) {
		}
	}
	/**
	 * Class for handling global restrictions of the Rest API.
	 *
	 * @package ContentControl
	 */
	class RestAPI extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Handle a restriction on the rest api via pre_dispatch.
		 *
		 * @param mixed $result  Response to replace the requested resource with. Can be anything a normal endpoint can return, or null to not hijack the request.
		 * @param mixed $server  Server instance.
		 * @param mixed $request Request used to generate the response.
		 *
		 * @return mixed
		 */
		public function pre_dispatch( $result, $server, $request ) {
		}
	}
	/**
	 * Class for handling global restrictions of the Main Query.
	 *
	 * @package ContentControl
	 */
	class MainQuery extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 */
		public function init() {
		}
		/**
		 * Handle a restriction on the main query.
		 *
		 * NOTE: This is only for redirecting or replacing pages and
		 *       should not be used to filter or hide post contents.
		 *
		 * @return void
		 */
		public function restrict_main_query() {
		}
		/**
		 * Handle restrictions on the main query.
		 *
		 * NOTE: This is only for redirecting or replacing archives and
		 *       should not be used to filter or hide post contents.
		 *
		 * @return void
		 */
		public function check_main_query() {
		}
		/**
		 * Handle restrictions on the main query posts.
		 *
		 * NOTE: This is only for redirecting or replacing archives and
		 *       should not be used to filter or hide post contents.
		 *
		 * @return void
		 */
		public function check_main_query_posts() {
		}
	}
	/**
	 * Class for handling global restrictions of the query posts.
	 *
	 * @package ContentControl
	 */
	class QueryPosts extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Register hooks.
		 *
		 * @return void
		 */
		public function register_hooks() {
		}
		/**
		 * Late hooks.
		 *
		 * @return void
		 */
		public function enable_query_filtering() {
		}
		/**
		 * Handle restricted content appropriately.
		 *
		 * NOTE. This is only for filtering posts, and should not
		 *       be used to redirect or replace the entire page.
		 *
		 * @param \WP_Post[] $posts Array of post objects.
		 * @param \WP_Query  $query The WP_Query instance (passed by reference).
		 *
		 * @return \WP_Post[]
		 */
		public function restrict_query_posts( $posts, $query ) {
		}
	}
}

namespace ContentControl\Controllers\Frontend {
	/**
	 * Class for handling global restrictions.
	 *
	 * @package ContentControl
	 */
	class Restrictions extends \ContentControl\Base\Controller {

		/**
		 * Initiate functionality.
		 */
		public function init() {
		}
	}
}

namespace ContentControl\Controllers\Admin {
	/**
	 * Settings Page Controller.
	 *
	 * @package ContentControl\Admin
	 */
	class SettingsPage extends \ContentControl\Base\Controller {

		/**
		 * Initialize the settings page.
		 */
		public function init() {
		}
		/**
		 * Register admin options pages.
		 *
		 * @return void
		 */
		public function register_page() {
		}
		/**
		 * Render settings page title & container.
		 *
		 * @return void
		 */
		public function render_page() {
		}
		/**
		 * Enqueue assets for the settings page.
		 *
		 * @param string $hook Page hook name.
		 *
		 * @return void
		 */
		public function enqueue_scripts( $hook ) {
		}
		/**
		 * Verify the connection.
		 *
		 * @return void
		 */
		public function process_verify_connection() {
		}
		/**
		 * Listen for incoming secure webhooks from the API server.
		 *
		 * @return void
		 */
		public function process_webhook() {
		}
	}
	/**
	 * UserExperience controller class.
	 */
	class UserExperience extends \ContentControl\Base\Controller {

		/**
		 * Initialize widget editor UX.
		 *
		 * @return void
		 */
		public function init() {
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
		}
	}
	/**
	 * WidgetEditor controller class.
	 */
	class WidgetEditor extends \ContentControl\Base\Controller {

		/**
		 * Initialize widget editor UX.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Enqueue v1 admin scripts.
		 *
		 * @param mixed $hook Admin page hook name.
		 *
		 * @return void
		 */
		public function enqueue_assets( $hook ) {
		}
		/**
		 * Renders additional widget option fields.
		 *
		 * @param \WP_Widget          $widget Widget instance.
		 * @param bool                $ret Whether to return the output.
		 * @param array<string,mixed> $instance Widget instance options.
		 *
		 * @return void
		 */
		public function fields( $widget, $ret, $instance ) {
		}
		/**
		 * Validates & saves additional widget options.
		 *
		 * @param array<string,mixed> $instance Widget instance options.
		 * @param array<string,mixed> $new_instance New widget instance options.
		 * @param array<string,mixed> $old_instance Old widget instance options.
		 *
		 * @return array<string,mixed>|bool
		 */
		public function save( $instance, $new_instance, $old_instance ) {
		}
	}
	/**
	 * Upgrades Controller.
	 *
	 * @package ContentControl\Admin
	 */
	class Upgrades extends \ContentControl\Base\Controller {

		/**
		 * Initialize the settings page.
		 */
		public function init() {
		}
		/**
		 * Hook into relevant WP actions.
		 *
		 * @return void
		 */
		public function hooks() {
		}
		/**
		 * Get a list of all upgrades.
		 *
		 * @return string[]
		 */
		public function all_upgrades() {
		}
		/**
		 * Check if there are any upgrades to run.
		 *
		 * @return boolean
		 */
		public function has_upgrades() {
		}
		/**
		 * Get a list of required upgrades.
		 *
		 * Uses a cached list of done upgrades to prevent extra processing.
		 *
		 * @return \ContentControl\Base\Upgrade[]
		 */
		public function get_required_upgrades() {
		}
		/**
		 * Sort upgrades based on prerequisites using a graph-based approach.
		 *
		 * @param \ContentControl\Base\Upgrade[] $upgrades List of upgrades to sort.
		 *
		 * @return \ContentControl\Base\Upgrade[]
		 */
		private function sort_upgrades_by_prerequisites( $upgrades ) {
		}
		/**
		 * Perform a topological sort on a graph.
		 *
		 * @param array<string,array<string>> $graph Graph to sort.
		 *
		 * @return array<string>
		 */
		private function topological_sort( $graph ) {
		}
		/**
		 * Visit a node in the graph for topological sort.
		 *
		 * @param string                      $node Node to visit.
		 * @param array<string,array<string>> $graph Graph to sort.
		 * @param array<string,bool>          $visited List of visited nodes.
		 * @param array<string>               $sorted List of sorted nodes.
		 *
		 * @return void
		 */
		private function visit_node( $node, $graph, &$visited, &$sorted ) {
		}
		/**
		 * AJAX Handler.
		 *
		 * @return void
		 */
		public function ajax_handler() {
		}
		/**
		 * AJAX Handler.
		 *
		 * @return void
		 */
		public function ajax_handler_demo() {
		}
		/**
		 * Render admin notices if available.
		 *
		 * @return void
		 */
		public function admin_notices() {
		}
		/**
		 * Add localized vars to settings page if there are upgrades to run.
		 *
		 * @param array<string,mixed> $vars Localized vars.
		 *
		 * @return array<string,mixed>
		 */
		public function localize_vars( $vars ) {
		}
	}
	/**
	 * Class ContentControl\Admin\Reviews
	 *
	 * This class adds a review request system for your plugin or theme to the WP dashboard.
	 *
	 * @since 1.1.0
	 */
	class Reviews extends \ContentControl\Base\Controller {

		/**
		 * Enable debug mode.
		 *
		 * @var boolean
		 */
		private $debug = false;
		/**
		 * Debug trigger.
		 *
		 * @var array{group:string,code:string}
		 */
		private $debug_trigger = [
			'group' => 'time_installed',
			'code'  => 'one_week',
		];
		/**
		 * Tracking API Endpoint.
		 *
		 * @var string
		 */
		public $api_url;
		/**
		 * Initialize review requests.
		 */
		public function init() {
		}
		/**
		 * Hook into relevant WP actions.
		 *
		 * @return void
		 */
		public function hooks() {
		}
		/**
		 * Get the install date for comparisons. Sets the date to now if none is found.
		 *
		 * @return false|string
		 */
		public function installed_on() {
		}
		/**
		 * AJAX Handler
		 *
		 * @return void
		 */
		public function ajax_handler() {
		}
		/**
		 * Get the current trigger group and code.
		 *
		 * @return int|string
		 */
		public function get_trigger_group() {
		}
		/**
		 * Get the current trigger group and code.
		 *
		 * @return int|string
		 */
		public function get_trigger_code() {
		}
		/**
		 * Get the current trigger.
		 *
		 * @param string $key Optional. Key to return from the trigger array.
		 *
		 * @return bool|mixed
		 */
		public function get_current_trigger( $key = null ) {
		}
		/**
		 * Returns an array of dismissed trigger groups.
		 *
		 * Array contains the group key and highest priority trigger that has been shown previously for each group.
		 *
		 * $return = array(
		 *   'group1' => 20
		 * );
		 *
		 * @return array|mixed
		 */
		public function dismissed_triggers() {
		}
		/**
		 * Returns true if the user has opted to never see this again. Or sets the option.
		 *
		 * @param bool $set If set this will mark the user as having opted to never see this again.
		 *
		 * @return bool
		 */
		public function already_did( $set = false ) {
		}
		/**
		 * Gets a list of triggers.
		 *
		 * @param string $group Trigger group.
		 * @param string $code Trigger code.
		 *
		 * @return bool|mixed
		 */
		public function triggers( $group = null, $code = null ) {
		}
		/**
		 * Render admin notices if available.
		 *
		 * @return void
		 */
		public function admin_notices() {
		}
		/**
		 * Checks if notices should be shown.
		 *
		 * @return bool
		 */
		public function hide_notices() {
		}
		/**
		 * Gets the last dismissed date.
		 *
		 * @return false|string
		 */
		public function last_dismissed() {
		}
		/**
		 * Sort array in reverse by priority value
		 *
		 * @param array{pri:int|null} $a First array to compare.
		 * @param array{pri:int|null} $b Second array to compare.
		 *
		 * @return int
		 */
		public function rsort_by_priority( $a, $b ) {
		}
	}
}

namespace ContentControl\Controllers {
	/**
	 * RestAPI function initialization.
	 */
	class RestAPI extends \ContentControl\Base\Controller {

		/**
		 * Initiate rest api integrations.
		 */
		public function init() {
		}
		/**
		 * Register Rest API routes.
		 *
		 * @return void
		 */
		public function register_routes() {
		}
		/**
		 * Modify show_in_rest for post types.
		 *
		 * @param array<string,mixed> $args Post type args.
		 *
		 * @return array<string,mixed>
		 */
		public function modify_post_type_show_in_rest( $args ) {
		}
		/**
		 * Modify show_in_rest for taxonomies.
		 *
		 * @param array<string,mixed> $args Taxonomy args.
		 *
		 * @return array<string,mixed>
		 */
		public function modify_taxonomy_show_in_rest( $args ) {
		}
		/**
		 * Modify show_in_rest for post types.
		 *
		 * @param array<string,mixed> $args Post type args.
		 * @param boolean             $include_private Whether to include private post types.
		 *
		 * @return array<string,mixed>
		 */
		public function modify_type_force_show_in_rest( $args, $include_private = false ) {
		}
		/**
		 * Force show_in_rest to true.
		 *
		 * @return boolean
		 */
		public function force_show_in_rest() {
		}
	}
	/**
	 * Class BlockEditor
	 *
	 * @version 2.0.0
	 */
	class BlockEditor extends \ContentControl\Base\Controller {

		/**
		 * Initiate hooks & filter.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Enqueue block editor assets.
		 *
		 * @return void
		 */
		public function enqueue_assets() {
		}
		/**
		 * Enqueue block assets.
		 *
		 * @return void
		 */
		public function enqueue_block_assets() {
		}
	}
	/**
	 * Post type controller.
	 */
	class PostTypes extends \ContentControl\Base\Controller {

		/**
		 * Init controller.
		 *
		 * @return void
		 */
		public function init() {
		}
		/**
		 * Register `restriction` post type.
		 *
		 * @return void
		 */
		public function register_post_type() {
		}
		/**
		 * Registers custom REST API fields for cc_restrictions post type.
		 *
		 * @return void
		 */
		public function register_rest_fields() {
		}
		/**
		 * Sanitize restriction settings.
		 *
		 * @param array<string,mixed> $settings The settings to sanitize.
		 * @param int                 $id       The restriction ID.
		 *
		 * @return array<string,mixed> The sanitized settings.
		 */
		public function sanitize_restriction_settings( $settings, $id ) {
		}
		/**
		 * Validate restriction settings.
		 *
		 * @param array<string,mixed> $settings The settings to validate.
		 * @param int                 $id       The restriction ID.
		 *
		 * @return bool|\WP_Error True if valid, WP_Error if not.
		 */
		public function validate_restriction_settings( $settings, $id ) {
		}
		/**
		 * Add data version meta to new restrictions.
		 *
		 * @param int      $post_id Post ID.
		 * @param \WP_Post $post    Post object.
		 * @param bool     $update  Whether this is an existing post being updated or not.
		 *
		 * @return void
		 */
		public function save_post( $post_id, $post, $update ) {
		}
		/**
		 * Prevent access to restrictions endpoint.
		 *
		 * @param mixed                                 $result Response to replace the requested version with.
		 * @param \WP_REST_Server                       $server Server instance.
		 * @param \WP_REST_Request<array<string,mixed>> $request  Request used to generate the response.
		 * @return mixed
		 */
		public function rest_pre_dispatch( $result, $server, $request ) {
		}
	}
	/**
	 * Admin controller  class.
	 *
	 * @package ContentControl
	 */
	class Admin extends \ContentControl\Base\Controller {

		/**
		 * Initialize admin controller.
		 *
		 * @return void
		 */
		public function init() {
		}
	}
	/**
	 * TrustedLogin.
	 *
	 * @package ContentControl
	 */
	class TrustedLogin extends \ContentControl\Base\Controller {

		/**
		 * TrustedLogin init.
		 */
		public function init() {
		}
		/**
		 * Hooks.
		 *
		 * @return void
		 */
		public function initiate_trustedlogin() {
		}
		/**
		 * Admin menu.
		 *
		 * @return void
		 */
		public function admin_menu() {
		}
	}
	/**
	 * Admin controller  class.
	 *
	 * @package ContentControl
	 */
	class Compatibility extends \ContentControl\Base\Controller {

		/**
		 * Initialize admin controller.
		 *
		 * @return void
		 */
		public function init() {
		}
	}
	/**
	 * Admin assets controller.
	 *
	 * @package ContentControl\Admin
	 */
	class Assets extends \ContentControl\Base\Controller {

		/**
		 * Initialize the assets controller.
		 */
		public function init() {
		}
		/**
		 * Get list of plugin packages.
		 *
		 * @return array<string,array<string,mixed>>
		 */
		public function get_packages() {
		}
		/**
		 * Register all package scripts & styles.
		 *
		 * @return void
		 */
		public function register_scripts() {
		}
		/**
		 * Auto load styles if scripts are enqueued.
		 *
		 * @return void
		 */
		public function autoload_styles_for_scripts() {
		}
		/**
		 * Get asset meta from generated files.
		 *
		 * @param string $package Package name.
		 * @return array{dependencies:string[],version:string}
		 */
		public function get_asset_meta( $package ) {
		}
	}
	/**
	 * Class Frontend
	 */
	class Frontend extends \ContentControl\Base\Controller {

		/**
		 * Initialize Hooks & Filters
		 */
		public function init() {
		}
		/**
		 * Register general frontend hooks.
		 *
		 * @return void
		 */
		public function hooks() {
		}
		/**
		 * Replicate core content filters.
		 *
		 * @return void
		 */
		private function replicate_core_content_filters() {
		}
	}
}

namespace ContentControl\Base {
	/**
	 * Localized container class.
	 */
	class Container extends \ContentControl\Vendor\Pimple\Container {

		/**
		 * Get item from container
		 *
		 * @param string $id Key for the item.
		 *
		 * @return mixed Current value of the item.
		 */
		public function get( $id ) {
		}
		/**
		 * Set item in container
		 *
		 * @param string $id Key for the item.
		 * @param mixed  $value Value to be set.
		 *
		 * @return void
		 */
		public function set( $id, $value ) {
		}
	}
	/**
	 * HTTP Stream class.
	 */
	class Stream {

		/**
		 * Stream name.
		 *
		 * @var string
		 */
		protected $stream_name;
		/**
		 * Version.
		 *
		 * @var string
		 */
		const VERSION = '1.0.0';
		/**
		 * Stream constructor.
		 *
		 * @param string $stream_name Stream name.
		 */
		public function __construct( $stream_name = 'stream' ) {
		}
		/**
		 * Start SSE stream.
		 *
		 * @return void
		 */
		public function start() {
		}
		/**
		 * Send SSE headers.
		 *
		 * @return void
		 */
		public function send_headers() {
		}
		/**
		 * Flush buffers.
		 *
		 * Uses a micro delay to prevent the stream from flushing too quickly.
		 *
		 * @return void
		 */
		protected function flush_buffers() {
		}
		/**
		 * Send general message/data to the client.
		 *
		 * @param mixed $data Data to send.
		 *
		 * @return void
		 */
		public function send_data( $data ) {
		}
		/**
		 * Send an event to the client.
		 *
		 * @param string $event Event name.
		 * @param mixed  $data Data to send.
		 *
		 * @return void
		 */
		public function send_event( $event, $data = '' ) {
		}
		/**
		 * Send an error to the client.
		 *
		 * @param array{message:string}|string $error Error message.
		 *
		 * @return void
		 */
		public function send_error( $error ) {
		}
		/**
		 * Check if the connection should abort.
		 *
		 * @return bool
		 */
		public function should_abort() {
		}
	}
}

namespace ContentControl\Services {
	/**
	 * Globals service.
	 */
	class Globals {

		/**
		 * Context.
		 *
		 * @var string|null
		 */
		public $current_query_context = null;
		/**
		 * Current query.
		 *
		 * @var \WP_Query|\WP_Term_Query|null
		 */
		public $current_query = null;
		/**
		 * Current post query.
		 *
		 * @var \WP_Query|null
		 */
		public $current_post_query = null;
		/**
		 * Current term query.
		 *
		 * @var \WP_Term_Query|null
		 */
		public $current_term_query = null;
		/**
		 * Current term.
		 *
		 * @var \WP_Term|null
		 */
		public $term = null;
		/**
		 * Overloaded posts stack.
		 *
		 * @var \WP_Post[]|null $overloaded_posts
		 */
		public $overloaded_posts = null;
		/**
		 * Overloaded terms stack.
		 *
		 * @var \WP_Term[]|null $overloaded_terms
		 */
		public $overloaded_terms = null;
		/**
		 * Last term.
		 *
		 * @var \WP_Term[]|null
		 */
		public $last_term = null;
		/**
		 * Current rule.
		 *
		 * @var \ContentControl\Models\RuleEngine\Rule|null
		 */
		public $current_rule = null;
		/**
		 * Current intent.
		 *
		 * @var null|array{
		 *      type: string,
		 *      name: string,
		 *      id: int,
		 *      index: bool,
		 *      search: string|false,
		 * }
		 */
		public $rest_intent = null;
		/**
		 * Constructor.
		 */
		public function __construct() {
		}
		/**
		 * Get context items by key.
		 *
		 * @param string $key Context key.
		 * @param mixed  $default_value Default value.
		 *
		 * @return mixed
		 */
		public function get( $key, $default_value = null ) {
		}
		/**
		 * Set context items by key.
		 *
		 * @param string $key Context key.
		 * @param mixed  $value Context value.
		 *
		 * @return void
		 */
		public function set( $key, $value ) {
		}
		/**
		 * Reset context items by key.
		 *
		 * @param string $key Context key.
		 *
		 * @return void
		 */
		public function reset( $key ) {
		}
		/**
		 * Reset all context items.
		 *
		 * @return void
		 */
		public function reset_all() {
		}
		/**
		 * Push to stack.
		 *
		 * @param string $key Context key.
		 * @param mixed  $value Context value.
		 *
		 * @return void
		 */
		public function push_to_stack( $key, $value ) {
		}
		/**
		 * Pop from stack.
		 *
		 * @param string $key Context key.
		 *
		 * @return mixed
		 */
		public function pop_from_stack( $key ) {
		}
		/**
		 * Check if stack is empty.
		 *
		 * @param string $key Context key.
		 *
		 * @return bool
		 */
		public function is_empty( $key ) {
		}
	}
	/**
	 * HTTP Stream class.
	 */
	class UpgradeStream extends \ContentControl\Base\Stream {

		/**
		 * Upgrade status.
		 *
		 * @var array{total:int,progress:int,currentTask:null|array{name:string,total:int,progress:int}}|null
		 */
		public $status = [
			'total'       => 0,
			'progress'    => 0,
			'currentTask' => null,
		];
		/**
		 * Update the status of the upgrade.
		 *
		 * @param array{total?:int|null,progress?:int|null,curentTask?:string|null} $status Status to update.
		 *
		 * @return void
		 */
		public function update_status( $status ) {
		}
		/**
		 * Update the status of the current task.
		 *
		 * @param array{total?:int,progress?:int,curentTask?:string}|null $task_status Status to update.
		 *
		 * @return void
		 */
		public function update_task_status( $task_status ) {
		}
		/**
		 * Send an event to the client.
		 *
		 * @param string $event Event name.
		 * @param mixed  $data Data to send.
		 *
		 * @return void
		 */
		public function send_event( $event, $data = [] ) {
		}
		/**
		 * Start the upgrade process.
		 *
		 * @param int    $total Number of upgrades.
		 * @param string $message Message to send.
		 *
		 * @return void
		 */
		public function start_upgrades( $total, $message = null ) {
		}
		/**
		 * Complete the upgrade process.
		 *
		 * @param string $message Message to send.
		 *
		 * @return void
		 */
		public function complete_upgrades( $message = null ) {
		}
		/**
		 * Start a task.
		 *
		 * @param string $name Task name.
		 * @param int    $task_steps Number of steps in the task.
		 * @param string $message Message to send.
		 *
		 * @return void
		 */
		public function start_task( $name, $task_steps = 1, $message = null ) {
		}
		/**
		 * Update the progress of the current task.
		 *
		 * @param int $progress Progress of the task.
		 *
		 * @return void
		 */
		public function update_task_progress( $progress ) {
		}
		/**
		 * Complete the current task.
		 *
		 * @param string $message Message to send.
		 *
		 * @return void
		 */
		public function complete_task( $message = null ) {
		}
	}
	/**
	 * Restrictions service.
	 */
	class Restrictions {

		/**
		 * Array of all restrictions sorted by priority.
		 *
		 * @var Restriction[]|null
		 */
		public $restrictions;
		/**
		 * Array of all restrictions by ID.
		 *
		 * @var array<int,Restriction>|null
		 */
		public $restrictions_by_id;
		/**
		 * Simple internal request based cache.
		 *
		 * @var array<int,array<string,Restriction[]|false>>
		 */
		public $restriction_matches_cache = [];
		/**
		 * Initialize the service.
		 *
		 * @since 2.4.0
		 */
		public function __construct() {
		}
		/**
		 * Get a list of all restrictions sorted by priority.
		 *
		 * @return array<int,Restriction>
		 */
		public function get_restrictions() {
		}
		/**
		 * Get restriction, by ID, slug or object.
		 *
		 * @param int|string|Restriction $restriction Restriction ID, slug or object.
		 *
		 * @return Restriction|null
		 */
		public function get_restriction( $restriction ) {
		}
		/**
		 * Get applicable restrictions for the given content.
		 *
		 * If $single is true, return the first applicable restriction. If false, return all applicable restrictions.
		 * Sorted by priority and cached internally.
		 *
		 * @param int|null $content_id Content ID.
		 * @param bool     $single     Whether to return a single match or an array of matches.
		 *
		 * @return Restriction|Restriction[]|false
		 */
		public function get_applicable_restrictions( $content_id = null, $single = true ) {
		}
		/**
		 * Check if post has applicable restrictions.
		 *
		 * Cached via get_applicable_restriction().
		 *
		 * @param int|null $post_id Post ID.
		 *
		 * @return boolean
		 */
		public function has_applicable_restrictions( $post_id = null ) {
		}
		/**
		 * Check if user meets requirements for given restriction.
		 *
		 * @param int|string|Restriction $restriction Restriction ID, slug or object.
		 *
		 * @return boolean
		 */
		public function user_meets_requirements( $restriction ) {
		}
		/**
		 * Sort restrictions based on post sort order.
		 *
		 * MOVE to restrictions file.
		 *
		 * @param \ContentControl\Models\Restriction[] $restrictions Restrictions.
		 *
		 * @return \ContentControl\Models\Restriction[]
		 */
		public function sort_restrictions_by_priority( $restrictions ) {
		}
		/**
		 * Generate cache key for restrictions.
		 *
		 * @param int|null $content_id Content ID.
		 *
		 * @return string
		 */
		public function generate_restriction_matches_cache_key( $content_id ) {
		}
		/**
		 * Prime restriction matches cache.
		 *
		 * @param array<int,array<string,Restriction[]|false>> $restriction_matches_cache Restriction matches cache.
		 *
		 * @return void
		 *
		 * @since 2.4.0
		 */
		public function prime_restriction_matches_cache( $restriction_matches_cache = null ) {
		}
		/**
		 * Get matches from cache.
		 *
		 * @param int|null $content_id Content ID.
		 * @param bool     $single    Whether to return a single match or an array of matches.
		 *
		 * @return Restriction[]|false|null
		 */
		public function get_restriction_matches_from_cache( $content_id = null, $single = true ) {
		}
		/**
		 * Set in cache for matches.
		 *
		 * @param int|null            $content_id Content ID.
		 * @param Restriction[]|false $matches Value to set.
		 * @param bool                $single    Whether to return a single match or an array of matches.
		 *
		 * @return void
		 */
		public function set_restriction_matches_in_cache( $content_id = null, $matches = false, $single = true ) {
		}
	}
}

namespace ContentControl\Installers {
	/**
	 * Class PluginSilentUpgraderSkin.
	 *
	 * @internal Please do not use this class outside of core plugin development. May be removed at any time.
	 *
	 * @since 2.0.0
	 */
	class PluginSilentUpgraderSkin extends \WP_Upgrader_Skin {

		/**
		 * Empty out the header of its HTML content and only check to see if it has
		 * been performed or not.
		 *
		 * @return void
		 */
		public function header() {
		}
		/**
		 * Empty out the footer of its HTML contents.
		 *
		 * @return void
		 */
		public function footer() {
		}
		/**
		 * Instead of outputting HTML for errors, just return them.
		 * Ajax request will just ignore it.
		 *
		 * @param string|\WP_Error $errors Array of errors with the install process.
		 *
		 * @return string|\WP_Error
		 */
		public function error( $errors ) {
		}
		/**
		 * Empty out JavaScript output that calls function to decrement the update counts.
		 *
		 * @param string $type Type of update count to decrement.
		 *
		 * @return void
		 */
		public function decrement_update_count( $type ) {
		}
	}
	/**
	 * Skin for on-the-fly addon installations.
	 *
	 * @since 1.0.0
	 * @since 2.0.0 Extend PluginSilentUpgraderSkin and clean up the class.
	 */
	class Install_Skin extends \ContentControl\Installers\PluginSilentUpgraderSkin {

		/**
		 * Instead of outputting HTML for errors, json_encode the errors and send them
		 * back to the Ajax script for processing.
		 *
		 * @since 2.0.0
		 *
		 * @param string|\WP_Error $errors Array of errors with the install process.
		 */
		public function error( $errors ) {
		}
	}
	/**
	 * In WP 5.3 a PHP 5.6 splat operator (...$args) was added to \WP_Upgrader_Skin::feedback().
	 * We need to remove all calls to *Skin::feedback() method, as we can't override it in own Skins
	 * without breaking support for PHP 5.3-5.5.
	 *
	 * @internal Please do not use this class outside of core plugin development. May be removed at any time.
	 *
	 * @since 2.0.0
	 */
	class PluginSilentUpgrader extends \Plugin_Upgrader {

		/**
		 * Run an upgrade/installation.
		 *
		 * Attempt to download the package (if it is not a local file), unpack it, and
		 * install it in the destination folder.
		 *
		 * @since 2.0.0
		 *
		 * @param array{package:string,destination:string,clear_destination:bool,clear_working:bool,abort_if_destination_exists:bool,is_multi:bool,hook_extra:array<string,mixed>} $options {
		 *     Array or string of arguments for upgrading/installing a package.
		 *
		 *     @type string $package                     The full path or URI of the package to install.
		 *                                               Default empty.
		 *     @type string $destination                 The full path to the destination folder.
		 *                                               Default empty.
		 *     @type bool   $clear_destination           Whether to delete any files already in the
		 *                                               destination folder. Default false.
		 *     @type bool   $clear_working               Whether to delete the files form the working
		 *                                               directory after copying to the destination.
		 *                                               Default false.
		 *     @type bool   $abort_if_destination_exists Whether to abort the installation if the destination
		 *                                               folder already exists. When true, `$clear_destination`
		 *                                               should be false. Default true.
		 *     @type bool   $is_multi                    Whether this run is one of multiple upgrade/installation
		 *                                               actions being performed in bulk. When true, the skin
		 *                                               WP_Upgrader::header() and WP_Upgrader::footer()
		 *                                               aren't called. Default false.
		 *     @type array  $hook_extra                  Extra arguments to pass to the filter hooks called by
		 *                                               WP_Upgrader::run().
		 * }
		 * @return array{source:string,source_files:string[],destination:string,destination_name:string,local_destination:string,remote_destination:string,clear_destination:bool}|\WP_Error|bool The result from self::install_package() on success, otherwise a WP_Error,
		 *                              or false if unable to connect to the filesystem.
		 */
		public function run( $options ) {
		}
		/**
		 * Toggle maintenance mode for the site.
		 *
		 * Create/delete the maintenance file to enable/disable maintenance mode.
		 *
		 * @since 2.8.0
		 *
		 * @global WP_Filesystem_Base $wp_filesystem Subclass
		 *
		 * @param bool $enable True to enable maintenance mode, false to disable.
		 *
		 * @return void
		 */
		public function maintenance_mode( $enable = false ) {
		}
		/**
		 * Download a package.
		 *
		 * @since 2.8.0
		 * @since 5.5.0 Added the `$hook_extra` parameter.
		 *
		 * @param string              $package          The URI of the package. If this is the full path to an
		 *                                              existing local file, it will be returned untouched.
		 * @param bool                $check_signatures Whether to validate file signatures. Default false.
		 * @param array<string,mixed> $hook_extra       Extra arguments to pass to the filter hooks. Default empty array.
		 * @return string|WP_Error The full path to the downloaded package file, or a WP_Error object.
		 */
		public function download_package( $package, $check_signatures = false, $hook_extra = [] ) {
		}
		/**
		 * Unpack a compressed package file.
		 *
		 * @since 2.8.0
		 *
		 * @global WP_Filesystem_Base $wp_filesystem WordPress filesystem subclass.
		 *
		 * @param string $package        Full path to the package file.
		 * @param bool   $delete_package Optional. Whether to delete the package file after attempting
		 *                               to unpack it. Default true.
		 * @return string|WP_Error The path to the unpacked contents, or a WP_Error on failure.
		 */
		public function unpack_package( $package, $delete_package = true ) {
		}
		/**
		 * Install a package.
		 *
		 * Copies the contents of a package form a source directory, and installs them in
		 * a destination directory. Optionally removes the source. It can also optionally
		 * clear out the destination folder if it already exists.
		 *
		 * @since 2.8.0
		 *
		 * @global WP_Filesystem_Base $wp_filesystem        WordPress filesystem subclass.
		 * @global array              $wp_theme_directories
		 *
		 * @param array<string,mixed>|array{source:string|null,destination:string,clear_destination:bool,clear_working:bool,abort_if_destination_exists:bool,hook_extra:array<mixed>} $args {
		 *     Optional. Array or string of arguments for installing a package. Default empty array.
		 *
		 *     @type string $source                      Required path to the package source. Default empty.
		 *     @type string $destination                 Required path to a folder to install the package in.
		 *                                               Default empty.
		 *     @type bool   $clear_destination           Whether to delete any files already in the destination
		 *                                               folder. Default false.
		 *     @type bool   $clear_working               Whether to delete the files form the working directory
		 *                                               after copying to the destination. Default false.
		 *     @type bool   $abort_if_destination_exists Whether to abort the installation if
		 *                                               the destination folder already exists. Default true.
		 *     @type array  $hook_extra                  Extra arguments to pass to the filter hooks called by
		 *                                               WP_Upgrader::install_package(). Default empty array.
		 * }
		 *
		 * @return array{source:string,source_files:string[],destination:string,destination_name:string,local_destination:string,remote_destination:string,clear_destination:bool}|\WP_Error The result (also stored in `WP_Upgrader::$result`), or a WP_Error on failure.
		 */
		public function install_package( $args = [] ) {
		}
		/**
		 * Install a plugin package.
		 *
		 * @since 1.6.3
		 *
		 * @param string              $package The full local path or URI of the package.
		 * @param array<string,mixed> $args    Optional. Other arguments for installing a plugin package. Default empty array.
		 *
		 * @return bool|\WP_Error True if the installation was successful, false or a WP_Error otherwise.
		 */
		public function install( $package, $args = [] ) {
		}
	}
}

namespace {
	/**
	 * Class JP_Content_Control
	 *
	 * @deprecated 2.0.0 Use \ContentControl\Plugin instead.
	 */
	class JP_Content_Control {

	}
}

namespace JP\CC {
	/**
	 * Conditional helper utilities.
	 *
	 * @package ContentControl
	 *
	 * @deprecated 2.0.0
	 */
	class Is {

		/**
		 * Check if a content is accessible to current user.
		 *
		 * @param string                               $who logged_in or logged_out.
		 * @param string[]|array<string,string>|string $roles array of roles to check.
		 *
		 * @return bool
		 *
		 * @deprecated 2.0.0
		 */
		public static function accessible( $who = '', $roles = [] ) {
		}
		/**
		 * Check if a content is blocked to current user.
		 *
		 * @param string                               $who logged_in or logged_out.
		 * @param string[]|array<string,string>|string $roles array of roles to check.
		 *
		 * @return boolean
		 *
		 * @deprecated 2.0.0
		 */
		public static function restricted( $who = '', $roles = [] ) {
		}
	}
}

namespace JP\CC\Site {
	/**
	 * Frontend restriction controller.
	 */
	class Restrictions {

		/**
		 * Protected posts.
		 *
		 * @var array<int>
		 */
		public static $protected_posts = [];
		/**
		 * Method to get the protected post content.
		 *
		 * @return string
		 */
		public static function restricted_content() {
		}
	}
}

/**
 * Widget utility functions.
 *
 * @package ContentControl
 * @copyright (c) 2023 Code Atlantic LLC.
 */
namespace ContentControl\Widgets {
	/**
	 * Retrieve data for a widget from options table.
	 *
	 * @param string $widget_id The unique ID of a widget.
	 *
	 * @return array<string,mixed> The array of widget settings or empty array if none
	 */
	function get_options( $widget_id ) {
	}
	/**
	 * Checks for & adds missing widget options to prevent errors or missing data.
	 *
	 * @param array<string,mixed> $options Widget options.
	 *
	 * @return array<string,mixed>
	 */
	function parse_options( $options = [] ) {
	}
}

/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */
namespace ContentControl {
	/**
	 * Check if content has restrictions.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	function content_has_restrictions( $content_id = null ) {
	}
	/**
	 * Check if user can access content.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return bool True if user meets requirements, false if not.
	 *
	 * @since 2.0.0
	 */
	function user_can_view_content( $content_id = null ) {
	}
	/**
	 * Helper that checks if given or current content is restricted or not.
	 *
	 * @see \ContentControl\user_can_view_content() to check if user can view content.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	function content_is_restricted( $content_id = null ) {
	}
	/**
	 * Get applicable restrictions for the given content.
	 *
	 * If $single is true, return the first applicable restriction. If false, return all applicable restrictions.
	 * Sorted by priority and cached internally.
	 *
	 * @param int|null $content_id Content ID.
	 * @param bool     $single     Whether to return a single match or an array of matches.
	 *
	 * @return Restriction|Restriction[]|false
	 *
	 * @since 2.4.0
	 */
	function get_applicable_restrictions( $content_id = null, $single = true ) {
	}
	/**
	 * Get applicable restriction.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return Restriction|false
	 *
	 * @since 2.0.0
	 */
	function get_applicable_restriction( $content_id = null ) {
	}
	/**
	 * Get all applicable restrictions.
	 *
	 * @param int|null $content_id Content ID.
	 *
	 * @return Restriction[]
	 *
	 * @since 2.0.11
	 */
	function get_all_applicable_restrictions( $content_id = null ) {
	}
	/**
	 * Check if query has restrictions.
	 *
	 * @param \WP_Query $query Query object.
	 *
	 * @return array<array{restriction:Restriction,post_ids:int[]}>|false
	 *
	 * @since 2.0.0
	 */
	function get_restriction_matches_for_queried_posts( $query ) {
	}
	/**
	 * Check if query has restrictions.
	 *
	 * @param \WP_Term_Query $query Query object.
	 *
	 * @return array<array{restriction:Restriction,term_ids:int[]}>|false
	 *
	 * @since 2.2.0
	 */
	function get_restriction_matches_for_queried_terms( $query ) {
	}
	/**
	 * Check if the referrer is the sites admin area.
	 *
	 * @return bool
	 *
	 * @since 2.2.0
	 */
	function check_referrer_is_admin() {
	}
	/**
	 * Check if request is excluded.
	 *
	 * @return bool
	 *
	 * @since 2.3.1
	 */
	function request_is_excluded_rest_endpoint() {
	}
	/**
	 * Check if request is excluded.
	 *
	 * @return bool
	 *
	 * @since 2.3.0
	 */
	function request_is_excluded() {
	}
	/**
	 * Check if the request is for a priveleged user in the admin area.
	 *
	 * @return bool
	 *
	 * @since 2.3.0
	 */
	function request_for_user_is_excluded() {
	}
	/**
	 * Check if protection methods should be disabled.
	 *
	 * Generally used to bypass protections when using page editors.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	function protection_is_disabled() {
	}
}

/**
 * Rule callback functions.
 *
 * @package ContentControl
 */
namespace ContentControl\Rules {
	/**
	 * Get or set the current rule (globaly accessible).
	 *
	 * @param Rule|null|false $rule Rule object.
	 * @return Rule|null
	 */
	function current_rule( $rule = false ) {
	}
	/**
	 * Get the current rule ID.
	 *
	 * @return string
	 */
	function get_rule_id() {
	}
	/**
	 * Get the current rule name.
	 *
	 * @return string
	 */
	function get_rule_name() {
	}
	/**
	 * Get the current rule options.
	 *
	 * @param array<string,mixed> $defaults Default options.
	 *
	 * @return array<string,mixed>
	 */
	function get_rule_options( $defaults = [] ) {
	}
	/**
	 * Get the current rule extras.
	 *
	 * @return array<string,mixed>
	 */
	function get_rule_extras() {
	}
	/**
	 * Get the current rule option.
	 *
	 * @param string $key Option key.
	 * @param mixed  $default_value Default value.
	 * @return mixed
	 */
	function get_rule_option( $key, $default_value = false ) {
	}
	/**
	 * Get the current rule extra.
	 *
	 * @param string $key Extra key.
	 * @param mixed  $default_value Default value.
	 * @return mixed
	 */
	function get_rule_extra( $key, $default_value = false ) {
	}
	/**
	 * Gets a filterable array of the allowed user roles.
	 *
	 * @return array|mixed
	 */
	function allowed_user_roles() {
	}
	/**
	 * Checks if the current post is a post type.
	 *
	 * @param string $post_type Post type slug.
	 * @return boolean
	 */
	function is_post_type( $post_type ) {
	}
}

/**
 * Restriction utility functions for post types.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */
namespace ContentControl {
	/**
	 * Check if term has restrictions.
	 *
	 * @param int|null $term_id Term ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0
	 */
	function term_has_restrictions( $term_id = null ) {
	}
}

/**
 * Compatibility functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Returns an array of the default permissions.
	 *
	 * @return array<string,string> Default permissions.
	 */
	function get_default_permissions() {
	}
	/**
	 * Get the default media queries.
	 *
	 * @return array<string,array{override:bool,breakpoint:int}> Array of media queries.
	 */
	function get_default_media_queries() {
	}
	/**
	 * Returns an array of the default settings.
	 *
	 * @return array<string,mixed> Default settings.
	 */
	function get_default_settings() {
	}
	/**
	 * Get default restriction settings.
	 *
	 * @return array<string,mixed> Default restriction settings.
	 */
	function get_default_restriction_settings() {
	}
}

/**
 * Restriction utility functions for post types.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */
namespace ContentControl {
	/**
	 * Check if post has restrictions.
	 *
	 * @param int|null $post_id Post ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0
	 */
	function post_has_restrictions( $post_id = null ) {
	}
}

/**
 * Option functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Redirect to the appropriate location.
	 *
	 * @param string $type login|home|custom.
	 * @param string $url  Custom URL.
	 *
	 * @return void
	 */
	function redirect( $type = 'login', $url = null ) {
	}
	/**
	 * Set the query to the page with the specified ID.
	 *
	 * @param int       $page_id Page ID.
	 * @param \WP_Query $query   Query object.
	 * @return void
	 */
	function set_query_to_page( $page_id, $query = null ) {
	}
}

/**
 * Rule callback functions.
 *
 * @package ContentControl
 */
namespace ContentControl\Rules {
	// TODO add support for "Main Query Only" option for Rules & rule processing.
	/**
	 * Checks if a user has one of the selected roles.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 */
	function user_has_role() {
	}
	/**
	 * Check if this is the home page.
	 *
	 * @uses current_query_context() To get the current query context.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_home_page() {
	}
	/**
	 * Check if this is the home page.
	 *
	 * @uses current_query_context() To get the current query context.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_blog_index() {
	}
	/**
	 * Check if this is an archive for a specific post type.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_post_type_archive() {
	}
	/**
	 * Check if this is a single post for a specific post type.
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_post_type() {
	}
	/**
	 * Check if content is a selected post(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_selected_post() {
	}
	/**
	 * Check if the current post is a child of a selected post(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_child_of_post() {
	}
	/**
	 * Check if the current post is a ancestor of a selected post(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_ancestor_of_post() {
	}
	/**
	 * Check if current post uses selected template(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_post_with_template() {
	}
	/**
	 * Check if current post has selected taxonomy term(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_post_with_tax_term() {
	}
	/**
	 * Check if current content is a selected taxonomy(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 *
	 * @todo This needs to allow for option to check main query only.
	 */
	function content_is_taxonomy_archive() {
	}
	/**
	 * Check if current content is a selected taxonomy term(s).
	 *
	 * @return bool
	 *
	 * @since 2.0.0
	 * @since 2.2.0 Added support for REST API.
	 * @since 2.5.0 Use explicit contexts.
	 */
	function content_is_selected_term() {
	}
	/**
	 * Check if post type matches.
	 *
	 * @param string          $type Type to check (post type or taxonomy key).
	 * @param string|string[] $matches Type matches against. Array or string of comma separated values.
	 *
	 * @return bool
	 *
	 * @since 2.3.0
	 */
	function check_type_match( $type, $matches ) {
	}
	/**
	 * Simplifies checking if a post type matches a rest intent.
	 *
	 * @param string                             $post_type Post type to check.
	 * @param array<string,bool|string|int>|null $rest_intent Rest intent to check.
	 *
	 * @return bool
	 *
	 * @since 2.3.0
	 */
	function rest_intent_matches_post_type( $post_type, $rest_intent = null ) {
	}
	/**
	 * Simplifies checking if a taxonomy matches a rest intent.
	 *
	 * @param string                             $taxonomy Taxonomy to check.
	 * @param array<string,bool|string|int>|null $rest_intent Rest intent to check.
	 *
	 * @return bool
	 *
	 * @since 2.3.0
	 */
	function rest_intent_matches_taxonomy( $taxonomy, $rest_intent = null ) {
	}
}

/**
 * Backward compatibility functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Get the current data versions.
	 *
	 * @return int[]
	 */
	function current_data_versions() {
	}
	/**
	 * Get all data versions.
	 *
	 * @return int[]
	 */
	function get_data_versions() {
	}
	/**
	 * Set the data version.
	 *
	 * @param string $key    Data key.
	 * @param int    $version Data version.
	 *
	 * @return bool
	 */
	function set_data_version( $key, $version ) {
	}
	/**
	 * Set the data version.
	 *
	 * @param int[] $versioning Data versions.
	 *
	 * @return bool
	 */
	function set_data_versions( $versioning ) {
	}
	/**
	 * Get the current data version.
	 *
	 * @param string $key Type of data to get version for.
	 *
	 * @return int|bool
	 */
	function get_data_version( $key ) {
	}
	/**
	 * Checks if user is upgrading from < 2.0.0.
	 *
	 * Sets data versioning to 1 as they didn't exist before.
	 *
	 * @param string $old_version Old version.
	 *
	 * @return void
	 */
	function maybe_force_v2_migrations( $old_version ) {
	}
	/**
	 * Get the name of an upgrade.
	 *
	 * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to get name for.
	 *
	 * @return string
	 */
	function get_upgrade_name( $upgrade ) {
	}
	/**
	 * Get the completed upgrades.
	 *
	 * @return string[]
	 */
	function get_completed_upgrades() {
	}
	/**
	 * Set the completed upgrades.
	 *
	 * @param string[] $upgrades Completed upgrades.
	 *
	 * @return bool
	 */
	function set_completed_upgrades( $upgrades ) {
	}
	/**
	 * Mark an upgrade as complete.
	 *
	 * @param \ContentControl\Base\Upgrade $upgrade Upgrade to mark as complete.
	 *
	 * @return void
	 */
	function mark_upgrade_complete( $upgrade ) {
	}
	/**
	 * Check if an upgrade has been completed.
	 *
	 * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to check.
	 *
	 * @return bool
	 */
	function is_upgrade_complete( $upgrade ) {
	}
}

/**
 * Content helper functions.
 *
 * @package ContentControl
 * @since 2.0.0
 * @copyright (c) 2023 Code Atlantic LLC
 */
namespace ContentControl {
	/**
	 * Get post excerpt or <!--more--> tag content for a post.
	 *
	 * This differs from get_the_excerpt in that it will return the content
	 * before the <!--more--> tag if it exists, but not generate an excerpt
	 * from the_contnet. It also doesn't filter the content.
	 *
	 * @param int|\WP_Post|null $post_id Post ID or object. Defaults to global $post.
	 * @return string
	 */
	function get_excerpt_by_id( $post_id = null ) {
	}
	/**
	 * Filter feed post content when needed.
	 *
	 * @param string                             $content Content to display.
	 * @param \ContentControl\Models\Restriction $restriction Restriction object.
	 *
	 * @return string
	 */
	function append_post_excerpts( $content, $restriction ) {
	}
	/**
	 * Apply content filters for the_content without our own again.
	 *
	 * @param string $content Content to display.
	 *
	 * @return string
	 */
	function the_content_filters( $content ) {
	}
	/**
	 * Apply get_the_excerpt fitlers without our own again.
	 *
	 * @param string $excerpt Excerpt to display.
	 *
	 * @return string
	 */
	function the_excerpt_filters( $excerpt ) {
	}
	/**
	 * Get the current page URL.
	 *
	 * @return string
	 */
	function get_current_page_url() {
	}
}

/**
 * Option functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Get all options
	 *
	 * @return array<string,mixed>
	 */
	function get_all_plugin_options() {
	}
	/**
	 * Get an option
	 *
	 * Looks to see if the specified setting exists, returns default if not
	 *
	 * @param string     $key Option key.
	 * @param mixed|bool $default_value Default value.
	 *
	 * @return mixed|void
	 */
	function get_plugin_option( $key, $default_value = false ) {
	}
	/**
	 * Update an option
	 *
	 * Updates an setting value in both the db and the global variable.
	 * Warning: Passing in an empty, false or null string value will remove
	 *          the key from the _options array.
	 *
	 * @param string          $key The Key to update.
	 * @param string|bool|int $value The value to set the key to.
	 *
	 * @return boolean True if updated, false if not.
	 */
	function update_plugin_option( $key = '', $value = false ) {
	}
	/**
	 * Update many values at once.
	 *
	 * @param array<string,mixed> $new_options Array of new replacement options.
	 *
	 * @return bool
	 */
	function update_plugin_options( $new_options = [] ) {
	}
	/**
	 * Remove an option
	 *
	 * @param string|string[] $keys Can be a single string  or array of option keys.
	 *
	 * @return boolean True if updated, false if not.
	 */
	function delete_plugin_options( $keys = '' ) {
	}
	/**
	 * Get index of blockTypes.
	 *
	 * @return array<array{name:string,category:string,description:string,keywords:string[],title:string}>
	 */
	function get_block_types() {
	}
	/**
	 * Delete block types cache.
	 *
	 * @return void
	 */
	function delete_block_types_cache() {
	}
	/**
	 * Purge block types cache on update.
	 *
	 * @param string $old_version The old version.
	 * @param string $new_version The new version.
	 *
	 * @return void
	 */
	function purge_block_types_cache_on_update( $old_version, $new_version ) {
	}
	/**
	 * Sanitize expetced block type data.
	 *
	 * @param array<string,string|string[]> $type Block type definition.
	 * @return array<string,mixed> Sanitized definition.
	 */
	function sanitize_block_type( $type = [] ) {
	}
	/**
	 * Update block type list.
	 *
	 * @param array<array{name:string,category:string,description:string,keywords:string[],title:string}> $incoming_block_types Array of updated block type declarations.
	 *
	 * @return void
	 */
	function update_block_types( $incoming_block_types = [] ) {
	}
	/**
	 * Get default denial message.
	 *
	 * @return string
	 */
	function get_default_denial_message() {
	}
}

/**
 * Utility functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Check if an addon is installed.
	 *
	 * @param string $plugin_basename Plugin slug.
	 *
	 * @return bool
	 */
	function is_plugin_installed( $plugin_basename ) {
	}
}

/**
 * Query functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Get the main query.
	 *
	 * @return \WP_Query|null
	 */
	function get_main_wp_query() {
	}
	/**
	 * Get the current wp query.
	 *
	 * Helper that returns the current query object, reguardless of if
	 * it's the main query or not.
	 *
	 * @return \WP_Query|null
	 */
	function get_current_wp_query() {
	}
	/**
	 * Get the current query.
	 *
	 * @param \WP_Query|\WP_Term_Query|null $query Query object.
	 *
	 * @return \WP_Query|\WP_Term_Query|null
	 */
	function get_query( $query = null ) {
	}
	/**
	 * Set the current query context.
	 *
	 * @param string $context 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`.
	 *
	 * @return void
	 */
	function override_query_context( $context ) {
	}
	/**
	 * Reset the current query context.
	 *
	 * @return void
	 */
	function reset_query_context() {
	}
	/**
	 * Get or set the current rule context (globaly accessible).
	 *
	 * 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`
	 *
	 * Rules can work differently depending on the context they are being checked in.
	 * This context allows us to handle the main query differently to other queries,
	 * and blocks. It further allows us to handle blocks in several unique ways per
	 * rule.
	 *
	 *  1. Main query is checked in the template_redirect action.
	 *  2. Main query posts are checked in the the_posts filter & $wp_query->is_main_query().
	 *  3. Alternate query posts are checked in the_posts or pre_get_posts & ! $wp_query->is_main_query().
	 *  4. Blocks are checked in the content_control/should_hide_block filter.
	 *
	 *  switch ( current_query_context() ) {
	 *      // Catch all known contexts.
	 *      case 'main':
	 *      case 'main/blocks':
	 *      case 'main/posts':
	 *      case 'posts':
	 *      case 'blocks':
	 *      case 'restapi/posts':
	 *      case 'restapi':
	 *      case 'restapi/terms':
	 *      case 'terms':
	 *      case 'unknown':
	 *          return false;
	 *  }
	 *
	 * @param \WP_Query|null $query Query object.
	 *
	 * @return 'main'|'main/posts'|'posts'|'main/blocks'|'blocks'|'restapi'|'restapi/posts'|'restapi/terms'|'terms'|'unknown'
	 */
	function current_query_context( $query = null ) {
	}
	/**
	 * Set the current rule (globaly accessible).
	 *
	 * Because we check posts in `the_posts`, we can't trust the global $wp_query
	 * has been set yet, so we need to manage global state ourselves.
	 *
	 * @param \WP_Query|\WP_Term_Query|null $query WP_Query object.
	 *
	 * @return void
	 */
	function set_rules_query( $query ) {
	}
	/**
	 * Setup the current content.
	 *
	 * @param int|\WP_Post|\WP_Term|null $content_id Content ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function setup_content_globals( $content_id ) {
	}
	/**
	 * Check and overload global post if needed.
	 *
	 * This has no effect when checking global queries ($post_id = null).
	 *
	 * @param int|\WP_Post|null $post_id Post ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function setup_post_globals( $post_id = null ) {
	}
	/**
	 * Check and overload global term if needed.
	 *
	 * This has no effect when checking global queries ($term_id = null).
	 *
	 * @param int|\WP_Term|null $term_id Term ID.
	 *
	 * @return bool
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function setup_term_globals( $term_id = null ) {
	}
	/**
	 * Setup the current content.
	 *
	 * @return void
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function reset_content_globals() {
	}
	/**
	 * Check and clear global post if needed.
	 *
	 * @global \WP_Post $post
	 *
	 * @return void
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function reset_post_globals() {
	}
	/**
	 * Check and clear global term if needed.
	 *
	 * @return void
	 *
	 * @since 2.4.0 - Added support for `terms` context.
	 */
	function reset_term_globals() {
	}
	/**
	 * Get the content ID for the current query item (post, term, etc).
	 *
	 * @return int|null
	 */
	function get_the_content_id() {
	}
	/**
	 * Set up the post globals.
	 *
	 * @param int|\WP_Post|null $post_id Post ID.
	 *
	 * @return boolean
	 *
	 * @deprecated 2.4.0 - Use `setup_content_globals() or `setup_post_globals()` instead.
	 */
	function setup_post( $post_id = null ) {
	}
	/**
	 * Set up the term globals.
	 *
	 * @param int|\WP_Term|null $term_id Term ID.
	 *
	 * @return boolean
	 *
	 * @deprecated 2.4.0 - Use `setup_term_globals()` instead.
	 */
	function setup_term_object( $term_id = null ) {
	}
	/**
	 * Check and clear global post if needed.
	 *
	 * @global \WP_Post $post
	 *
	 * @return void
	 *
	 * @deprecated 2.4.0 - Use `reset_post_globals()` instead.
	 */
	function reset_post() {
	}
	/**
	 * Check and clear global term if needed.
	 *
	 * @return void
	 *
	 * @deprecated 2.4.0 - Use `reset_term_globals()` instead.
	 */
	function reset_term_object() {
	}
	/**
	 * Get the endpoints for a registered post types.
	 *
	 * @since 2.2.0
	 * @since 2.5.0 Use `rest_get_route_for_post_type_items()` instead of `get_post_type_object()->rest_base`.
	 *
	 * @return array<string,string>
	 */
	function get_post_type_endpoints() {
	}
	/**
	 * Get the endpoints for a registered taxonomies.
	 *
	 * @since 2.2.0
	 * @since 2.5.0 Use `rest_get_route_for_taxonomy_items()` instead of `get_taxonomy_object()->rest_base`.
	 *
	 * @return array<string,string>
	 */
	function get_taxonomy_endpoints() {
	}
	/**
	 * Get the intent of the current REST API request.
	 *
	 * @since 2.2.0
	 * @since 2.3.0 - Added filter to allow overriding the intent.
	 * @since 2.4.0 - Added second paramter to the`content_control/get_rest_api_intent` filter pass the `$rest_route`.
	 *
	 * @return array{type:'post_type'|'taxonomy'|'unknown',name:string,id:int,index:bool,search:string|false}
	 */
	function get_rest_api_intent() {
	}
}

/**
 * Compatibility functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Checks whether function is disabled.
	 *
	 * @param string $func Name of the function.
	 *
	 * @return bool Whether or not function is disabled.
	 */
	function is_func_disabled( $func ) {
	}
	/**
	 * Checks if the current request is a WP REST API request.
	 *
	 * Case #1: After WP_REST_Request initialisation
	 * Case #2: Support "plain" permalink settings and check if `rest_route` starts with `/`
	 * Case #3: It can happen that WP_Rewrite is not yet initialized,
	 *          so do this (wp-settings.php)
	 * Case #4: URL Path begins with wp-json/ (your REST prefix)
	 *          Also supports WP installations in subfolders
	 *
	 * @returns boolean
	 * @author matzeeable
	 *
	 * @return bool
	 */
	function is_rest() {
	}
	/**
	 * Check if this is a core WP REST namespace.
	 *
	 * @return boolean
	 *
	 * @since 2.2.0
	 */
	function is_wp_core_rest_namespace() {
	}
	/**
	 * Check if this is a cron request.
	 *
	 * @return boolean
	 */
	function is_cron() {
	}
	/**
	 * Check if this is an AJAX request.
	 *
	 * @return boolean
	 */
	function is_ajax() {
	}
	/**
	 * Check if this is a frontend request.
	 *
	 * @return boolean
	 */
	function is_frontend() {
	}
	/**
	 * Change camelCase to snake_case.
	 *
	 * @param string $str String to convert.
	 *
	 * @return string Converted string.
	 */
	function camel_case_to_snake_case( $str ) {
	}
	/**
	 * Change snake_case to camelCase.
	 *
	 * @param string $str String to convert.
	 *
	 * @return string Converted string.
	 */
	function snake_case_to_camel_case( $str ) {
	}
	/**
	 * Get array values using dot.notation.
	 *
	 * @param string              $key Key to fetch.
	 * @param array<string,mixed> $data Array to fetch from.
	 * @param string|null         $key_case Case to use for key (snake_case|camelCase).
	 *
	 * @return mixed|null
	 */
	function fetch_key_from_array( $key, $data, $key_case = null ) {
	}
	/**
	 * Convert hex to rgba.
	 *
	 * @param string $hex_code Hex code to convert.
	 * @param float  $opacity Opacity to use.
	 *
	 * @return string Converted rgba string.
	 */
	function convert_hex_to_rgba( $hex_code, $opacity = 1 ) {
	}
	/**
	 * Function that deeply cleans arrays for wp_maybe_serialize
	 *
	 * Gets rid of Closure and other invalid data types.
	 *
	 * @param array<mixed> $arr Array to clean.
	 *
	 * @return array<mixed> Cleaned array.
	 */
	function deep_clean_array( $arr ) {
	}
}

/**
 * Restriction utility & helper functions.
 *
 * @package ContentControl
 * @subpackage Functions
 * @copyright (c) 2023 Code Atlantic LLC
 */
namespace ContentControl {
	/**
	 * Get restriction, by ID, slug or object.
	 *
	 * @param int|string|\ContentControl\Models\Restriction $restriction Restriction ID, slug or object.
	 *
	 * @return \ContentControl\Models\Restriction|null
	 */
	function get_restriction( $restriction ) {
	}
	/**
	 * Check if admins are excluded from restrictions.
	 *
	 * @return bool True if admins are excluded, false if not.
	 */
	function admins_are_excluded() {
	}
	/**
	 * Current user is excluded from restrictions.
	 *
	 * @return bool True if user is excluded, false if not.
	 */
	function user_is_excludable() {
	}
	/**
	 * Current user is excluded from restrictions.
	 *
	 * @return bool True if user is excluded, false if not.
	 */
	function user_is_excluded() {
	}
	/**
	 * Check if user meets requirements.
	 *
	 * @param string                               $user_status logged_in or logged_out.
	 * @param string[]|array<string,string>|string $user_roles array of roles to check.
	 * @param string                               $role_match any|match|exclude.
	 *
	 * @return bool True if user meets requirements, false if not.
	 */
	function user_meets_requirements( $user_status, $user_roles = [], $role_match = 'match' ) {
	}
	/**
	 * Check if a given query can be ignored.
	 *
	 * @param \WP_Query|\WP_Term_Query $query Query object.
	 *
	 * @return bool True if query can be ignored, false if not.
	 *
	 * @since 2.2.0 Added support for WP_Term_Query.
	 */
	function query_can_be_ignored( $query = null ) {
	}
}

/**
 * Backward compatibility functions.
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Get v1 restrictions from wp_options.
	 *
	 * @return array<string,string|bool|int|array<mixed>>[]|false
	 */
	function get_v1_restrictions() {
	}
	/**
	 * Remap old conditions to new rules.
	 *
	 * @param array<array<string,mixed>> $old_conditions Array of old conditions.
	 *
	 * @return array{logicalOperator:string,items:array<array<string,mixed>>}
	 */
	function remap_conditions_to_query( $old_conditions ) {
	}
	/**
	 * Remap old condition to new rule.
	 *
	 * @param array<string,mixed> $condition Old condition.
	 *
	 * @return array<string,mixed>
	 */
	function remap_condition_to_rule( $condition ) {
	}
}

/**
 * Plugin Name: Content Control
 * Plugin URI: https://contentcontrolplugin.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=plugin-uri
 * Description: Restrict content to logged in/out users or specific user roles. Restrict access to certain parts of a page/post. Control the visibility of widgets.
 * Version: 2.6.2
 * Author: Code Atlantic
 * Author URI: https://code-atlantic.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=author-uri
 * Donate link: https://code-atlantic.com/donate/?utm_campaign=donations&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=donate-link
 * Text Domain: content-control
 *
 * Minimum PHP: 7.4
 * Minimum WP: 6.2
 *
 * @package    Content Control
 * @author     Code Atlantic
 * @copyright  Copyright (c) 2023, Code Atlantic LLC.
 */
namespace ContentControl {
	/**
	 * Define plugin's global configuration.
	 *
	 * @return array<string,string|bool>
	 */
	function get_plugin_config() {
	}
	/**
	 * Get config or config property.
	 *
	 * @param string|null $key Key of config item to return.
	 *
	 * @return mixed
	 */
	function config( $key = null ) {
	}
	/**
	 * Check plugin prerequisites.
	 *
	 * @return bool
	 */
	function check_prerequisites() {
	}
	/**
	 * Initiates and/or retrieves an encapsulated container for the plugin.
	 *
	 * This kicks it all off, loads functions and initiates the plugins main class.
	 *
	 * @return \ContentControl\Plugin\Core
	 */
	function plugin_instance() {
	}
	/**
	 * Easy access to all plugin services from the container.
	 *
	 * @see \ContentControl\plugin_instance
	 *
	 * @param string|null $service_or_config Key of service or config to fetch.
	 * @return \ContentControl\Plugin\Core|mixed
	 */
	function plugin( $service_or_config = null ) {
	}
}

/**
 * Content Control Uninstall File
 *
 * @package ContentControl
 */
namespace ContentControl {
	/**
	 * Uninstall Content Control
	 *
	 * @return void
	 */
	function remove_wp_options_data() {
	}
}

namespace {
	/**
	 * Easy access to all plugin services from the container.
	 *
	 * @see \ContentControl\plugin_instance
	 *
	 * @param string|null $service_or_config Key of service or config to fetch.
	 * @return \ContentControl\Plugin\Core|mixed
	 */
	function content_control( $service_or_config = \null ) {
	}
	/**
	 * Get a value from the globals service.
	 *
	 * @param string $key Context key.
	 * @param mixed  $default_value Default value.
	 *
	 * @return mixed
	 */
	function get_global( $key, $default_value = \null ) {
	}
	/**
	 * Set a value in the globals service.
	 *
	 * @param string $key Context key.
	 * @param mixed  $value Context value.
	 *
	 * @return void
	 */
	function set_global( $key, $value ) {
	}
	/**
	 * Reset a value in the globals service.
	 *
	 * @param string $key Context key.
	 *
	 * @return void
	 */
	function reset_global( $key ) {
	}
	/**
	 * Reset all values in the globals service.
	 *
	 * @return void
	 */
	function reset_all_globals() {
	}
	/**
	 * Push to global stack.
	 *
	 * @param string $key Context key.
	 * @param mixed  $value Context value.
	 *
	 * @return void
	 */
	function push_to_global( $key, $value ) {
	}
	/**
	 * Pop from globals stack.
	 *
	 * @param string $key Context key.
	 *
	 * @return mixed
	 */
	function pop_from_global( $key ) {
	}
	/**
	 * Check if global stack is empty.
	 *
	 * @param string $key Context key.
	 *
	 * @return bool
	 */
	function global_is_empty( $key ) {
	}
	/**
	 * Get the Content Control plugin instance.
	 *
	 * @deprecated 2.0.0 Use \ContentControl\plugin() instead.
	 *
	 * @return \ContentControl\Plugin\Core
	 */
	function jp_content_control() {
	}
}
