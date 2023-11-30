<?php

namespace {
    /**
     * Class JP_Content_Control
     *
     * @deprecated 2.0.0 Use \ContentControl\Plugin instead.
     */
    class JP_Content_Control
    {
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
    class Is
    {
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
        public static function accessible($who = '', $roles = [])
        {
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
        public static function restricted($who = '', $roles = [])
        {
        }
    }
}
namespace JP\CC\Site {
    /**
     * Frontend restriction controller.
     */
    class Restrictions
    {
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
        public static function restricted_content()
        {
        }
    }
}
namespace ContentControl\RuleEngine {
    /**
     * Rules registry
     */
    class Rules
    {
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
        public function current_rule($rule = false)
        {
        }
        /**
         * Set up rules list.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Register new rule type.
         *
         * @param array<string,mixed> $rule New rule to register.
         * @return void
         */
        public function register_rule($rule)
        {
        }
        /**
         * Check if rule is valid.
         *
         * @param array<string,mixed> $rule Rule to test.
         * @return boolean
         */
        public function is_rule_valid($rule)
        {
        }
        /**
         * Get array of all registered rules.
         *
         * @return array<string,array<string,mixed>>
         */
        public function get_rules()
        {
        }
        /**
         * Get a rule definition by name.
         *
         * @param string $rule_name Rule definition or null.
         * @return array<string,mixed>|null
         */
        public function get_rule($rule_name)
        {
        }
        /**
         * Get array of registered rules filtered for the block-editor.
         *
         * @return array<string,array<string,mixed>>
         */
        public function get_block_editor_rules()
        {
        }
        /**
         * Get list of verbs.
         *
         * @return array<string,string> List of verbs with translatable text.
         */
        public function get_verbs()
        {
        }
        /**
         * Get a list of built in rules.
         *
         * @return void
         */
        protected function register_built_in_rules()
        {
        }
        /**
         * Get a list of user rules.
         *
         * @return array<string,array<string,mixed>>
         */
        protected function get_user_rules()
        {
        }
        /**
         * Get a list of general content rules.
         *
         * @return array<string,array<string,mixed>>
         */
        protected function get_general_content_rules()
        {
        }
        /**
         * Get a list of WP post type rules.
         *
         * @return array<string,array<string,mixed>>
         */
        protected function get_post_type_rules()
        {
        }
        /**
         * Generate post type taxonomy rules.
         *
         * @param string $name Post type name.
         *
         * @return array<string,array<string,mixed>>
         */
        protected function get_post_type_tax_rules($name)
        {
        }
        /**
         * Generates conditions for all public taxonomies.
         *
         * @return array<string,array<string,mixed>>
         */
        protected function get_taxonomy_rules()
        {
        }
        /**
         * Get an array of rule default values.
         *
         * @return array<string,mixed> Array of rule default values.
         */
        public function get_rule_defaults()
        {
        }
        /**
         * Register & remap deprecated conditions to rules.
         *
         * @return void
         */
        protected function register_deprecated_rules()
        {
        }
        /**
         * Parse rules that are still registered using the older deprecated methods.
         *
         * @param array<string,mixed> $old_rules Array of old rules to manipulate.
         * @return array<string,mixed>
         */
        public function parse_old_rules($old_rules)
        {
        }
        /**
         * Remaps keys & values from an old `condition` into a new `rule`.
         *
         * @param array<string,mixed> $old_rule Old rule definition.
         * @return array<string,mixed> New rule definition.
         */
        public function remap_old_rule($old_rule)
        {
        }
    }
    /**
     * Handler for rule engine.
     *
     * @package ContentControl\RuleEngine
     */
    class Handler
    {
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
        public function __construct($sets, $any_all_none = 'all')
        {
        }
        /**
         * Check if this set has JS based rules.
         *
         * @return bool
         */
        public function has_js_rules()
        {
        }
        /**
         * Checks the rules of all sets using the any/all comparitor.
         *
         * @return boolean
         */
        public function check_rules()
        {
        }
    }
}
namespace ContentControl\Plugin {
    /**
     * Prerequisite handler.
     *
     * @version 1.0.0
     */
    class Prerequisites
    {
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
        public function __construct($requirements = [])
        {
        }
        /**
         * Check requirements.
         *
         * @param boolean $return_on_fail Whether it should stop processing if one fails.
         *
         * @return bool
         */
        public function check($return_on_fail = false)
        {
        }
        /**
         * Render notices when appropriate.
         *
         * @return void
         */
        public function setup_notices()
        {
        }
        /**
         * Handle individual checks by mapping them to methods.
         *
         * @param array{type:string,version:string} $check Requirement check arguments.
         *
         * @return bool
         */
        public function check_handler($check)
        {
        }
        /**
         * Report failure notice to the queue.
         *
         * @param array{type:string,version:string} $check_args Array of check arguments.
         *
         * @return void
         */
        public function report_failure($check_args)
        {
        }
        /**
         * Get a list of failures.
         *
         * @return array{type:string,version:string}[]
         */
        public function get_failures()
        {
        }
        /**
         * Check PHP version against args.
         *
         * @param array{type:string,version:string} $check_args Array of args.
         *
         * @return bool
         */
        public function check_php($check_args)
        {
        }
        /**
         * Check PHP version against args.
         *
         * @param array{type:string,version:string} $check_args Array of args.
         *
         * @return bool
         */
        public function check_wp($check_args)
        {
        }
        /**
         * Check plugin requirements.
         *
         * @param array{type:string,version:string,name:string,slug:string,version:string,check_installed:bool,dep_label:string} $check_args Array of args.
         *
         * @return bool
         */
        public function check_plugin($check_args)
        {
        }
        /**
         * Check if plugin is active.
         *
         * @param string $slug Slug to check for.
         *
         * @return bool
         */
        protected function plugin_is_active($slug)
        {
        }
        /**
         * Get php error message.
         *
         * @param array{type:string,version:string} $failed_check_args Check arguments.
         *
         * @return string
         */
        public function get_php_message($failed_check_args)
        {
        }
        /**
         * Get wp error message.
         *
         * @param array{type:string,version:string} $failed_check_args Check arguments.
         *
         * @return string
         */
        public function get_wp_message($failed_check_args)
        {
        }
        /**
         * Get plugin error message.
         *
         * @param array{type:string,version:string,name:string,slug:string,version:string,check_installed:bool,dep_label:string,not_activated?:bool|null,not_updated?:bool|null} $failed_check_args Get helpful error message.
         *
         * @return string
         */
        public function get_plugin_message($failed_check_args)
        {
        }
        /**
         * Render needed admin notices.
         *
         * @return void
         */
        public function render_notices()
        {
        }
    }
    /**
     * Class Install
     *
     * @since 1.0.0
     */
    class Install
    {
        /**
         * Activation wrapper.
         *
         * @param bool $network_wide Weather to activate network wide.
         *
         * @return void
         */
        public static function activate_plugin($network_wide)
        {
        }
        /**
         * Deactivation wrapper.
         *
         * @param bool $network_wide Weather to deactivate network wide.
         *
         * @return void
         */
        public static function deactivate_plugin($network_wide)
        {
        }
        /**
         * Uninstall the plugin.
         *
         * @return void
         */
        public static function uninstall_plugin()
        {
        }
        /**
         * Activate on single site.
         *
         * @return void
         */
        public static function activate_site()
        {
        }
        /**
         * Deactivate on single site.
         *
         * @return void
         */
        public static function deactivate_site()
        {
        }
        /**
         * Uninstall single site.
         *
         * @return void
         */
        public static function uninstall_site()
        {
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
    class Upgrader
    {
        /**
         * Initialize license management.
         *
         * @param Container $c Container.
         */
        public function __construct($c)
        {
        }
        /**
         * Maybe load functions & classes required for upgrade.
         *
         * Purely here due to prevent possible random errors.
         *
         * @return void
         */
        public function maybe_load_required_files()
        {
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
        public function debug_log($message, $type = 'INFO')
        {
        }
        /**
         * Get credentials for the current request.
         *
         * @return bool
         */
        public function get_fs_creds()
        {
        }
        /**
         * Activate a plugin.
         *
         * @param string $plugin_basename The plugin basename.
         * @return bool|\WP_Error
         */
        public function activate_plugin($plugin_basename)
        {
        }
        /**
         * Install a plugin from file.
         *
         * @param string $file The plugin file.
         *
         * @return bool|\WP_Error
         */
        public function install_plugin($file)
        {
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
    class Connect
    {
        const API_URL = 'https://upgrade.contentcontrolplugin.com/';
        const TOKEN_OPTION_NAME = 'content_control_connect_token';
        const NONCE_OPTION_NAME = 'content_control_connect_nonce';
        const ERROR_REFERRER = 1;
        const ERROR_AUTHENTICATION = 2;
        const ERROR_USER_AGENT = 3;
        const ERROR_SIGNATURE = 4;
        const ERROR_NONCE = 5;
        const ERROR_WEBHOOK_ARGS = 6;
        /**
         * Initialize license management.
         *
         * @param \ContentControl\Base\Container $c Container.
         */
        public function __construct($c)
        {
        }
        /**
         * Check if debug mode is enabled.
         *
         * @return bool
         */
        public function debug_mode_enabled()
        {
        }
        /**
         * Generate a new authorizatin token.
         *
         * @return string
         */
        public function generate_token()
        {
        }
        /**
         * Get the current token.
         *
         * @return string|false
         */
        public function get_access_token()
        {
        }
        /**
         * Get the current nonce.
         *
         * @param string $token Token.
         *
         * @return string|false
         */
        public function get_nonce_name($token)
        {
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
        public function debug_log($message, $type = 'INFO')
        {
        }
        /**
         * Get header Authorization
         *
         * @return null|string
         */
        public function get_request_authorization_header()
        {
        }
        /**
         * Get access token from header.
         *
         * @return string|null
         */
        public function get_request_token()
        {
        }
        /**
         * Get nonce from header.
         *
         * @return string|null
         */
        public function get_request_nonce()
        {
        }
        /**
         * Get the OAuth connect URL.
         *
         * @param string $license_key License key.
         *
         * @return array{url:string,back_url:string}
         */
        public function get_connect_info($license_key)
        {
        }
        /**
         * Kill the connection with no permission.
         *
         * @param int          $error_no Error number.
         * @param string|false $message Error message.
         *
         * @return void
         */
        public function kill_connection($error_no = self::ERROR_REFERRER, $message = false)
        {
        }
        /**
         * Verify the user agent.
         *
         * @return void
         */
        public function verify_user_agent()
        {
        }
        /**
         * Verify the referrer.
         *
         * @return void
         */
        public function verify_referrer()
        {
        }
        /**
         * Verify the nonce.
         *
         * @deprecated 2.0.0 Don't use, it doesn't work as its a separate server making request.
         *
         * @return void
         */
        public function verify_nonce()
        {
        }
        /**
         * Verify the authentication token.
         *
         * @return void
         */
        public function verify_authentication()
        {
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
        public function generate_hash($data, $token)
        {
        }
        /**
         * Verify the signature of the requester.
         *
         * @return void
         */
        public function verify_signature()
        {
        }
        /**
         * Validate the connection.
         *
         * @return void
         */
        public function validate_connection()
        {
        }
        /**
         * Verify the connection.
         *
         * @return void
         */
        public function process_verify_connection()
        {
        }
        /**
         * Get the webhook args.
         *
         * @return array{file:string,type:string,slug:string,force:boolean}
         */
        public function get_webhook_args()
        {
        }
        /**
         * Verify and return webhook args.
         *
         * @param array{file:string,type:string,slug:string,force:bool} $args The webhook args.
         *
         * @return void
         */
        public function verify_webhook_args($args)
        {
        }
        /**
         * Listen for incoming secure webhooks from the API server.
         *
         * @return void
         */
        public function process_webhook()
        {
        }
        /**
         * Install a plugin.
         *
         * @param array{file:string,type:string,slug:string,force:bool} $args The file args.
         * @return void
         */
        public function install_plugin($args)
        {
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
    class License
    {
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
         * Initialize license management.
         */
        public function __construct()
        {
        }
        /**
         * Register hooks.
         *
         * @return void
         */
        public function register_hooks()
        {
        }
        /**
         * Autoregister license.
         *
         * @return void
         */
        public function autoregister()
        {
        }
        /**
         * Schedule cron jobs.
         *
         * @return void
         */
        public function schedule_crons()
        {
        }
        /**
         * Get license data.
         *
         * @return array{key:string|null,status:array<string,mixed>|null}
         */
        public function get_license_data()
        {
        }
        /**
         * Get license key.
         *
         * @return string
         */
        public function get_license_key()
        {
        }
        /**
         * Get license status.
         *
         * @param bool $refresh Whether to refresh license status.
         *
         * @return array<string,mixed> Array of license status data.
         */
        public function get_license_status($refresh = false)
        {
        }
        /**
         * Update license data.
         *
         * @param array{key:string|null,status:array<string,mixed>|null} $license_data License data.
         *
         * @return bool
         */
        public function udpate_license_data($license_data)
        {
        }
        /**
         * Update license key.
         *
         * @param string $key License key.
         *
         * @return void
         */
        public function update_license_key($key)
        {
        }
        /**
         * Update license status.
         *
         * @param array<string,mixed> $license_status License status data.
         *
         * @return void
         */
        public function update_license_status($license_status)
        {
        }
        /**
         * Get license expiration from license status data.
         *
         * @param bool $as_datetime Whether to return as DateTime object.
         *
         * @return \DateTime|false|null
         */
        public function get_license_expiration($as_datetime = false)
        {
        }
        /**
         * Fetch license status from remote server.
         * This is a blocking request.
         *
         * @return void
         */
        public function refresh_license_status()
        {
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
        public function activate_license($key = null)
        {
        }
        /**
         * Deactivate license.
         *
         * @return array<string,mixed> License status data.
         *
         * @throws \Exception If there is an error.
         */
        public function deactivate_license()
        {
        }
        /**
         * Convert license error to human readable message.
         *
         * @param array<string,mixed> $license_status License status data.
         *
         * @return string
         */
        public function get_license_error_message($license_status)
        {
        }
        /**
         * Remove license.
         *
         * @return void
         */
        public function remove_license()
        {
        }
        /**
         * Check if license is active.
         *
         * @return bool
         */
        public function is_license_active()
        {
        }
    }
    /**
     * Class Options
     */
    class Options
    {
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
        public function __construct($prefix = 'content_control')
        {
        }
        /**
         * Get Settings
         *
         * Retrieves all plugin settings
         *
         * @return array<string,mixed> settings
         */
        public function get_all()
        {
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
        public function get($key = '', $default_value = false)
        {
        }
        /**
         * Get an option using a dot notation key.
         *
         * @param string $key Option key in dot notation.
         * @param bool   $default_value Default value.
         *
         * @return mixed|void
         */
        public function get_notation($key = '', $default_value = false)
        {
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
        public function update($key = '', $value = false)
        {
        }
        /**
         * Update many values at once.
         *
         * @param array<string,mixed> $new_options Array of new replacement options.
         *
         * @return bool
         */
        public function update_many($new_options = [])
        {
        }
        /**
         * Remove an option
         *
         * @param string|string[] $keys Can be a single string  or array of option keys.
         *
         * @return boolean True if updated, false if not.
         */
        public function delete($keys)
        {
        }
        /**
         * Remaps option keys.
         *
         * @param array<string,string> $remap_array an array of $old_key => $new_key values.
         *
         * @return bool
         */
        public function remap_keys($remap_array = [])
        {
        }
    }
    /**
     * Logging class.
     */
    class Logging
    {
        /**
         * Log file prefix.
         */
        const LOG_FILE_PREFIX = 'content-control-';
        /**
         * Initialize logging.
         */
        public function __construct()
        {
        }
        /**
         * Register hooks.
         *
         * @return void
         */
        public function register_hooks()
        {
        }
        /**
         * Gets the Uploads directory
         *
         * @return bool|array{path: string, url: string, subdir: string, basedir: string, baseurl: string, error: string|false} An associated array with baseurl and basedir or false on failure
         */
        public function get_upload_dir()
        {
        }
        /**
         * Gets the uploads directory URL
         *
         * @param string $path A path to append to end of upload directory URL.
         * @return bool|string The uploads directory URL or false on failure
         */
        public function get_upload_dir_url($path = '')
        {
        }
        /**
         * Chek if logging is enabled.
         *
         * @return bool
         */
        public function enabled()
        {
        }
        /**
         * Get working WP Filesystem instance
         *
         * @return \WP_Filesystem_Base|false
         */
        public function fs()
        {
        }
        /**
         * Check if the log file is writable.
         *
         * @return boolean
         */
        public function is_writable()
        {
        }
        /**
         * Get things started
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Get the log file path.
         *
         * @return string
         */
        public function get_file_path()
        {
        }
        /**
         * Retrieves the url to the file
         *
         * @return string|bool The url to the file or false on failure
         */
        public function get_file_url()
        {
        }
        /**
         * Retrieve the log data
         *
         * @return false|string
         */
        public function get_log()
        {
        }
        /**
         * Delete the log file and token.
         *
         * @return void
         */
        public function delete_logs()
        {
        }
        /**
         * Log message to file
         *
         * @param string $message The message to log.
         *
         * @return void
         */
        public function log($message = '')
        {
        }
        /**
         * Log unique message to file.
         *
         * @param string $message The unique message to log.
         *
         * @return void
         */
        public function log_unique($message = '')
        {
        }
        /**
         * Get the log file contents.
         *
         * @return false|string
         */
        public function get_log_content()
        {
        }
        /**
         * Retrieve the contents of a file.
         *
         * @param string|boolean $file File to get contents of.
         *
         * @return false|string
         */
        protected function get_file($file = false)
        {
        }
        /**
         * Write the log message
         *
         * @param string $message The message to write.
         *
         * @return void
         */
        protected function write_to_log($message = '')
        {
        }
        /**
         * Save the current contents to file.
         *
         * @return void
         */
        public function save_logs()
        {
        }
        /**
         * Get a line count.
         *
         * @return int
         */
        public function count_lines()
        {
        }
        /**
         * Truncates a log file to maximum of 250 lines.
         *
         * @return void
         */
        public function truncate_log()
        {
        }
        /**
         * Set up a new log file.
         *
         * @return void
         */
        public function setup_new_log()
        {
        }
        /**
         * Delete the log file.
         *
         * @return void
         */
        public function clear_log()
        {
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
        public function log_deprecated_notice($func_name, $version, $replacement = null)
        {
        }
    }
    /**
     * Class Plugin
     *
     * @package ContentControl\Plugin
     * 
     * @version 2.0.0
     */
    class Core
    {
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
        public function __construct($config)
        {
        }
        /**
         * Update & track version info.
         *
         * @return void
         */
        protected function check_version()
        {
        }
        /**
         * Process old version data.
         *
         * @param array<string,string|null> $data Array of data.
         * @return array<string,string|null>
         */
        protected function process_version_data_migration($data)
        {
        }
        /**
         * Internationalization.
         *
         * @return void
         */
        public function load_textdomain()
        {
        }
        /**
         * Add default services to our Container.
         *
         * @return void
         */
        public function register_services()
        {
        }
        /**
         * Update & track version info.
         *
         * @return array<string,\ContentControl\Base\Controller>
         */
        protected function registered_controllers()
        {
        }
        /**
         * Initiate internal components.
         *
         * @return void
         */
        protected function initiate_controllers()
        {
        }
        /**
         * Register controllers.
         *
         * @param array<string,Controller> $controllers Array of controllers.
         * @return void
         */
        public function register_controllers($controllers = [])
        {
        }
        /**
         * Get a controller.
         *
         * @param string $name Controller name.
         *
         * @return Controller|null
         */
        public function get_controller($name)
        {
        }
        /**
         * Initiate internal paths.
         *
         * @return void
         */
        protected function define_paths()
        {
        }
        /**
         * Utility method to get a path.
         *
         * @param string $path Subpath to return.
         * @return string
         */
        public function get_path($path)
        {
        }
        /**
         * Utility method to get a url.
         *
         * @param string $path Sub url to return.
         * @return string
         */
        public function get_url($path = '')
        {
        }
        /**
         * Get item from container
         *
         * @param string $id Key for the item.
         *
         * @return mixed Current value of the item.
         */
        public function get($id)
        {
        }
        /**
         * Set item in container
         *
         * @param string $id Key for the item.
         * @param mixed  $value Value to set.
         *
         * @return void
         */
        public function set($id, $value)
        {
        }
        /**
         * Get plugin option.
         *
         * @param string        $key Option key.
         * @param boolean|mixed $default_value Default value.
         * @return mixed
         */
        public function get_option($key, $default_value = false)
        {
        }
        /**
         * Get plugin permissions.
         *
         * @return array<string,string> Array of permissions.
         */
        public function get_permissions()
        {
        }
        /**
         * Get plugin permission for capability.
         *
         * @param string $cap Permission key.
         *
         * @return string User role or cap required.
         */
        public function get_permission($cap)
        {
        }
        /**
         * Check if pro version is installed.
         *
         * @return boolean
         */
        public function is_pro_installed()
        {
        }
        /**
         * Check if pro version is active.
         *
         * @return boolean
         */
        public function is_pro_active()
        {
        }
        /**
         * Check if license is active.
         *
         * @return boolean
         */
        public function is_license_active()
        {
        }
    }
    /**
     * Autoloader class.
     */
    class Autoloader
    {
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
        public static function init($name = '', $path = '')
        {
        }
        /**
         * If the autoloader is missing, add an admin notice.
         *
         *  @param string $plugin_name Plugin name for error messaging.
         *
         * @return void
         */
        protected static function missing_autoloader($plugin_name = '')
        {
        }
    }
}
namespace ContentControl\Models\RuleEngine {
    /**
     * Handler for condition items.
     *
     * @package ContentControl
     */
    abstract class Item
    {
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
        public abstract function get_check_info();
    }
    /**
     * Handler for condition groups.
     *
     * @package ContentControl
     */
    class Group extends \ContentControl\Models\RuleEngine\Item
    {
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
        public function __construct($group)
        {
        }
        /**
         * Check if this group has JS based rules.
         *
         * @return bool
         */
        public function has_js_rules()
        {
        }
        /**
         * Check this groups rules.
         *
         * @return bool
         */
        public function check_rules()
        {
        }
        /**
         * Check this groups rules.
         *
         * @return array<bool|null|array<bool|null>>
         */
        public function get_checks()
        {
        }
        /**
         * Return the rule check as an array of information.
         *
         * Useful for debugging.
         *
         * @return array<mixed>
         */
        public function get_check_info()
        {
        }
    }
    /**
     * Handler for condition rules.
     *
     * @package ContentControl
     */
    class Rule extends \ContentControl\Models\RuleEngine\Item
    {
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
        public function __construct($rule)
        {
        }
        /**
         * Parse rule options based on rule definitions.
         *
         * @param array<string,mixed> $options Array of rule opions.
         * @return array<string,mixed>
         */
        public function parse_options($options = [])
        {
        }
        /**
         * Check the results of this rule.
         *
         * @return bool
         */
        public function check_rule()
        {
        }
        /**
         * Check if this rule's callback is based in JS rather than PHP.
         *
         * @return bool
         */
        public function is_js_rule()
        {
        }
        /**
         * Return the rule check as boolean or null if the rule is JS based.
         *
         * @return bool|null
         */
        public function get_check()
        {
        }
        /**
         * Return the rule check as an array of information.
         *
         * Useful for debugging.
         *
         * @return array<string,mixed>|null
         */
        public function get_check_info()
        {
        }
    }
    /**
     * Handler for condition sets.
     *
     * @package ContentControl
     */
    class Set
    {
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
        public function __construct($set)
        {
        }
        /**
         * Check if this set has JS based rules.
         *
         * @return bool
         */
        public function has_js_rules()
        {
        }
        /**
         * Check this sets rules.
         *
         * @return bool
         */
        public function check_rules()
        {
        }
        /**
         * Get the check array for further post processing.
         *
         * @return array<bool|null|array<bool|null>>
         */
        public function get_checks()
        {
        }
        /**
         * Return the checks as an array of information.
         *
         * Useful for debugging.
         *
         * @return array<string,mixed>
         */
        public function get_check_info()
        {
        }
    }
    /**
     * Handler for condition queries.
     *
     * @package ContentControl
     */
    class Query
    {
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
        public function __construct($query)
        {
        }
        /**
         * Check if this query has any rules.
         *
         * @return bool
         */
        public function has_rules()
        {
        }
        /**
         * Check if this query has JS based rules.
         *
         * @return bool
         */
        public function has_js_rules()
        {
        }
        /**
         * Check rules in a recursive nested pattern.
         *
         * @return bool
         */
        public function check_rules()
        {
        }
        /**
         * Return the checks as an array.
         *
         * Useful for debugging or passing to JS.
         *
         * @return array<bool|null|array<bool|null>>
         */
        public function get_checks()
        {
        }
        /**
         * Return the checks as an array of information.
         *
         * Useful for debugging.
         *
         * @return array<mixed>
         */
        public function get_check_info()
        {
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
    class Restriction
    {
        /**
         * Current model version.
         *
         * @var int
         */
        const MODEL_VERSION = 3;
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
         * Restriction Setting: Required user status.
         *
         * @var string 'logged_in' | 'logged_out';
         */
        public $user_status;
        /**
         * Restriction Setting: Which roles.
         *
         * @deprecated 2.0.0 Use user_roles instead.
         *
         * @var string[]
         */
        public $roles;
        /**
         * Restriction Setting: Chosen user roles.
         *
         * @var string[]
         */
        public $user_roles;
        /**
         * Restriction Setting: Role match method.
         *
         * @var string 'any' | 'match' | 'exclude';
         */
        public $role_match;
        /**
         * Restriction Setting: Protection method.
         *
         * @var string 'redirect' | 'replace'
         */
        public $protection_method;
        /**
         * Restriction Setting: Redirect type.
         *
         * @var string 'login' | 'home' | 'custom'
         */
        public $redirect_type;
        /**
         * Restriction Setting: Redirect url.
         *
         * @var string
         */
        public $redirect_url;
        /**
         * Restriction Setting: Replacement type.
         *
         * @var string 'message' | 'page'
         */
        public $replacement_type;
        /**
         * Restriction Setting: Replacement page.
         *
         * @var int
         */
        public $replacement_page = 0;
        /**
         * Restriction Setting: Archive handling.
         *
         * @var string 'filter_post_content' | 'replace_archive_page' | 'redirect' | 'hide'
         */
        public $archive_handling;
        /**
         * Restriction Setting: Archive replacement page.
         *
         * @var int
         */
        public $archive_replacement_page = 0;
        /**
         * Restriction Setting: Redirect type.
         *
         * @var string 'login' | 'home' | 'custom'
         */
        public $archive_redirect_type;
        /**
         * Restriction Setting: Redirect url.
         *
         * @var string
         */
        public $archive_redirect_url;
        /**
         * Restriction Setting: Additional query handling.
         *
         * @var string 'filter_post_content' | 'hide'
         */
        public $additional_query_handling;
        /**
         * Restriction Settings: Show Excerpts.
         *
         * @var bool
         */
        public $show_excerpts;
        /**
         * Restriction Settings: Override Default Message.
         *
         * @var bool
         */
        public $override_message;
        /**
         * Restriction Settings: Custom Message.
         *
         * @var string
         */
        public $custom_message;
        /**
         * Restriction Settings: Conditions.
         *
         * @var array{logicalOperator:string,items:array<array<string,mixed>>}
         */
        public $conditions;
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
        public function __construct($restriction)
        {
        }
        /**
         * Map old v1 restriction to new v2 restriction object.
         *
         * @param array<string,mixed> $restriction Restriction data.
         *
         * @return void
         */
        public function setup_v1_restriction($restriction)
        {
        }
        /**
         * Get the restriction settings array.
         *
         * @return array<string,mixed>
         */
        public function get_settings()
        {
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
         * @return mixed
         */
        public function get_setting($key, $default_value = null)
        {
        }
        /**
         * Check if this set has JS based rules.
         *
         * @return bool
         */
        public function has_js_rules()
        {
        }
        /**
         * Check this sets rules.
         *
         * @return bool
         */
        public function check_rules()
        {
        }
        /**
         * Check if this restriction applies to the current user.
         *
         * @return bool
         */
        public function user_meets_requirements()
        {
        }
        /**
         * Get the description for this restriction.
         *
         * @return string
         */
        public function get_description()
        {
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
        public function get_message($context = 'display')
        {
        }
        /**
         * Whether to show excerpts for posts that are restricted.
         *
         * @return bool
         */
        public function show_excerpts()
        {
        }
        /**
         * Check if this uses the redirect method.
         *
         * @return bool
         */
        public function uses_redirect_method()
        {
        }
        /**
         * Check if this uses the replace method.
         *
         * @return bool
         */
        public function uses_replace_method()
        {
        }
        /**
         * Get edit link.
         *
         * @return string
         */
        public function get_edit_link()
        {
        }
        /**
         * Convert this restriction to an array.
         *
         * @return array<string,mixed>
         */
        public function to_array()
        {
        }
        /**
         * Convert this restriction to a v1 array.
         *
         * @return array<string,mixed>
         */
        public function to_v1_array()
        {
        }
    }
}
namespace ContentControl\RestAPI {
    /**
     * Rest API Settings Controller Class.
     */
    class Settings extends \WP_REST_Controller
    {
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
        public function register_routes()
        {
        }
        /**
         * Get plugin settings.
         *
         * @return WP_Error|WP_REST_Response
         */
        public function get_settings()
        {
        }
        /**
         * Update plugin settings.
         *
         * @param \WP_REST_Request<array<string,mixed>> $request Request object.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function update_settings($request)
        {
        }
        /**
         * Check update settings permissions.
         *
         * @return WP_Error|bool
         */
        public function update_settings_permissions()
        {
        }
        /**
         * Get settings schema.
         *
         * @return array<string,array<string,mixed>>
         */
        public function get_schema()
        {
        }
    }
    /**
     * Rest API Settings Controller Class.
     */
    class BlockTypes extends \WP_REST_Controller
    {
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
        public function register_routes()
        {
        }
        /**
         * Get block type list.
         *
         * @return WP_Error|WP_REST_Response
         */
        public function get_block_types()
        {
        }
        /**
         * Update plugin settings.
         *
         * @param \WP_REST_Request<array<string,mixed>> $request Request object.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function update_block_types($request)
        {
        }
        /**
         * Check update settings permissions.
         *
         * @return WP_Error|bool
         */
        public function update_block_types_permissions()
        {
        }
        /**
         * Get settings schema.
         *
         * @return array<string,mixed>
         */
        public function get_schema()
        {
        }
    }
    /**
     * Rest API Licensing Controller Class.
     */
    class License extends \WP_REST_Controller
    {
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
        public function register_routes()
        {
        }
        /**
         * Clean private or unnecessary data from license data before returning it.
         *
         * @param array{key:string,status:array<string,mixed>} $license_data License data.
         * @return array{key:string,status:array<string,mixed>}
         */
        public function clean_license_data($license_data)
        {
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
        public function clean_license_status($license_status)
        {
        }
        /**
         * Get plugin license.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function get_license()
        {
        }
        /**
         * Update plugin license key.
         *
         * @param \WP_REST_Request<array<string,mixed>> $request Request object.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function update_license_key($request)
        {
        }
        /**
         * Remove plugin license key.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function remove_license()
        {
        }
        /**
         * Activate plugin license.
         *
         * @param WP_REST_Request<array<string,mixed>> $request Request object.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function activate_license($request)
        {
        }
        /**
         * Deactivate plugin license.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function deactivate_license()
        {
        }
        /**
         * Get plugin license status.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function get_status()
        {
        }
        /**
         * Refresh plugin license status.
         *
         * @return \WP_Error|\WP_REST_Response
         */
        public function refresh_license_status()
        {
        }
        /**
         * Check update settings permissions.
         *
         * @return bool
         */
        public function manage_license_permissions()
        {
        }
    }
    /**
     * Rest API Object Search Controller Class.
     */
    class ObjectSearch extends \WP_REST_Controller
    {
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
        public function register_routes()
        {
        }
        /**
         * Get block type list.
         *
         * @param \WP_REST_Request<array<string,mixed>> $request Request object.
         *
         * @return WP_Error|WP_REST_Response
         */
        public function object_search($request)
        {
        }
        /**
         * Get a list of posts for a select list.
         *
         * @param string              $post_type Post type(s) to query.
         * @param array<string,mixed> $args   Query arguments.
         * @param boolean             $include_total Whether to include the total count in the response.
         * @return array{items:array<int,string>,totalCount:int}|array<int,string>
         */
        public function post_type_selectlist_query($post_type, $args = [], $include_total = false)
        {
        }
        /**
         * Get a list of terms for a select list.
         *
         * @param string              $taxonomy Taxonomy(s) to query.
         * @param array<string,mixed> $args   Query arguments.
         * @param boolean             $include_total Whether to include the total count in the response.
         * @return array{items:array<int,string>,totalCount:int}|array<int,string>
         */
        public function taxonomy_selectlist_query($taxonomy, $args = [], $include_total = false)
        {
        }
        /**
         * Get a list of users for a select list.
         *
         * @param array<string,mixed> $args Query arguments.
         * @param bool                $include_total Whether to include the total count in the response.
         *
         * @return array{items:array<int,string>,totalCount:int}|array<int,string>
         */
        public function user_selectlist_query($args = [], $include_total = false)
        {
        }
    }
}
namespace ContentControl\Interfaces {
    /**
     * Localized controller class.
     */
    interface Upgrade
    {
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
    abstract class Upgrade implements \ContentControl\Interfaces\Upgrade
    {
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
        public function __construct()
        {
        }
        /**
         * Upgrade label
         *
         * @return string
         */
        public abstract function label();
        /**
         * Return full description for this upgrade.
         *
         * @return string
         */
        public function description()
        {
        }
        /**
         * Check if the upgrade is required.
         *
         * @return bool
         */
        public function is_required()
        {
        }
        /**
         * Get the type of upgrade.
         *
         * @return string
         */
        public function get_type()
        {
        }
        /**
         * Check if the prerequisites are met.
         *
         * @return bool
         */
        public function prerequisites_met()
        {
        }
        /**
         * Get the dependencies for this upgrade.
         *
         * @return string[]
         */
        public function get_dependencies()
        {
        }
        /**
         * Run the upgrade.
         *
         * @return void|\WP_Error|false
         */
        public abstract function run();
        /**
         * Run the upgrade.
         *
         * @param \ContentControl\Services\UpgradeStream $stream Stream.
         *
         * @return bool|\WP_Error
         */
        public function stream_run($stream)
        {
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
        public function stream()
        {
        }
    }
}
namespace ContentControl\Upgrades {
    /**
     * Restrictions v2 migration.
     */
    class Restrictions_2 extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'restrictions';
        const VERSION = 2;
        /**
         * Get the label for the upgrade.
         *
         * @return string
         */
        public function label()
        {
        }
        /**
         * Get the dependencies for this upgrade.
         *
         * @return string[]
         */
        public function get_dependencies()
        {
        }
        /**
         * Run the migration.
         *
         * @return void|\WP_Error|bool
         */
        public function run()
        {
        }
        /**
         * Migrate a given restriction to the new post type.
         *
         * @param array<string,mixed> $restriction Restriction data.
         *
         * @return bool True if successful, false otherwise.
         */
        public function migrate_restriction($restriction)
        {
        }
    }
    /**
     * Settings v2 migration.
     */
    class Settings_2 extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'settings';
        const VERSION = 2;
        /**
         * Get the label for the upgrade.
         *
         * @return string
         */
        public function label()
        {
        }
        /**
         * Get the dependencies for this upgrade.
         *
         * @return string[]
         */
        public function get_dependencies()
        {
        }
        /**
         * Run the migration.
         *
         * @return void
         */
        public function run()
        {
        }
    }
    /**
     * Backup before v2 migration.
     */
    abstract class Backup extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'backup';
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
        public function label()
        {
        }
        /**
         * Get v1 data.
         *
         * @return array<string,mixed>
         */
        public abstract function get_data();
        /**
         * Run the migration.
         *
         * @return void|\WP_Error|false
         */
        public function run()
        {
        }
    }
    /**
     * Backup before v2 migration.
     */
    class Backup_2 extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'backup';
        const VERSION = 2;
        /**
         * Get the label for the upgrade.
         *
         * @return string
         */
        public function label()
        {
        }
        /**
         * Get v1 data.
         *
         * @return array<string,mixed>
         */
        public function get_v1_data()
        {
        }
        /**
         * Run the migration.
         *
         * @return void|\WP_Error|false
         */
        public function run()
        {
        }
    }
    /**
     * User meta v2 migration.
     */
    class UserMeta_2 extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'user_meta';
        const VERSION = 2;
        /**
         * Get the label for the upgrade.
         *
         * @return string
         */
        public function label()
        {
        }
        /**
         * Get the dependencies for this upgrade.
         *
         * @return string[]
         */
        public function get_dependencies()
        {
        }
        /**
         * Run the migration.
         *
         * @return void
         */
        public function run()
        {
        }
    }
    /**
     * Version 2 migration.
     */
    class PluginMeta_2 extends \ContentControl\Base\Upgrade
    {
        const TYPE = 'plugin_meta';
        const VERSION = 2;
        /**
         * Get the label for the upgrade.
         *
         * @return string
         */
        public function label()
        {
        }
        /**
         * Get the dependencies for this upgrade.
         *
         * @return string[]
         */
        public function get_dependencies()
        {
        }
        /**
         * Run the upgrade.
         *
         * @return void
         */
        public function run()
        {
        }
    }
}
namespace ContentControl\QueryMonitor {
    /**
     * Debug data collector.
     *
     * @phpstan-template T of \ContentControl\QueryMonitor\Data
     */
    class Collector extends \QM_DataCollector
    {
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
        public function name()
        {
        }
        /**
         * Set up.
         *
         * @return void
         */
        public function set_up()
        {
        }
        /**
         * Tear down.
         *
         * @return void
         */
        public function tear_down()
        {
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
        public function filter_user_can_view_content($user_can_view, $post_id, $restrictions)
        {
        }
        /**
         * Listen for restrict_main_query action.
         *
         * @param \ContentControl\Models\Restriction $restriction Restriction.
         *
         * @return void
         */
        public function action_restrict_main_query($restriction)
        {
        }
        /**
         * Listen for restrict_main_query action.
         *
         * @param \ContentControl\Models\Restriction $restriction Restriction.
         * @param int[]                              $post_ids    Post IDs.
         *
         * @return void
         */
        public function action_restrict_main_query_post($restriction, $post_ids)
        {
        }
        /**
         * Data to expose on the Query Monitor debug bar.
         *
         * @return void
         */
        public function process()
        {
        }
    }
    /**
     * QueryMonitor Output
     */
    class Output extends \QM_Output_Html
    {
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
        public function __construct($collector)
        {
        }
        /**
         * Name of the output class.
         *
         * @return string
         */
        public function name()
        {
        }
        /**
         * Adds QM Memcache stats to admin panel
         *
         * @param array<string,string> $title Array of QM admin panel titles.
         *
         * @return array<string,string>
         */
        public function admin_title($title)
        {
        }
        /**
         * Add content-control class
         *
         * @param array<string,string> $classes Array of QM classes.
         *
         * @return array<int<0,max>|string,string>
         */
        public function admin_class($classes)
        {
        }
        /**
         * Adds Memcache stats item to Query Monitor Menu
         *
         * @param array<string,array<string,string>> $_menu Array of QM admin menu items.
         *
         * @return array<string,array<string,string>>
         */
        public function admin_menu($_menu)
        {
        }
        /**
         * Output the data.
         *
         * @return void
         */
        public function output()
        {
        }
        /**
         * Output the data.
         *
         * @return void
         */
        public function output_global_settings()
        {
        }
        /**
         * Output the data.
         *
         * @return void
         */
        public function output_main_query_restrictions()
        {
        }
        /**
         * Output the data.
         *
         * @return void
         */
        public function output_post_restrictions()
        {
        }
    }
    /**
     * Class data collector for structured data.
     */
    class Data extends \QM_Data
    {
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
    interface Controller
    {
        /**
         * Handle hooks & filters or various other init tasks.
         *
         * @return void
         */
        public function init();
    }
}
namespace ContentControl\Base {
    /**
     * Localized container class.
     */
    abstract class Controller implements \ContentControl\Interfaces\Controller
    {
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
        public function __construct($container)
        {
        }
    }
}
namespace ContentControl\Controllers\Compatibility {
    /**
     * QueryMonitor
     */
    class QueryMonitor extends \ContentControl\Base\Controller
    {
        /**
         * Initialize the class
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Register collector.
         *
         * @return void
         */
        public function register_collector()
        {
        }
        /**
         * Add Query Monitor outputter.
         *
         * @param array<string,\QM_Output_Html> $output Outputters.
         * @return array<string,\QM_Output_Html> Outputters.
         */
        public function register_output_html($output)
        {
        }
    }
    /**
     * Divi controller class.
     */
    class Divi extends \ContentControl\Base\Controller
    {
        /**
         * Initialize widget editor UX.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Conditionally disable Content Control for Divi builder.
         *
         * @param boolean $protection_is_disabled Whether protection is disabled.
         * @return boolean
         */
        public function protection_is_disabled($protection_is_disabled)
        {
        }
    }
    /**
     * Elementor controller class.
     */
    class Elementor extends \ContentControl\Base\Controller
    {
        /**
         * Initialize widget editor UX.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Conditionally disable Content Control for Elementor builder.
         *
         * @param boolean $is_disabled Whether protection is disabled.
         * @return boolean
         */
        public function protection_is_disabled($is_disabled)
        {
        }
        /**
         * Add Elementor font post type to ignored post types.
         *
         * @param string[] $post_types Post types to ignore.
         * @return string[]
         */
        public function post_types_to_ignore($post_types)
        {
        }
        /**
         * Check if Elementor builder is active.
         *
         * @return boolean
         */
        public function elementor_builder_is_active()
        {
        }
    }
}
namespace ContentControl\Controllers {
    /**
     * Class Shortcodes
     *
     * @package ContentControl
     */
    class Shortcodes extends \ContentControl\Base\Controller
    {
        /**
         * Initialize Widgets
         */
        public function init()
        {
        }
        /**
         * Process the [content_control] shortcode.
         *
         * @param array<string,string|int|null> $atts Array or shortcode attributes.
         * @param string                        $content Content inside shortcode.
         *
         * @return string
         */
        public function content_control($atts, $content = '')
        {
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
        public function normalize_empty_atts($atts = [])
        {
        }
    }
}
namespace ContentControl\Controllers\Frontend {
    /**
     * Class Frontend
     */
    class Blocks extends \ContentControl\Base\Controller
    {
        /**
         * Initialize Hooks & Filters
         */
        public function init()
        {
        }
        /**
         * Adds custom attributes to allowed block attributes.
         *
         * @return void
         */
        public function register_block_attributes()
        {
        }
        /**
         * Check if block has controls enabled.
         *
         * @param array<string,mixed> $block Block to be checked.
         * @return boolean Whether the block has Controls enabled.
         */
        public function has_block_controls($block)
        {
        }
        /**
         * Get blocks controls if enabled.
         *
         * @param array{attrs:array<string,mixed>} $block Block to get controls for.
         * @return array{enabled:bool,rules:array<string,mixed>}|null Controls if enabled.
         */
        public function get_block_controls($block)
        {
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
        public function pre_render_block($pre_render, $parsed_block, $parent_block)
        {
        }
        /**
         * Check block rules to see if it should be hidden from user.
         *
         * @param bool                                   $should_hide Whether the block should be hidden.
         * @param array<string,array<string,mixed>|null> $rules  Rules to check.
         * @return bool
         */
        public function block_user_rules($should_hide, $rules)
        {
        }
        /**
         * Get any classes to be added to the outer block element.
         *
         * @param array<string,mixed> $block Block to get classes for.
         * @return null|string[]
         */
        public function get_block_control_classes($block)
        {
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
        public function render_block($block_content, $block)
        {
        }
        /**
         * Print the styles for the block controls.
         *
         * @return void
         */
        public function print_block_styles()
        {
        }
    }
    /**
     * Class ContentControl\Frontend\Widgets
     */
    class Widgets extends \ContentControl\Base\Controller
    {
        /**
         * Initialize Widgets Frontend.
         */
        public function init()
        {
        }
        /**
         * Checks for and excludes widgets based on their chosen options.
         *
         * @param array<string,array<string>> $widget_areas An array of widget areas and their widgets.
         *
         * @return array<string,array<string>> The modified $widget_area array.
         */
        public function exclude_widgets($widget_areas)
        {
        }
        /**
         * Is customizer.
         *
         * @return boolean
         */
        public function is_customize_preview()
        {
        }
    }
}
namespace ContentControl\Controllers\Frontend\Restrictions {
    /**
     * Class for handling global restrictions of the post contents.
     *
     * @package ContentControl
     */
    class PostContent extends \ContentControl\Base\Controller
    {
        /**
         * Initiate functionality.
         */
        public function init()
        {
        }
        /**
         * Enable filters.
         *
         * @return void
         */
        public function enable_filters()
        {
        }
        /**
         * Disable filters.
         *
         * @return void
         */
        public function disable_filters()
        {
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
        public function filter_the_content_if_restricted($content)
        {
        }
        /**
         * Filter post excerpt when needed.
         *
         * @param string   $post_excerpt The post excerpt.
         * @param \WP_Post $post         Post object.
         *
         * @return string
         */
        public function filter_the_excerpt_if_restricted($post_excerpt, $post = null)
        {
        }
    }
    /**
     * Class for handling global restrictions of the Main Query.
     *
     * @package ContentControl
     */
    class MainQuery extends \ContentControl\Base\Controller
    {
        /**
         * Initiate functionality.
         */
        public function init()
        {
        }
        /**
         * Handle a restriction on the main query.
         *
         * NOTE: This is only for redirecting or replacing pages and
         *       should not be used to filter or hide post contents.
         *
         * @return void
         */
        public function restrict_main_query()
        {
        }
        /**
         * Handle restrictions on the main query.
         *
         * NOTE: This is only for redirecting or replacing archives and
         *       should not be used to filter or hide post contents.
         *
         * @return void
         */
        public function check_main_query()
        {
        }
        /**
         * Handle restrictions on the main query posts.
         *
         * NOTE: This is only for redirecting or replacing archives and
         *       should not be used to filter or hide post contents.
         *
         * @return void
         */
        public function check_main_query_posts()
        {
        }
    }
    /**
     * Class for handling global restrictions of the query posts.
     *
     * @package ContentControl
     */
    class QueryPosts extends \ContentControl\Base\Controller
    {
        /**
         * Initiate functionality.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Register hooks.
         *
         * @return void
         */
        public function register_hooks()
        {
        }
        /**
         * Late hooks.
         *
         * @return void
         */
        public function enable_query_filtering()
        {
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
        public function restrict_query_posts($posts, $query)
        {
        }
    }
}
namespace ContentControl\Controllers\Frontend {
    /**
     * Class for handling global restrictions.
     *
     * @package ContentControl
     */
    class Restrictions extends \ContentControl\Base\Controller
    {
        /**
         * Initiate functionality.
         */
        public function init()
        {
        }
    }
}
namespace ContentControl\Controllers\Admin {
    /**
     * Settings Page Controller.
     *
     * @package ContentControl\Admin
     */
    class SettingsPage extends \ContentControl\Base\Controller
    {
        /**
         * Initialize the settings page.
         */
        public function init()
        {
        }
        /**
         * Register admin options pages.
         *
         * @return void
         */
        public function register_page()
        {
        }
        /**
         * Render settings page title & container.
         *
         * @return void
         */
        public function render_page()
        {
        }
        /**
         * Enqueue assets for the settings page.
         *
         * @param string $hook Page hook name.
         *
         * @return void
         */
        public function enqueue_scripts($hook)
        {
        }
        /**
         * Verify the connection.
         *
         * @return void
         */
        public function process_verify_connection()
        {
        }
        /**
         * Listen for incoming secure webhooks from the API server.
         *
         * @return void
         */
        public function process_webhook()
        {
        }
    }
    /**
     * UserExperience controller class.
     */
    class UserExperience extends \ContentControl\Base\Controller
    {
        /**
         * Initialize widget editor UX.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Render plugin action links.
         *
         * @param array<string,string> $links Existing links.
         * @param string               $file Plugin file path.
         *
         * @return mixed
         */
        public function plugin_action_links($links, $file)
        {
        }
        /**
         * Add a row to the plugin list table.
         *
         * @param string                   $file Plugin file path.
         * @param array<string,string|int> $plugin_data Plugin data.
         *
         * @return void
         */
        public function after_plugin_row($file, $plugin_data)
        {
        }
    }
    /**
     * WidgetEditor controller class.
     */
    class WidgetEditor extends \ContentControl\Base\Controller
    {
        /**
         * Initialize widget editor UX.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Enqueue v1 admin scripts.
         *
         * @param mixed $hook Admin page hook name.
         *
         * @return void
         */
        public function enqueue_assets($hook)
        {
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
        public function fields($widget, $ret, $instance)
        {
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
        public function save($instance, $new_instance, $old_instance)
        {
        }
    }
    /**
     * Upgrades Controller.
     *
     * @package ContentControl\Admin
     */
    class Upgrades extends \ContentControl\Base\Controller
    {
        /**
         * Initialize the settings page.
         */
        public function init()
        {
        }
        /**
         * Hook into relevant WP actions.
         *
         * @return void
         */
        public function hooks()
        {
        }
        /**
         * Get a list of all upgrades.
         *
         * @return string[]
         */
        public function all_upgrades()
        {
        }
        /**
         * Check if there are any upgrades to run.
         *
         * @return boolean
         */
        public function has_upgrades()
        {
        }
        /**
         * Get a list of required upgrades.
         *
         * Uses a cached list of done upgrades to prevent extra processing.
         *
         * @return \ContentControl\Base\Upgrade[]
         */
        public function get_required_upgrades()
        {
        }
        /**
         * AJAX Handler.
         *
         * @return void
         */
        public function ajax_handler()
        {
        }
        /**
         * AJAX Handler.
         *
         * @return void
         */
        public function ajax_handler_demo()
        {
        }
        /**
         * Render admin notices if available.
         *
         * @return void
         */
        public function admin_notices()
        {
        }
        /**
         * Add localized vars to settings page if there are upgrades to run.
         *
         * @param array<string,mixed> $vars Localized vars.
         *
         * @return array<string,mixed>
         */
        public function localize_vars($vars)
        {
        }
    }
    /**
     * Class ContentControl\Admin\Reviews
     *
     * This class adds a review request system for your plugin or theme to the WP dashboard.
     *
     * @since 1.1.0
     */
    class Reviews extends \ContentControl\Base\Controller
    {
        /**
         * Tracking API Endpoint.
         *
         * @var string
         */
        public static $api_url;
        /**
         * Initialize review requests.
         */
        public function init()
        {
        }
        /**
         * Hook into relevant WP actions.
         *
         * @return void
         */
        public function hooks()
        {
        }
        /**
         * Get the install date for comparisons. Sets the date to now if none is found.
         *
         * @return false|string
         */
        public function installed_on()
        {
        }
        /**
         * AJAX Handler
         *
         * @return void
         */
        public function ajax_handler()
        {
        }
        /**
         * Get the current trigger group and code.
         *
         * @return int|string
         */
        public function get_trigger_group()
        {
        }
        /**
         * Get the current trigger group and code.
         *
         * @return int|string
         */
        public function get_trigger_code()
        {
        }
        /**
         * Get the current trigger.
         *
         * @param string $key Optional. Key to return from the trigger array.
         *
         * @return bool|mixed
         */
        public function get_current_trigger($key = null)
        {
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
        public function dismissed_triggers()
        {
        }
        /**
         * Returns true if the user has opted to never see this again. Or sets the option.
         *
         * @param bool $set If set this will mark the user as having opted to never see this again.
         *
         * @return bool
         */
        public function already_did($set = false)
        {
        }
        /**
         * Gets a list of triggers.
         *
         * @param string $group Trigger group.
         * @param string $code Trigger code.
         *
         * @return bool|mixed
         */
        public function triggers($group = null, $code = null)
        {
        }
        /**
         * Render admin notices if available.
         *
         * @return void
         */
        public function admin_notices()
        {
        }
        /**
         * Checks if notices should be shown.
         *
         * @return bool
         */
        public function hide_notices()
        {
        }
        /**
         * Gets the last dismissed date.
         *
         * @return false|string
         */
        public function last_dismissed()
        {
        }
        /**
         * Sort array in reverse by priority value
         *
         * @param array{pri:int|null} $a First array to compare.
         * @param array{pri:int|null} $b Second array to compare.
         *
         * @return int
         */
        public function rsort_by_priority($a, $b)
        {
        }
    }
}
namespace ContentControl\Controllers {
    /**
     * RestAPI function initialization.
     */
    class RestAPI extends \ContentControl\Base\Controller
    {
        /**
         * Initiate rest api integrations.
         */
        public function init()
        {
        }
        /**
         * Register Rest API routes.
         *
         * @return void
         */
        public function register_routes()
        {
        }
    }
    /**
     * Class BlockEditor
     *
     * @version 2.0.0
     */
    class BlockEditor extends \ContentControl\Base\Controller
    {
        /**
         * Initiate hooks & filter.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Enqueue block editor assets.
         *
         * @return void
         */
        public function enqueue_assets()
        {
        }
        /**
         * Enqueue block assets.
         *
         * @return void
         */
        public function enqueue_block_assets()
        {
        }
    }
    /**
     * Post type controller.
     */
    class PostTypes extends \ContentControl\Base\Controller
    {
        /**
         * Init controller.
         *
         * @return void
         */
        public function init()
        {
        }
        /**
         * Register `restriction` post type.
         *
         * @return void
         */
        public function register_post_type()
        {
        }
        /**
         * Registers custom REST API fields for cc_restrictions post type.
         *
         * @return void
         */
        public function register_rest_fields()
        {
        }
        /**
         * Sanitize restriction settings.
         *
         * @param array<string,mixed> $settings The settings to sanitize.
         * @param int                 $id       The restriction ID.
         *
         * @return array<string,mixed> The sanitized settings.
         */
        public function sanitize_restriction_settings($settings, $id)
        {
        }
        /**
         * Validate restriction settings.
         *
         * @param array<string,mixed> $settings The settings to validate.
         * @param int                 $id       The restriction ID.
         *
         * @return bool|\WP_Error True if valid, WP_Error if not.
         */
        public function validate_restriction_settings($settings, $id)
        {
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
        public function save_post($post_id, $post, $update)
        {
        }
        /**
         * Prevent access to restrictions endpoint.
         *
         * @param mixed                                 $result Response to replace the requested version with.
         * @param \WP_REST_Server                       $server Server instance.
         * @param \WP_REST_Request<array<string,mixed>> $request  Request used to generate the response.
         * @return mixed
         */
        public function rest_pre_dispatch($result, $server, $request)
        {
        }
    }
    /**
     * Admin controller  class.
     *
     * @package ContentControl
     */
    class Admin extends \ContentControl\Base\Controller
    {
        /**
         * Initialize admin controller.
         *
         * @return void
         */
        public function init()
        {
        }
    }
    /**
     * TrustedLogin.
     *
     * @package ContentControl
     */
    class TrustedLogin extends \ContentControl\Base\Controller
    {
        /**
         * TrustedLogin init.
         */
        public function init()
        {
        }
        /**
         * Hooks.
         *
         * @return void
         */
        public function hooks()
        {
        }
        /**
         * Admin menu.
         *
         * @return void
         */
        public function admin_menu()
        {
        }
    }
    /**
     * Admin controller  class.
     *
     * @package ContentControl
     */
    class Compatibility extends \ContentControl\Base\Controller
    {
        /**
         * Initialize admin controller.
         *
         * @return void
         */
        public function init()
        {
        }
    }
    /**
     * Admin assets controller.
     *
     * @package ContentControl\Admin
     */
    class Assets extends \ContentControl\Base\Controller
    {
        /**
         * Initialize the assets controller.
         */
        public function init()
        {
        }
        /**
         * Get list of plugin packages.
         *
         * @return array<string,array<string,mixed>>
         */
        public function get_packages()
        {
        }
        /**
         * Register all package scripts & styles.
         *
         * @return void
         */
        public function register_scripts()
        {
        }
        /**
         * Auto load styles if scripts are enqueued.
         *
         * @return void
         */
        public function autoload_styles_for_scripts()
        {
        }
        /**
         * Get asset meta from generated files.
         *
         * @param string $package Package name.
         * @return array{dependencies:string[],version:string}
         */
        public function get_asset_meta($package)
        {
        }
    }
    /**
     * Class Frontend
     */
    class Frontend extends \ContentControl\Base\Controller
    {
        /**
         * Initialize Hooks & Filters
         */
        public function init()
        {
        }
        /**
         * Register general frontend hooks.
         *
         * @return void
         */
        public function hooks()
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple {
    /**
     * Container main class.
     *
     * @author Fabien Potencier
     */
    class Container implements \ArrayAccess
    {
        /**
         * Instantiates the container.
         *
         * Objects and parameters can be passed as argument to the constructor.
         *
         * @param array $values The parameters or objects
         */
        public function __construct(array $values = [])
        {
        }
        /**
         * Sets a parameter or an object.
         *
         * Objects must be defined as Closures.
         *
         * Allowing any PHP callable leads to difficult to debug problems
         * as function names (strings) are callable (creating a function with
         * the same name as an existing parameter would break your container).
         *
         * @param string $id    The unique identifier for the parameter or object
         * @param mixed  $value The value of the parameter or a closure to define an object
         *
         * @return void
         *
         * @throws FrozenServiceException Prevent override of a frozen service
         */
        #[\ReturnTypeWillChange]
        public function offsetSet($id, $value)
        {
        }
        /**
         * Gets a parameter or an object.
         *
         * @param string $id The unique identifier for the parameter or object
         *
         * @return mixed The value of the parameter or an object
         *
         * @throws UnknownIdentifierException If the identifier is not defined
         */
        #[\ReturnTypeWillChange]
        public function offsetGet($id)
        {
        }
        /**
         * Checks if a parameter or an object is set.
         *
         * @param string $id The unique identifier for the parameter or object
         *
         * @return bool
         */
        #[\ReturnTypeWillChange]
        public function offsetExists($id)
        {
        }
        /**
         * Unsets a parameter or an object.
         *
         * @param string $id The unique identifier for the parameter or object
         *
         * @return void
         */
        #[\ReturnTypeWillChange]
        public function offsetUnset($id)
        {
        }
        /**
         * Marks a callable as being a factory service.
         *
         * @param callable $callable A service definition to be used as a factory
         *
         * @return callable The passed callable
         *
         * @throws ExpectedInvokableException Service definition has to be a closure or an invokable object
         */
        public function factory($callable)
        {
        }
        /**
         * Protects a callable from being interpreted as a service.
         *
         * This is useful when you want to store a callable as a parameter.
         *
         * @param callable $callable A callable to protect from being evaluated
         *
         * @return callable The passed callable
         *
         * @throws ExpectedInvokableException Service definition has to be a closure or an invokable object
         */
        public function protect($callable)
        {
        }
        /**
         * Gets a parameter or the closure defining an object.
         *
         * @param string $id The unique identifier for the parameter or object
         *
         * @return mixed The value of the parameter or the closure defining an object
         *
         * @throws UnknownIdentifierException If the identifier is not defined
         */
        public function raw($id)
        {
        }
        /**
         * Extends an object definition.
         *
         * Useful when you want to extend an existing object definition,
         * without necessarily loading that object.
         *
         * @param string   $id       The unique identifier for the object
         * @param callable $callable A service definition to extend the original
         *
         * @return callable The wrapped callable
         *
         * @throws UnknownIdentifierException        If the identifier is not defined
         * @throws FrozenServiceException            If the service is frozen
         * @throws InvalidServiceIdentifierException If the identifier belongs to a parameter
         * @throws ExpectedInvokableException        If the extension callable is not a closure or an invokable object
         */
        public function extend($id, $callable)
        {
        }
        /**
         * Returns all defined value names.
         *
         * @return array An array of value names
         */
        public function keys()
        {
        }
        /**
         * Registers a service provider.
         *
         * @param array $values An array of values that customizes the provider
         *
         * @return static
         */
        public function register(\ContentControl\Vendor\Pimple\ServiceProviderInterface $provider, array $values = [])
        {
        }
    }
}
namespace ContentControl\Base {
    /**
     * Localized container class.
     */
    class Container extends \ContentControl\Vendor\Pimple\Container
    {
        /**
         * Get item from container
         *
         * @param string $id Key for the item.
         *
         * @return mixed Current value of the item.
         */
        public function get($id)
        {
        }
        /**
         * Set item in container
         *
         * @param string $id Key for the item.
         * @param mixed  $value Value to be set.
         *
         * @return void
         */
        public function set($id, $value)
        {
        }
    }
    /**
     * HTTP Stream class.
     */
    class Stream
    {
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
        public function __construct($stream_name = 'stream')
        {
        }
        /**
         * Start SSE stream.
         *
         * @return void
         */
        public function start()
        {
        }
        /**
         * Send SSE headers.
         *
         * @return void
         */
        public function send_headers()
        {
        }
        /**
         * Flush buffers.
         *
         * Uses a micro delay to prevent the stream from flushing too quickly.
         *
         * @return void
         */
        protected function flush_buffers()
        {
        }
        /**
         * Send general message/data to the client.
         *
         * @param mixed $data Data to send.
         *
         * @return void
         */
        public function send_data($data)
        {
        }
        /**
         * Send an event to the client.
         *
         * @param string $event Event name.
         * @param mixed  $data Data to send.
         *
         * @return void
         */
        public function send_event($event, $data = '')
        {
        }
        /**
         * Send an error to the client.
         *
         * @param array{message:string}|string $error Error message.
         *
         * @return void
         */
        public function send_error($error)
        {
        }
        /**
         * Check if the connection should abort.
         *
         * @return bool
         */
        public function should_abort()
        {
        }
    }
}
namespace ContentControl\Services {
    /**
     * HTTP Stream class.
     */
    class UpgradeStream extends \ContentControl\Base\Stream
    {
        /**
         * Upgrade status.
         *
         * @var array{total:int,progress:int,currentTask:null|array{name:string,total:int,progress:int}}|null
         */
        public $status = ['total' => 0, 'progress' => 0, 'currentTask' => null];
        /**
         * Update the status of the upgrade.
         *
         * @param array{total?:int|null,progress?:int|null,curentTask?:string|null} $status Status to update.
         *
         * @return void
         */
        public function update_status($status)
        {
        }
        /**
         * Update the status of the current task.
         *
         * @param array{total?:int,progress?:int,curentTask?:string}|null $task_status Status to update.
         *
         * @return void
         */
        public function update_task_status($task_status)
        {
        }
        /**
         * Send an event to the client.
         *
         * @param string $event Event name.
         * @param mixed  $data Data to send.
         *
         * @return void
         */
        public function send_event($event, $data = [])
        {
        }
        /**
         * Start the upgrade process.
         *
         * @param int    $total Number of upgrades.
         * @param string $message Message to send.
         *
         * @return void
         */
        public function start_upgrades($total, $message = null)
        {
        }
        /**
         * Complete the upgrade process.
         *
         * @param string $message Message to send.
         *
         * @return void
         */
        public function complete_upgrades($message = null)
        {
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
        public function start_task($name, $task_steps = 1, $message = null)
        {
        }
        /**
         * Update the progress of the current task.
         *
         * @param int $progress Progress of the task.
         *
         * @return void
         */
        public function update_task_progress($progress)
        {
        }
        /**
         * Complete the current task.
         *
         * @param string $message Message to send.
         *
         * @return void
         */
        public function complete_task($message = null)
        {
        }
    }
    /**
     * Restrictions service.
     */
    class Restrictions
    {
        /**
         * Get a list of all restrictions.
         *
         * @return Restriction[]
         */
        public function get_restrictions()
        {
        }
        /**
         * Get restriction, by ID, slug or object.
         *
         * @param int|string|Restriction $restriction Restriction ID, slug or object.
         *
         * @return Restriction|null
         */
        public function get_restriction($restriction)
        {
        }
        /**
         * Get cache key for restrictions.
         *
         * @param int|null $post_id Post ID.
         *
         * @return string
         */
        public function get_cache_key($post_id = null)
        {
        }
        /**
         * Get all applicable restrictions for the current post.
         *
         * Careful, this could be very unperformant if you have a lot of restrictions.
         *
         * @param int|null $post_id Post ID.
         *
         * @return Restriction[]
         */
        public function get_all_applicable_restrictions($post_id = null)
        {
        }
        /**
         * Get the first applicable restriction for the current post.
         *
         * Performant version that breaks on first applicable restriction. Sorted by priority.
         * cached internally.
         *
         * @param int|null $post_id Post ID.
         *
         * @return Restriction|false
         */
        public function get_applicable_restriction($post_id = null)
        {
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
        public function has_applicable_restrictions($post_id = null)
        {
        }
        /**
         * Check if user meets requirements for given restriction.
         *
         * @param int|string|Restriction $restriction Restriction ID, slug or object.
         *
         * @return boolean
         */
        public function user_meets_requirements($restriction)
        {
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
        public function sort_restrictions_by_priority($restrictions)
        {
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
    class PluginSilentUpgraderSkin extends \WP_Upgrader_Skin
    {
        /**
         * Empty out the header of its HTML content and only check to see if it has
         * been performed or not.
         *
         * @return void
         */
        public function header()
        {
        }
        /**
         * Empty out the footer of its HTML contents.
         *
         * @return void
         */
        public function footer()
        {
        }
        /**
         * Instead of outputting HTML for errors, just return them.
         * Ajax request will just ignore it.
         *
         * @param string|\WP_Error $errors Array of errors with the install process.
         *
         * @return string|\WP_Error
         */
        public function error($errors)
        {
        }
        /**
         * Empty out JavaScript output that calls function to decrement the update counts.
         *
         * @param string $type Type of update count to decrement.
         *
         * @return void
         */
        public function decrement_update_count($type)
        {
        }
    }
    /**
     * Skin for on-the-fly addon installations.
     *
     * @since 1.0.0
     * @since 2.0.0 Extend PluginSilentUpgraderSkin and clean up the class.
     */
    class Install_Skin extends \ContentControl\Installers\PluginSilentUpgraderSkin
    {
        /**
         * Instead of outputting HTML for errors, json_encode the errors and send them
         * back to the Ajax script for processing.
         *
         * @since 2.0.0
         *
         * @param string|\WP_Error $errors Array of errors with the install process.
         */
        public function error($errors)
        {
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
    class PluginSilentUpgrader extends \Plugin_Upgrader
    {
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
        public function run($options)
        {
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
        public function maintenance_mode($enable = false)
        {
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
        public function download_package($package, $check_signatures = false, $hook_extra = [])
        {
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
        public function unpack_package($package, $delete_package = true)
        {
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
        public function install_package($args = [])
        {
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
        public function install($package, $args = [])
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple\Tests {
    class ServiceIteratorTest extends \PHPUnit\Framework\TestCase
    {
        public function testIsIterable()
        {
        }
    }
    /**
     * @author Igor Wiedler <igor@wiedler.ch>
     */
    class PimpleTest extends \PHPUnit\Framework\TestCase
    {
        public function testWithString()
        {
        }
        public function testWithClosure()
        {
        }
        public function testServicesShouldBeDifferent()
        {
        }
        public function testShouldPassContainerAsParameter()
        {
        }
        public function testIsset()
        {
        }
        public function testConstructorInjection()
        {
        }
        public function testOffsetGetValidatesKeyIsPresent()
        {
        }
        /**
         * @group legacy
         */
        public function testLegacyOffsetGetValidatesKeyIsPresent()
        {
        }
        public function testOffsetGetHonorsNullValues()
        {
        }
        public function testUnset()
        {
        }
        /**
         * @dataProvider serviceDefinitionProvider
         */
        public function testShare($service)
        {
        }
        /**
         * @dataProvider serviceDefinitionProvider
         */
        public function testProtect($service)
        {
        }
        public function testGlobalFunctionNameAsParameterValue()
        {
        }
        public function testRaw()
        {
        }
        public function testRawHonorsNullValues()
        {
        }
        public function testFluentRegister()
        {
        }
        public function testRawValidatesKeyIsPresent()
        {
        }
        /**
         * @group legacy
         */
        public function testLegacyRawValidatesKeyIsPresent()
        {
        }
        /**
         * @dataProvider serviceDefinitionProvider
         */
        public function testExtend($service)
        {
        }
        public function testExtendDoesNotLeakWithFactories()
        {
        }
        public function testExtendValidatesKeyIsPresent()
        {
        }
        /**
         * @group legacy
         */
        public function testLegacyExtendValidatesKeyIsPresent()
        {
        }
        public function testKeys()
        {
        }
        /** @test */
        public function settingAnInvokableObjectShouldTreatItAsFactory()
        {
        }
        /** @test */
        public function settingNonInvokableObjectShouldTreatItAsParameter()
        {
        }
        /**
         * @dataProvider badServiceDefinitionProvider
         */
        public function testFactoryFailsForInvalidServiceDefinitions($service)
        {
        }
        /**
         * @group legacy
         * @dataProvider badServiceDefinitionProvider
         */
        public function testLegacyFactoryFailsForInvalidServiceDefinitions($service)
        {
        }
        /**
         * @dataProvider badServiceDefinitionProvider
         */
        public function testProtectFailsForInvalidServiceDefinitions($service)
        {
        }
        /**
         * @group legacy
         * @dataProvider badServiceDefinitionProvider
         */
        public function testLegacyProtectFailsForInvalidServiceDefinitions($service)
        {
        }
        /**
         * @dataProvider badServiceDefinitionProvider
         */
        public function testExtendFailsForKeysNotContainingServiceDefinitions($service)
        {
        }
        /**
         * @group legacy
         * @dataProvider badServiceDefinitionProvider
         */
        public function testLegacyExtendFailsForKeysNotContainingServiceDefinitions($service)
        {
        }
        /**
         * @group legacy
         * @expectedDeprecation How Pimple behaves when extending protected closures will be fixed in Pimple 4. Are you sure "foo" should be protected?
         */
        public function testExtendingProtectedClosureDeprecation()
        {
        }
        /**
         * @dataProvider badServiceDefinitionProvider
         */
        public function testExtendFailsForInvalidServiceDefinitions($service)
        {
        }
        /**
         * @group legacy
         * @dataProvider badServiceDefinitionProvider
         */
        public function testLegacyExtendFailsForInvalidServiceDefinitions($service)
        {
        }
        public function testExtendFailsIfFrozenServiceIsNonInvokable()
        {
        }
        public function testExtendFailsIfFrozenServiceIsInvokable()
        {
        }
        /**
         * Provider for invalid service definitions.
         */
        public function badServiceDefinitionProvider()
        {
        }
        /**
         * Provider for service definitions.
         */
        public function serviceDefinitionProvider()
        {
        }
        public function testDefiningNewServiceAfterFreeze()
        {
        }
        public function testOverridingServiceAfterFreeze()
        {
        }
        /**
         * @group legacy
         */
        public function testLegacyOverridingServiceAfterFreeze()
        {
        }
        public function testRemovingServiceAfterFreeze()
        {
        }
        public function testExtendingService()
        {
        }
        public function testExtendingServiceAfterOtherServiceFreeze()
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple\Tests\Psr11 {
    class ContainerTest extends \PHPUnit\Framework\TestCase
    {
        public function testGetReturnsExistingService()
        {
        }
        public function testGetThrowsExceptionIfServiceIsNotFound()
        {
        }
        public function testHasReturnsTrueIfServiceExists()
        {
        }
        public function testHasReturnsFalseIfServiceDoesNotExist()
        {
        }
    }
    /**
     * ServiceLocator test case.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class ServiceLocatorTest extends \PHPUnit\Framework\TestCase
    {
        public function testCanAccessServices()
        {
        }
        public function testCanAccessAliasedServices()
        {
        }
        public function testCannotAccessAliasedServiceUsingRealIdentifier()
        {
        }
        public function testGetValidatesServiceCanBeLocated()
        {
        }
        public function testGetValidatesTargetServiceExists()
        {
        }
        public function testHasValidatesServiceCanBeLocated()
        {
        }
        public function testHasChecksIfTargetServiceExists()
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple\Tests {
    /**
     * @author Dominik Zogg <dominik.zogg@gmail.com>
     */
    class PimpleServiceProviderInterfaceTest extends \PHPUnit\Framework\TestCase
    {
        public function testProvider()
        {
        }
        public function testProviderWithRegisterMethod()
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple\Tests\Fixtures {
    class NonInvokable
    {
        public function __call($a, $b)
        {
        }
    }
    /**
     * @author  Igor Wiedler <igor@wiedler.ch>
     */
    class Service
    {
        public $value;
    }
    class Invokable
    {
        public function __invoke($value = null)
        {
        }
    }
}
namespace ContentControl\Vendor\Pimple {
    /**
     * Pimple service provider interface.
     *
     * @author  Fabien Potencier
     * @author  Dominik Zogg
     */
    interface ServiceProviderInterface
    {
        /**
         * Registers services on the given container.
         *
         * This method should only be used to configure services and parameters.
         * It should not get services.
         */
        public function register(\ContentControl\Vendor\Pimple\Container $pimple);
    }
}
namespace ContentControl\Vendor\Pimple\Tests\Fixtures {
    class PimpleServiceProvider implements \ContentControl\Vendor\Pimple\ServiceProviderInterface
    {
        /**
         * Registers services on the given container.
         *
         * This method should only be used to configure services and parameters.
         * It should not get services.
         */
        public function register(\ContentControl\Vendor\Pimple\Container $pimple)
        {
        }
    }
}
namespace ContentControl\Vendor\Psr\Container {
    /**
     * Describes the interface of a container that exposes methods to read its entries.
     */
    interface ContainerInterface
    {
        /**
         * Finds an entry of the container by its identifier and returns it.
         *
         * @param string $id Identifier of the entry to look for.
         *
         * @throws NotFoundExceptionInterface  No entry was found for **this** identifier.
         * @throws ContainerExceptionInterface Error while retrieving the entry.
         *
         * @return mixed Entry.
         */
        public function get(string $id);
        /**
         * Returns true if the container can return an entry for the given identifier.
         * Returns false otherwise.
         *
         * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
         * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
         *
         * @param string $id Identifier of the entry to look for.
         *
         * @return bool
         */
        public function has(string $id) : bool;
    }
}
namespace ContentControl\Vendor\Pimple\Psr11 {
    /**
     * PSR-11 compliant wrapper.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    final class Container implements \ContentControl\Vendor\Psr\Container\ContainerInterface
    {
        public function __construct(\ContentControl\Vendor\Pimple\Container $pimple)
        {
        }
        public function get(string $id)
        {
        }
        public function has(string $id) : bool
        {
        }
    }
    /**
     * Pimple PSR-11 service locator.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class ServiceLocator implements \ContentControl\Vendor\Psr\Container\ContainerInterface
    {
        /**
         * @param PimpleContainer $container The Container instance used to locate services
         * @param array           $ids       Array of service ids that can be located. String keys can be used to define aliases
         */
        public function __construct(\ContentControl\Vendor\Pimple\Container $container, array $ids)
        {
        }
        /**
         * {@inheritdoc}
         */
        public function get(string $id)
        {
        }
        /**
         * {@inheritdoc}
         */
        public function has(string $id) : bool
        {
        }
    }
}
namespace ContentControl\Vendor\Psr\Container {
    /**
     * Base interface representing a generic exception in a container.
     */
    interface ContainerExceptionInterface extends \Throwable
    {
    }
}
namespace ContentControl\Vendor\Pimple\Exception {
    /**
     * An attempt to modify a frozen service was made.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class FrozenServiceException extends \RuntimeException implements \ContentControl\Vendor\Psr\Container\ContainerExceptionInterface
    {
        /**
         * @param string $id Identifier of the frozen service
         */
        public function __construct($id)
        {
        }
    }
}
namespace ContentControl\Vendor\Psr\Container {
    /**
     * No entry was found in the container.
     */
    interface NotFoundExceptionInterface extends \ContentControl\Vendor\Psr\Container\ContainerExceptionInterface
    {
    }
}
namespace ContentControl\Vendor\Pimple\Exception {
    /**
     * The identifier of a valid service or parameter was expected.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class UnknownIdentifierException extends \InvalidArgumentException implements \ContentControl\Vendor\Psr\Container\NotFoundExceptionInterface
    {
        /**
         * @param string $id The unknown identifier
         */
        public function __construct($id)
        {
        }
    }
    /**
     * An attempt to perform an operation that requires a service identifier was made.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class InvalidServiceIdentifierException extends \InvalidArgumentException implements \ContentControl\Vendor\Psr\Container\NotFoundExceptionInterface
    {
        /**
         * @param string $id The invalid identifier
         */
        public function __construct($id)
        {
        }
    }
    /**
     * A closure or invokable object was expected.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    class ExpectedInvokableException extends \InvalidArgumentException implements \ContentControl\Vendor\Psr\Container\ContainerExceptionInterface
    {
    }
}
namespace ContentControl\Vendor\Pimple {
    /**
     * Lazy service iterator.
     *
     * @author Pascal Luna <skalpa@zetareticuli.org>
     */
    final class ServiceIterator implements \Iterator
    {
        public function __construct(\ContentControl\Vendor\Pimple\Container $container, array $ids)
        {
        }
        /**
         * @return void
         */
        #[\ReturnTypeWillChange]
        public function rewind()
        {
        }
        /**
         * @return mixed
         */
        #[\ReturnTypeWillChange]
        public function current()
        {
        }
        /**
         * @return mixed
         */
        #[\ReturnTypeWillChange]
        public function key()
        {
        }
        /**
         * @return void
         */
        #[\ReturnTypeWillChange]
        public function next()
        {
        }
        /**
         * @return bool
         */
        #[\ReturnTypeWillChange]
        public function valid()
        {
        }
    }
}
namespace ContentControl\Vendor\TrustedLogin {
    final class SupportRole
    {
        /**
         * @const The capability that is added to the Support Role to indicate that it was created by TrustedLogin.
         * @since 1.6.0
         */
        const CAPABILITY_FLAG = 'trustedlogin_{ns}_support_role';
        /**
         * @var array These capabilities will never be allowed for users created by TrustedLogin.
         * @since 1.0.0
         */
        static $prevented_caps = array('create_users', 'delete_users', 'edit_users', 'list_users', 'promote_users', 'delete_site', 'remove_users');
        /**
         * @var array These roles cannot be deleted by TrustedLogin.
         * @since 1.6.0
         */
        static $protected_roles = array('administrator', 'editor', 'author', 'contributor', 'subscriber', 'wpseo_editor', 'wpseo_manager', 'shop_manager', 'shop_accountant', 'shop_worker', 'shop_vendor', 'customer');
        /**
         * SupportUser constructor.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         * Get the name (slug) of the role that should be cloned for the TL support role
         *
         * @return string
         */
        public function get_cloned_name()
        {
        }
        /**
         * @return string
         */
        public function get_name()
        {
        }
        /**
         * Returns the Support Role, creating it if it doesn't already exist.
         *
         * @since 1.6.0
         *
         * @return \WP_Role|\WP_Error Role, if successful. WP_Error if failure.
         */
        public function get()
        {
        }
        /**
         * Creates the custom Support Role if it doesn't already exist
         *
         * @since 1.0.0
         * @since 1.0.0 removed excluded_caps from generated role
         *
         * @param string $new_role_slug    The slug for the new role (optional). Default: {@see SupportRole::get_name()}
         * @param string $clone_role_slug  The slug for the role to clone (optional). Default: {@see SupportRole::get_cloned_name()}.
         *
         * @return \WP_Role|\WP_Error Created/pre-existing role, if successful. WP_Error if failure.
         */
        public function create($new_role_slug = '', $clone_role_slug = '')
        {
        }
        /**
         * @return bool|null Null: Role wasn't found; True: Removing role succeeded; False: Role wasn't deleted successfully.
         */
        public function delete()
        {
        }
    }
    /**
     * The TrustedLogin all-in-one drop-in class.
     */
    final class SupportUser
    {
        /**
         * @var string The query parameter used to pass the unique user ID
         */
        const ID_QUERY_PARAM = 'tlid';
        /**
         * @var SupportRole $role
         */
        public $role;
        /**
         * SupportUser constructor.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         * Allow accessing limited private properties with a magic method.
         *
         * @param string $name Name of property
         *
         * @return string|null Value of property, if defined. Otherwise, null.
         */
        public function __get($name)
        {
        }
        /**
         * Checks if a Support User for this vendor has already been created.
         *
         * @since 1.0.0
         *
         * @return int|false - WP User ID if support user exists, otherwise false.
         */
        public function exists()
        {
        }
        /**
         * Returns whether the support user exists and has an expiration time in the future.
         *
         * @since 1.0.2
         *
         * @return bool True: Support user exists and has an expiration time in the future. False: Any of those things aren't true.
         */
        public function is_active($passed_user = null)
        {
        }
        /**
         * Create the Support User.
         *
         * @since 1.0.0
         *
         * @uses wp_insert_user()
         *
         * @return int|WP_Error - Array with login response information if created, or WP_Error object if there was an issue.
         */
        public function create()
        {
        }
        /**
         * Returns the site secret ID connected to the support user.
         *
         * @param string $user_identifier
         *
         * @return string|WP_Error|null Returns the secret ID. WP_Error if there was a problem generating any hashes. Null: No users were found using that user identifier.
         */
        public function get_secret_id($user_identifier)
        {
        }
        /**
         * Logs in a support user, if any exist at $user_identifier and haven't expired yet
         *
         * If the user access has expired, deletes the user with {@see SupportUser::delete()}
         *
         * @param string $user_identifier Unique identifier for support user before being hashed.
         *
         * @return true|WP_Error
         */
        public function maybe_login($user_identifier)
        {
        }
        /**
         * Helper Function: Get the generated support user(s).
         *
         * @since 1.0.0
         *
         * @param string $user_identifier_or_hash
         *
         * @return \WP_User|null WP_User if found; null if not
         */
        public function get($user_identifier_or_hash = '')
        {
        }
        /**
         * Returns the expiration for user access as either a human-readable string or timestamp.
         *
         * @param \WP_User $user
         * @param bool $human_readable Whether to show expiration as a human_time_diff()-formatted string. Default: false.
         * @param bool $gmt Whether to use GMT timestamp in the human-readable result. Not used if $human_readable is false. Default: false.
         *
         * @return int|string|false False if no expiration is set. Expiration timestamp if $human_readable is false. Time diff if $human_readable is true.
         */
        public function get_expiration(\WP_User $user, $human_readable = false, $gmt = false)
        {
        }
        /**
         * Get all users with the support role.
         *
         * @since 1.0.0
         *
         * @return \WP_User[]
         */
        public function get_all()
        {
        }
        /**
         * Returns the first support user active on the site, if any.
         *
         * @since 1.0.0
         *
         * @return \WP_User|null
         */
        public function get_first()
        {
        }
        /**
         * Deletes support user(s) with options to delete the TrustedLogin-created user role and endpoint as well
         *
         * @used-by SupportUser::maybe_login() Called when user access has expired, but the cron didn't run...
         * @used-by Client::revoke_access()
         *
         * @param string $user_identifier Unique identifier of the user to delete.
         * @param bool $delete_role Should the TrustedLogin-created user role be deleted also? Default: `true`.
         * @param bool $delete_endpoint Should the TrustedLogin endpoint for the site be deleted also? Default: `true`.
         *
         * @return bool|WP_Error True: Successfully removed user and role; false: There are no support users matching $user_identifier; WP_Error: something went wrong.
         */
        public function delete($user_identifier = '', $delete_role = true, $delete_endpoint = true)
        {
        }
        /**
         * Schedules cron job to auto-revoke, adds user meta with unique ids
         *
         * @param int $user_id ID of generated support user
         * @param string $site_identifier_hash
         * @param int $decay_timestamp Timestamp when user will be removed
         *
         * @return string|WP_Error Value of $identifier_meta_key if worked; empty string or WP_Error if not.
         */
        public function setup($user_id, $site_identifier_hash, $expiration_timestamp = null, \ContentControl\Vendor\TrustedLogin\Cron $cron = null)
        {
        }
        /**
         * Updates the scheduled cron job to auto-revoke and updates the Support User's meta.
         *
         * @param int $user_id ID of generated support user.
         * @param string $site_identifier_hash The unique identifier for the WP_User created {@see Encryption::get_random_hash()}
         * @param int $expiration_timestamp Timestamp when user will be removed. Throws error if null/empty.
         * @param Cron|null $cron Optional. The Cron object for handling scheduling. Defaults to null.
         *
         * @return string|WP_Error Value of $identifier_meta_key if worked; empty string or WP_Error if not.
         */
        public function extend($user_id, $site_identifier_hash, $expiration_timestamp = null, $cron = null)
        {
        }
        /**
         * @param \WP_User|int $user_id_or_object User ID or User object
         *
         * @return string|WP_Error User unique identifier if success; WP_Error if $user is not int or WP_User.
         */
        public function get_user_identifier($user_id_or_object)
        {
        }
        /**
         * @param WP_User|int $user_id_or_object User ID or User object
         *
         * @return string|WP_Error User unique identifier if success; WP_Error if $user is not int or WP_User.
         */
        public function get_site_hash($user_id_or_object)
        {
        }
        /**
         * Returns admin URL to revoke support user
         *
         * @uses SupportUser::get_user_identifier()
         *
         * @since 1.1 Removed second parameter $current_url.
         *
         * @param \WP_User|int|string $user User object, user ID, or "all". If "all", will revoke all users.
         *
         * @return string|false Unsanitized nonce URL to revoke support user. If not able to retrieve user identifier, returns false.
         */
        public function get_revoke_url($user)
        {
        }
    }
    /**
     * Copied from https://github.com/katzgrau/KLogger/blob/3c19e350232e5fee0c3e96e3eff1e7be5f37d617/src/Logger.php
     * See: https://github.com/trustedlogin/client/issues/105
     *
     * A light, permissions-checking logging class.
     *
     * Originally written for use with wpSearch
     *
     * Usage:
     * $log = new Katzgrau\KLogger\Logger('/var/log/', Psr\Log\LogLevel::INFO);
     * $log->info('Returned a million search results'); //Prints to the log file
     * $log->error('Oh dear.'); //Prints to the log file
     * $log->debug('x = 5'); //Prints nothing due to current severity threshhold
     *
     * @author  Kenny Katzgrau <katzgrau@gmail.com>
     * @since   July 26, 2008
     * @link    https://github.com/katzgrau/KLogger
     * @version 1.0.0
     */
    class Logger
    {
        const EMERGENCY = 'emergency';
        const ALERT = 'alert';
        const CRITICAL = 'critical';
        const ERROR = 'error';
        const WARNING = 'warning';
        const NOTICE = 'notice';
        const INFO = 'info';
        const DEBUG = 'debug';
        /**
         * KLogger options
         *  Anything options not considered 'core' to the logging library should be
         *  settable view the third parameter in the constructor
         *
         *  Core options include the log file path and the log threshold
         *
         * @var array
         */
        protected $options = array('extension' => 'txt', 'dateFormat' => 'Y-m-d G:i:s.u', 'filename' => false, 'flushFrequency' => false, 'prefix' => 'log_', 'logFormat' => false, 'appendContext' => true);
        /**
         * Current minimum logging threshold
         * @var integer
         */
        protected $logLevelThreshold = self::DEBUG;
        /**
         * Log Levels
         * @var array
         */
        protected $logLevels = array(self::EMERGENCY => 0, self::ALERT => 1, self::CRITICAL => 2, self::ERROR => 3, self::WARNING => 4, self::NOTICE => 5, self::INFO => 6, self::DEBUG => 7);
        /**
         * Class constructor
         *
         * @param string $logDirectory      File path to the logging directory
         * @param string $logLevelThreshold The LogLevel Threshold
         * @param array  $options
         *
         * @internal param string $logFilePrefix The prefix for the log file name
         * @internal param string $logFileExt The extension for the log file
         */
        public function __construct($logDirectory, $logLevelThreshold = self::DEBUG, array $options = array())
        {
        }
        /**
         * @param string $stdOutPath
         */
        public function setLogToStdOut($stdOutPath)
        {
        }
        /**
         * @param string $logDirectory
         */
        public function setLogFilePath($logDirectory)
        {
        }
        /**
         * @param $writeMode
         *
         * @internal param resource $fileHandle
         */
        public function setFileHandle($writeMode)
        {
        }
        /**
         * Class destructor
         */
        public function __destruct()
        {
        }
        /**
         * Sets the date format used by all instances of KLogger
         *
         * @param string $dateFormat Valid format string for date()
         */
        public function setDateFormat($dateFormat)
        {
        }
        /**
         * Sets the Log Level Threshold
         *
         * @param string $logLevelThreshold The log level threshold
         */
        public function setLogLevelThreshold($logLevelThreshold)
        {
        }
        /**
         * Logs with an arbitrary level.
         *
         * @param mixed $level
         * @param string $message
         * @param array $context
         * @return null
         */
        public function log($level, $message, array $context = array())
        {
        }
        /**
         * Writes a line to the log without prepending a status or timestamp
         *
         * @param string $message Line to write to the log
         * @return void
         */
        public function write($message)
        {
        }
        /**
         * Get the file path that the log is currently writing to
         *
         * @return string
         */
        public function getLogFilePath()
        {
        }
        /**
         * Get the last line logged to the log file
         *
         * @return string
         */
        public function getLastLogLine()
        {
        }
        /**
         * Formats the message for logging.
         *
         * @param  string $level   The Log Level of the message
         * @param  string $message The message to log
         * @param  array  $context The context
         * @return string
         */
        protected function formatMessage($level, $message, $context)
        {
        }
        /**
         * Takes the given context and coverts it to a string.
         *
         * @param  array $context The Context
         * @return string
         */
        protected function contextToString($context)
        {
        }
        /**
         * Indents the given string with the given indent.
         *
         * @param  string $string The string to indent
         * @param  string $indent What to use as the indent.
         * @return string
         */
        protected function indent($string, $indent = '    ')
        {
        }
        /**
         * System is unusable.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function emergency($message, array $context = array())
        {
        }
        /**
         * Action must be taken immediately.
         *
         * Example: Entire website down, database unavailable, etc. This should
         * trigger the SMS alerts and wake you up.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function alert($message, array $context = array())
        {
        }
        /**
         * Critical conditions.
         *
         * Example: Application component unavailable, unexpected exception.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function critical($message, array $context = array())
        {
        }
        /**
         * Runtime errors that do not require immediate action but should typically
         * be logged and monitored.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function error($message, array $context = array())
        {
        }
        /**
         * Exceptional occurrences that are not errors.
         *
         * Example: Use of deprecated APIs, poor use of an API, undesirable things
         * that are not necessarily wrong.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function warning($message, array $context = array())
        {
        }
        /**
         * Normal but significant events.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function notice($message, array $context = array())
        {
        }
        /**
         * Interesting events.
         *
         * Example: User logs in, SQL logs.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function info($message, array $context = array())
        {
        }
        /**
         * Detailed debug information.
         *
         * @param string  $message
         * @param mixed[] $context
         *
         * @return void
         */
        public function debug($message, array $context = array())
        {
        }
    }
    final class Encryption
    {
        /**
         * Encryption constructor.
         *
         * @param Config $config
         * @param Remote $remote
         * @param Logging $logging
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Remote $remote, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         * Returns true if the site supports encryption using the required Sodium functions.
         *
         * These functions are available by extension in PHP 7.0 & 7.1, built-in to PHP 7.2+ and WordPress 5.2+.
         *
         * @since 1.4.0
         *
         * @return bool True: supports encryption. False: does not support encryption.
         */
        public static function meets_requirements()
        {
        }
        /**
         * Generates a random hash 64 characters long.
         *
         * If random_bytes() and openssl_random_pseudo_bytes() don't exist, returns WP_Error with code generate_hash_failed.
         *
         * If random_bytes() does not exist and openssl_random_pseudo_bytes() is unable to return a strong result,
         * returns a WP_Error with code `openssl_not_strong_crypto`.
         *
         * @uses random_bytes
         * @uses openssl_random_pseudo_bytes Only used if random_bytes() does not exist.
         *
         * @param Logging The logging object to use
         *
         * @return string|WP_Error 64-character random hash or a WP_Error object explaining what went wrong. See docblock.
         */
        public static function get_random_hash($logging)
        {
        }
        /**
         * @param $string
         *
         * @return string|WP_Error
         */
        public static function hash($string, $length = 16)
        {
        }
        /**
         * Fetches the Public Key from local or db
         *
         * @since 1.0.0
         *
         * @return string|WP_Error  If found, it returns the publicKey, if not a WP_Error
         */
        public function get_vendor_public_key()
        {
        }
        /**
         * Returns the URL for the vendor public key endpoint.
         *
         * @since 1.5.0
         *
         * @return string URL for the vendor public key endpoint, after being filtered.
         */
        public function get_remote_encryption_key_url()
        {
        }
        /**
         * Encrypts a string using the Public Key provided by the plugin/theme developers' server.
         *
         * @since 1.0.0
         * @uses \sodium_crypto_box_keypair_from_secretkey_and_publickey() to generate key.
         * @uses \sodium_crypto_secretbox() to encrypt.
         *
         * @param string $data Data to encrypt.
         * @param string $nonce The nonce generated for this encryption.
         * @param string $alice_secret_key The key to use when generating the encryption key.
         *
         * @return string|WP_Error  Encrypted envelope or WP_Error on failure.
         */
        public function encrypt($data, $nonce, $alice_secret_key)
        {
        }
        /**
         * Gets and returns a random nonce.
         *
         * @since 1.0.0
         *
         * @return string|WP_Error  Nonce if created, otherwise WP_Error
         */
        public function get_nonce()
        {
        }
        /**
         * Generate unique Client encryption keys.
         *
         * @since 1.0.0
         *
         * @uses sodium_crypto_box_keypair()
         * @uses sodium_crypto_box_publickey()
         * @uses sodium_crypto_box_secretkey()
         *
         * @return object|WP_Error $alice_keys or WP_Error if there's any issues.
         *   $alice_keys = [
         *      'publicKey'  =>  (string)  The public key.
         *      'privateKey' =>  (string)  The private key.
         *   ]
         */
        public function generate_keys()
        {
        }
    }
    /**
     * The TrustedLogin all-in-one drop-in class.
     */
    final class Envelope
    {
        /**
         * Envelope constructor.
         *
         * @param Config $config
         * @param Encryption $encryption
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Encryption $encryption)
        {
        }
        /**
         * @param string $secret_id
         * @param string $site_identifier_hash
         * @param string $access_key
         *
         * @return array|WP_Error
         */
        public function get($secret_id, $site_identifier_hash, $access_key = '')
        {
        }
    }
    final class Ajax
    {
        /**
         * Cron constructor.
         *
         * @param Config $config
         * @param Logging|null $logging
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         *
         */
        public function init()
        {
        }
        /**
         * AJAX handler for maybe generating a Support User
         *
         * @since 1.0.0
         *
         * @return void Sends a JSON success or error message based on what happens
         */
        public function ajax_generate_support()
        {
        }
    }
    /**
     * The TrustedLogin all-in-one drop-in class.
     */
    final class Remote
    {
        /**
         * @var string The API url for the TrustedLogin SaaS Platform (with trailing slash)
         * @since 1.0.0
         */
        const API_URL = 'https://app.trustedlogin.com/api/v1/';
        /**
         * SupportUser constructor.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        public function init()
        {
        }
        /**
         * POSTs to `webhook/url`, if defined in the configuration array.
         *
         * @since 1.0.0
         * @since 1.4.0 $data now includes the `$access_key` and `$debug_data` keys.
         * @since 1.5.0 $data now includes the `$ticket` key.
         *
         * @param array $data {
         *   @type string $url The site URL as returned by get_site_url().
         *   @type string $ns Namespace of the plugin.
         *   @type string $action "created", "extended", "logged_in", or "revoked".
         *   @type string $access_key The access key.
         *   @type string $debug_data (Optional) Site debug data from {@see WP_Debug_Data::debug_data()}, sent if `webhook/debug_data` is true.
         *   @type string $ref (Optional) Support ticket Reference ID.
         *   @type array $ticket (Optional) Support ticket provided by customer with `message` key.
         * }
         *
         * @return bool|WP_Error False: webhook setting not defined; True: success; WP_Error: error!
         */
        public function maybe_send_webhook($data)
        {
        }
        /**
         * API Function: send the API request
         *
         * @since 1.0.0
         *
         * @param string $path - the path for the REST API request (no initial or trailing slash needed)
         * @param array $data Data passed as JSON-encoded body for
         * @param string $method
         * @param array $additional_headers - any additional headers required for auth/etc
         *
         * @return array|WP_Error wp_remote_request() response or WP_Error if something went wrong
         */
        public function send($path, $data, $method = 'POST', $additional_headers = array())
        {
        }
        /**
         * Translates response codes to more nuanced error descriptions specific to TrustedLogin.
         *
         * @param array|WP_Error $api_response Response from HTTP API
         *
         * @return int|WP_Error|null If valid response, the response code ID or null. If error, a WP_Error with a message description.
         */
        public static function check_response_code($api_response)
        {
        }
        /**
         * API Response Handler
         *
         * @since 1.0.0
         *
         * @param array|WP_Error $api_response - the response from HTTP API
         * @param array $required_keys If the response JSON must have specific keys in it, pass them here
         *
         * @return array|WP_Error|null If successful response, returns array of JSON data. If failed, returns WP_Error. If
         */
        public function handle_response($api_response, $required_keys = array())
        {
        }
    }
    final class Config
    {
        /**
         * Config constructor.
         *
         * @param array $settings
         *
         * @throws \Exception
         */
        public function __construct(array $settings = array())
        {
        }
        /**
         * @return true|\WP_Error[]
         * @throws \Exception
         *
         */
        public function validate()
        {
        }
        /**
         * Returns a timestamp that is the current time + decay time setting
         *
         * Note: This is a server timestamp, not a WordPress timestamp
         *
         * @param int $decay_time If passed, override the `decay` setting
         * @param bool $gmt Whether to use server time (false) or GMT time (true). Default: false.
         *
         * @return int|false Timestamp in seconds. Default is WEEK_IN_SECONDS from creation (`time()` + 604800). False if no expiration.
         */
        public function get_expiration_timestamp($decay_time = null, $gmt = false)
        {
        }
        /**
         * Returns the display name for the vendor; otherwise, the title
         *
         * @return string
         */
        public function get_display_name()
        {
        }
        /**
         * Filter out null input values
         *
         * @internal Used for parsing settings
         *
         * @param mixed $input Input to test against.
         *
         * @return bool True: not null. False: null
         */
        public function is_not_null($input)
        {
        }
        /**
         * Gets the default settings for the Client and define dynamic defaults (like paths/css and paths/js)
         *
         * @since 1.0.0
         *
         * @return array Array of default settings.
         */
        public function get_default_settings()
        {
        }
        /**
         * @return string Vendor namespace, sanitized with dashes
         */
        public function ns()
        {
        }
        /**
         * Helper Function: Get a specific setting or return a default value.
         *
         * @since 1.0.0
         *
         * @param string $key The setting to fetch, nested results are delimited with forward slashes (eg vendor/name => settings['vendor']['name'])
         * @param mixed $default - if no setting found or settings not init, return this value.
         * @param array $settings Pass an array to fetch value for instead of using the default settings array
         *
         * @return string|array
         */
        public function get_setting($key, $default = null, $settings = array())
        {
        }
        /**
         * Returns the full settings array
         *
         * @since 1.5.0
         *
         * @return array Settings as passed to the constructor.
         */
        public function get_settings()
        {
        }
        /**
         * Checks whether SSL requirements are met.
         *
         * @since 1.0.0
         *
         * @return bool  Whether the vendor-defined SSL requirements are met.
         */
        public function meets_ssl_requirement()
        {
        }
    }
    class SiteAccess
    {
        /**
         *
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         * Handles the syncing of newly generated support access to the TrustedLogin servers.
         *
         * @param string $secret_id The unique identifier for this TrustedLogin authorization. {@see Endpoint::generate_secret_id}
         * @param string $site_identifier_hash The unique identifier for the WP_User created {@see Encryption::get_random_hash()}
         * @param string $action The type of sync this is. Options can be 'create', 'extend'.
         *
         * @return true|WP_Error True if successfully created secret on TrustedLogin servers; WP_Error if failed.
         */
        public function sync_secret($secret_id, $site_identifier_hash, $action = 'create')
        {
        }
        /**
         * Gets the shareable access key
         *
         * - For licensed plugins or themes, a hashed customer's license key is the access key.
         * - For plugins or themes without license keys, the accessKey is generated for the site.
         *
         * @uses SiteAccess::get_license_key()
         * @uses SiteAccess::generate_access_key()
         *
         * @since 1.0.0
         *
         * @return string|WP_Error $access_key, if exists. Either a hashed license key or a generated hash. If error occurs, returns null.
         */
        public function get_access_key()
        {
        }
        /**
         * Get the license key for the current user.
         *
         * @since 1.0.0
         *
         * @param bool $hashed Should the value be hashed using SHA256?
         *
         * @return string|null|WP_Error License key (hashed if $hashed is true) or null if not found. Returns WP_Error if error occurs.
         */
        public function get_license_key($hashed = false)
        {
        }
        /**
         * Revoke a site in TrustedLogin
         *
         * @param string $secret_id ID of site secret identifier to be removed from TrustedLogin
         * @param Remote $remote
         *
         * @return true|\WP_Error Was the sync to TrustedLogin successful
         */
        public function revoke($secret_id, \ContentControl\Vendor\TrustedLogin\Remote $remote)
        {
        }
    }
    final class Cron
    {
        /**
         * Cron constructor.
         *
         * @param Config $config
         * @param Logging|null $logging
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         *
         */
        public function init()
        {
        }
        /**
         * @param int $expiration_timestamp
         * @param string $identifier_hash
         *
         * @return bool
         */
        public function schedule($expiration_timestamp, $identifier_hash)
        {
        }
        /**
         * @param int $expiration_timestamp
         * @param string $site_identifier_hash
         *
         * @return bool
         */
        public function reschedule($expiration_timestamp, $site_identifier_hash)
        {
        }
        /**
         * Hooked Action: Revokes access for a specific support user
         *
         * @since 1.0.0
         *
         * @param string $identifier_hash Identifier hash for the user associated with the cron job
         * @todo
         * @return void
         */
        public function revoke($identifier_hash)
        {
        }
    }
    final class SecurityChecks
    {
        /**
         * @var int The number of incorrect access keys that should trigger an anomaly alert.
         */
        const ACCESSKEY_LIMIT_COUNT = 3;
        /**
         * @var int The number of seconds we should keep incorrect access keys stored for.
         */
        const ACCESSKEY_LIMIT_EXPIRY = 36000;
        // 10 * MINUTE_IN_SECONDS;
        /**
         * @var int The number of seconds should block trustedlogin auto-logins for.
         */
        const LOCKDOWN_EXPIRY = 72000;
        // 20 * MINUTE_IN_SECONDS;
        /**
         * @var string TrustedLogin endpoint to notify brute-force activity
         */
        const BRUTE_FORCE_ENDPOINT = 'report-brute-force';
        /**
         * @var string TrustedLogin endpoint to verify valid support activity
         */
        const VERIFY_SUPPORT_AGENT_ENDPOINT = 'verify-identifier';
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        /**
         * Verifies that a provided user identifier is still valid.
         *
         * Multiple security checks are performed, including brute-force and known-attacker-list checks
         *
         * @param string $passed_user_identifier The identifier provided via {@see SupportUser::maybe_login()}
         *
         * @return true|WP_Error True if identifier passes checks. WP_Error if not.
         */
        public function verify($passed_user_identifier = '')
        {
        }
        /**
         * Checks if TrustedLogin is currently in lockdown
         *
         * @return int|false Int: in lockdown. The value returned is the timestamp when lockdown ends. False: not in lockdown, or overridden by a constant.
         */
        public function in_lockdown()
        {
        }
    }
    class Endpoint
    {
        /**
         * @var string The query string parameter used to revoke users
         */
        const REVOKE_SUPPORT_QUERY_PARAM = 'revoke-tl';
        /**
         * @var string Site option used to track whether permalinks have been flushed.
         */
        const PERMALINK_FLUSH_OPTION_NAME = 'tl_permalinks_flushed';
        /**
         * @var string Expected value of $_POST['action'] before adding the endpoint and starting a login flow.
         */
        const POST_ACTION_VALUE = 'trustedlogin';
        /** @var string The $_POST key in the TrustedLogin request related to the action being performed. */
        const POST_ACTION_KEY = 'action';
        /** @var string The $_POST key in the TrustedLogin request that contains the value of the expected endpoint. */
        const POST_ENDPOINT_KEY = 'endpoint';
        /** @var string The $_POST key in the TrustedLogin request related to the action being performed. */
        const POST_IDENTIFIER_KEY = 'identifier';
        /**
         * Logger constructor.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging)
        {
        }
        public function init()
        {
        }
        /**
         * Check if the endpoint is hit and has a valid identifier before automatically logging in support agent
         *
         * @since 1.0.0
         *
         * @return void
         */
        public function maybe_login_support()
        {
        }
        /**
         * Hooked Action to maybe revoke support if $_REQUEST[ SupportUser::ID_QUERY_PARAM ] == {namespace}
         * Can optionally check for $_REQUEST[ SupportUser::ID_QUERY_PARAM ] for revoking a specific user by their identifier
         *
         * @since 1.0.0
         */
        public function maybe_revoke_support()
        {
        }
        /**
         * Hooked Action: Add a unique endpoint to WP if a support agent exists
         *
         * @since 1.0.0
         * @see Endpoint::init() Called via `init` hook
         *
         */
        public function add()
        {
        }
        /**
         * Get the site option value at {@see option_name}
         *
         * @return string
         */
        public function get()
        {
        }
        /**
         * Generate the secret_id parameter as a hash of the endpoint with the identifier
         *
         * @param string $site_identifier_hash
         * @param string $endpoint_hash
         *
         * @return string|WP_Error This hash will be used as an identifier in TrustedLogin SaaS. Or something went wrong.
         */
        public function generate_secret_id($site_identifier_hash, $endpoint_hash = '')
        {
        }
        /**
         * Generate the endpoint parameter as a hash of the site URL with the identifier
         *
         * @param $site_identifier_hash
         *
         * @return string This hash will be used as the first part of the URL and also a part of $secret_id
         */
        public function get_hash($site_identifier_hash)
        {
        }
        /**
         * Updates the site's endpoint to listen for logins. Flushes rewrite rules after updating.
         *
         * @param string $endpoint
         *
         * @return bool True: updated; False: didn't change, or didn't update
         */
        public function update($endpoint)
        {
        }
        /**
         *
         * @return void
         */
        public function delete()
        {
        }
    }
    /**
     * Creates the TrustedLogin support user form.
     *  - Makes the HTML
     *  - Manages assets
     * Does not
     *  - Handle the form submission. {@see ./Ajax.php }
     *  - Setup the menu {@see ./Admin.php}
     *
     * @since 1.5.0
     */
    final class Form
    {
        /**
         * URL pointing to the "About TrustedLogin" page, shown below the Grant Access dialog
         */
        const ABOUT_TL_URL = 'https://www.trustedlogin.com/about/easy-and-safe/';
        const ABOUT_LIVE_ACCESS_URL = 'https://www.trustedlogin.com/about/live-access/';
        /**
         * Admin constructor.
         *
         * @param Config $config
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Logging $logging, \ContentControl\Vendor\TrustedLogin\SupportUser $support_user, \ContentControl\Vendor\TrustedLogin\SiteAccess $site_access)
        {
        }
        /**
         * Register the required scripts and styles
         *
         * @since 1.0.0
         */
        public function register_assets()
        {
        }
        /**
         * If the current request is a valid login screen override, print the TrustedLogin request screen.
         *
         * @return void
         */
        public function maybe_print_request_screen()
        {
        }
        public function print_request_screen()
        {
        }
        /**
         * Outputs the TrustedLogin authorization screen
         *
         * @since 1.0.0
         *
         * @return void
         */
        public function print_auth_screen()
        {
        }
        public function get_auth_header_html()
        {
        }
        /**
         * Output the contents of the Auth Link Page in wp-admin
         *
         * @since 1.0.0
         *
         * @return string HTML of the Auth screen
         */
        public function get_auth_screen()
        {
        }
        /**
         * Output the TrustedLogin Button and required scripts
         *
         * @since 1.0.0
         *
         * @param array $atts {@see get_button()} for configuration array
         * @param bool $print Should results be printed and returned (true) or only returned (false)
         *
         * @return string the HTML output
         */
        public function generate_button($atts = array(), $print = true)
        {
        }
        /**
         * Generates HTML for a TrustedLogin Grant Access button
         *
         * @param array $atts {
         *
         * @type string $text Button text to grant access. Sanitized using esc_html(). Default: "Grant %s Access"
         *                      (%s replaced with vendor/title setting)
         * @type string $exists_text Button text when vendor already has a support account. Sanitized using esc_html().
         *                      Default: "Extend %s Access" (%s replaced with vendor/title setting)
         * @type string $size WordPress CSS button size. Options: 'small', 'normal', 'large', 'hero'. Default: "hero"
         * @type string $class CSS class added to the button. Default: "button-primary"
         * @type string $tag Tag used to display the button. Options: 'a', 'button', 'span'. Default: "a"
         * @type bool $powered_by Whether to display the TrustedLogin badge on the button. Default: true
         * @type string $support_url The URL to use as a backup if JavaScript fails or isn't available. Sanitized using
         *                      esc_url(). Default: `vendor/support_url` configuration setting URL.
         * }
         *
         * @return string
         */
        public function get_button($atts = array())
        {
        }
        /**
         * Helper function: Build translate-able strings for alert messages
         *
         * @since 1.0.0
         *
         * @return array of Translations and strings to be localized to JS variables
         */
        public function translations()
        {
        }
        /**
         * Outputs table of created support users
         *
         * @since 1.0.0
         *
         * @param bool $print Whether to print and return (true) or return (false) the results. Default: true
         * @param array $atts Settings for the table. {
         *
         * @type bool $current_url Whether to generate Revoke links based on the current URL. Default: false.
         * }
         *
         * @return string HTML table of active support users for vendor. Empty string if current user can't `create_users`
         */
        public function output_support_users($print = true, $atts = array())
        {
        }
        /**
         * Notice: Shown when a support user is manually revoked by admin;
         *
         * @return void
         */
        public function admin_notice_revoked()
        {
        }
    }
    final class Admin
    {
        /**
         * URL pointing to the "About TrustedLogin" page, shown below the Grant Access dialog
         */
        const ABOUT_TL_URL = 'https://www.trustedlogin.com/about/easy-and-safe/';
        const ABOUT_LIVE_ACCESS_URL = 'https://www.trustedlogin.com/about/live-access/';
        /**
         * Admin constructor.
         *
         * @param Config $config
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, \ContentControl\Vendor\TrustedLogin\Form $form, \ContentControl\Vendor\TrustedLogin\SupportUser $support_user)
        {
        }
        public function init()
        {
        }
        /**
         * Filter: Update the actions on the users.php list for our support users.
         *
         * @since 1.0.0
         *
         * @param array $actions
         * @param WP_User $user_object
         *
         * @return array
         */
        public function user_row_action_revoke($actions, $user_object)
        {
        }
        /**
         * Adds a "Revoke TrustedLogin" menu item to the admin toolbar
         *
         * @param WP_Admin_Bar $admin_bar
         *
         * @return void
         */
        public function admin_bar_add_toolbar_items($admin_bar)
        {
        }
        /**
         * Generates the auth link page
         *
         * This simulates the addition of an admin submenu item with null as the menu location
         *
         * @since 1.0.0
         *
         * @return void
         */
        public function admin_menu_auth_link_page()
        {
        }
        /**
         * Add admin_notices hooks
         *
         * @return void
         */
        public function admin_notices()
        {
        }
    }
    class Logging
    {
        /**
         * Path to logging directory (inside the WP Uploads base dir)
         */
        const DIRECTORY_PATH = 'trustedlogin-logs/';
        /**
         * Logger constructor.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config)
        {
        }
        /**
         * Returns the full path to the log file
         *
         * @since 1.5.0
         *
         * @return null|string Path to log file, if exists; null if not instantiated.
         */
        public function get_log_file_path()
        {
        }
        /**
         * Returns whether logging is enabled
         *
         * @return bool
         */
        public function is_enabled()
        {
        }
        /**
         * @see https://github.com/php-fig/log/blob/master/Psr/Log/LogLevel.php for log levels
         *
         * @param string|\WP_Error $message Message or error to log. If a WP_Error is passed, $data is ignored.
         * @param string $method Method where the log was called
         * @param string $level PSR-3 log level
         * @param \WP_Error|\Exception|mixed $data Optional. Error data. Ignored if $message is WP_Error.
         *
         */
        public function log($message = '', $method = '', $level = 'debug', $data = array())
        {
        }
    }
    /**
     * The TrustedLogin all-in-one drop-in class.
     */
    final class Client
    {
        /**
         * @var string The current SDK version.
         * @since 1.0.0
         */
        const VERSION = '1.6.1';
        /**
         * @var bool
         */
        static $valid_config;
        /**
         * TrustedLogin constructor.
         *
         * @see https://docs.trustedlogin.com/ for more information
         *
         * @param Config $config
         * @param bool $init Whether to initialize everything on instantiation
         *
         * @throws Exception If initializing is prevented via constants or the configuration isn't valid, throws exception.
         *
         * @returns void If no errors, returns void. Otherwise, throws exceptions.
         */
        public function __construct(\ContentControl\Vendor\TrustedLogin\Config $config, $init = true)
        {
        }
        /**
         * Initialize all the things!
         *
         */
        public function init()
        {
        }
        /**
         * Returns the current access key (hashed license key or generated access key
         *
         * @see SiteAccess::get_access_key()
         *
         * @return string|null|WP_Error
         */
        public function get_access_key()
        {
        }
        /**
         * This creates a TrustedLogin user ✨
         *
         * @since 1.5.0 Added $ticket_data parameter.
         *
         * @param bool $include_debug_data Whether to include debug data in the response.
         * @param array|null $ticket_data If provided, customer-provided data associated with the access request.
         *
         * @return array|WP_Error
         */
        public function grant_access($include_debug_data = false, $ticket_data = null)
        {
        }
        /**
         * Revoke access to a site
         *
         * @param string $identifier Unique ID or "all"
         *
         * @return bool|WP_Error True: Synced to SaaS and user(s) deleted. False: empty identifier. WP_Error: failed to revoke site in SaaS or failed to delete user.
         */
        public function revoke_access($identifier = '')
        {
        }
        /**
         * Adds PLAINTEXT metadata to the envelope, including reference ID.
         *
         * @since 1.0.0
         *
         * @param array $metadata
         *
         * @return array Array of metadata that will be sent with the Envelope.
         */
        public function add_meta_to_envelope($metadata = array())
        {
        }
        /**
         * Gets the reference ID passed to the $_REQUEST using `reference_id` or `ref` keys.
         *
         * @since 1.0.0
         *
         * @return string|null Sanitized reference ID (escaped with esc_html) if exists. NULL if not.
         */
        public static function get_reference_id()
        {
        }
    }
}
namespace Composer\Autoload {
    class ComposerStaticInit587424cd8cb0e184e70e99f475bf660b
    {
        public static $prefixLengthsPsr4 = array('C' => array('ContentControl\\' => 15, 'Composer\\Installers\\' => 20));
        public static $prefixDirsPsr4 = array('ContentControl\\' => array(0 => __DIR__ . '/../..' . '/classes'), 'Composer\\Installers\\' => array(0 => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers'));
        public static $classMap = array('Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php', 'Composer\\Installers\\AglInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/AglInstaller.php', 'Composer\\Installers\\AkauntingInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/AkauntingInstaller.php', 'Composer\\Installers\\AnnotateCmsInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/AnnotateCmsInstaller.php', 'Composer\\Installers\\AsgardInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/AsgardInstaller.php', 'Composer\\Installers\\AttogramInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/AttogramInstaller.php', 'Composer\\Installers\\BaseInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/BaseInstaller.php', 'Composer\\Installers\\BitrixInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/BitrixInstaller.php', 'Composer\\Installers\\BonefishInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/BonefishInstaller.php', 'Composer\\Installers\\CakePHPInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/CakePHPInstaller.php', 'Composer\\Installers\\ChefInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ChefInstaller.php', 'Composer\\Installers\\CiviCrmInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/CiviCrmInstaller.php', 'Composer\\Installers\\ClanCatsFrameworkInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ClanCatsFrameworkInstaller.php', 'Composer\\Installers\\CockpitInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/CockpitInstaller.php', 'Composer\\Installers\\CodeIgniterInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/CodeIgniterInstaller.php', 'Composer\\Installers\\Concrete5Installer' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/Concrete5Installer.php', 'Composer\\Installers\\CroogoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/CroogoInstaller.php', 'Composer\\Installers\\DecibelInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/DecibelInstaller.php', 'Composer\\Installers\\DframeInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/DframeInstaller.php', 'Composer\\Installers\\DokuWikiInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/DokuWikiInstaller.php', 'Composer\\Installers\\DolibarrInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/DolibarrInstaller.php', 'Composer\\Installers\\DrupalInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/DrupalInstaller.php', 'Composer\\Installers\\ElggInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ElggInstaller.php', 'Composer\\Installers\\EliasisInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/EliasisInstaller.php', 'Composer\\Installers\\ExpressionEngineInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ExpressionEngineInstaller.php', 'Composer\\Installers\\EzPlatformInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/EzPlatformInstaller.php', 'Composer\\Installers\\FuelInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/FuelInstaller.php', 'Composer\\Installers\\FuelphpInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/FuelphpInstaller.php', 'Composer\\Installers\\GravInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/GravInstaller.php', 'Composer\\Installers\\HuradInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/HuradInstaller.php', 'Composer\\Installers\\ImageCMSInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ImageCMSInstaller.php', 'Composer\\Installers\\Installer' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/Installer.php', 'Composer\\Installers\\ItopInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ItopInstaller.php', 'Composer\\Installers\\KanboardInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/KanboardInstaller.php', 'Composer\\Installers\\KnownInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/KnownInstaller.php', 'Composer\\Installers\\KodiCMSInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/KodiCMSInstaller.php', 'Composer\\Installers\\KohanaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/KohanaInstaller.php', 'Composer\\Installers\\LanManagementSystemInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/LanManagementSystemInstaller.php', 'Composer\\Installers\\LaravelInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/LaravelInstaller.php', 'Composer\\Installers\\LavaLiteInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/LavaLiteInstaller.php', 'Composer\\Installers\\LithiumInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/LithiumInstaller.php', 'Composer\\Installers\\MODULEWorkInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MODULEWorkInstaller.php', 'Composer\\Installers\\MODXEvoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MODXEvoInstaller.php', 'Composer\\Installers\\MagentoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MagentoInstaller.php', 'Composer\\Installers\\MajimaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MajimaInstaller.php', 'Composer\\Installers\\MakoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MakoInstaller.php', 'Composer\\Installers\\MantisBTInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MantisBTInstaller.php', 'Composer\\Installers\\MatomoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MatomoInstaller.php', 'Composer\\Installers\\MauticInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MauticInstaller.php', 'Composer\\Installers\\MayaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MayaInstaller.php', 'Composer\\Installers\\MediaWikiInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MediaWikiInstaller.php', 'Composer\\Installers\\MiaoxingInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MiaoxingInstaller.php', 'Composer\\Installers\\MicroweberInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MicroweberInstaller.php', 'Composer\\Installers\\ModxInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ModxInstaller.php', 'Composer\\Installers\\MoodleInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/MoodleInstaller.php', 'Composer\\Installers\\OctoberInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/OctoberInstaller.php', 'Composer\\Installers\\OntoWikiInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/OntoWikiInstaller.php', 'Composer\\Installers\\OsclassInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/OsclassInstaller.php', 'Composer\\Installers\\OxidInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/OxidInstaller.php', 'Composer\\Installers\\PPIInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PPIInstaller.php', 'Composer\\Installers\\PantheonInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PantheonInstaller.php', 'Composer\\Installers\\PhiftyInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PhiftyInstaller.php', 'Composer\\Installers\\PhpBBInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PhpBBInstaller.php', 'Composer\\Installers\\PiwikInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PiwikInstaller.php', 'Composer\\Installers\\PlentymarketsInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PlentymarketsInstaller.php', 'Composer\\Installers\\Plugin' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/Plugin.php', 'Composer\\Installers\\PortoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PortoInstaller.php', 'Composer\\Installers\\PrestashopInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PrestashopInstaller.php', 'Composer\\Installers\\ProcessWireInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ProcessWireInstaller.php', 'Composer\\Installers\\PuppetInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PuppetInstaller.php', 'Composer\\Installers\\PxcmsInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/PxcmsInstaller.php', 'Composer\\Installers\\RadPHPInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/RadPHPInstaller.php', 'Composer\\Installers\\ReIndexInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ReIndexInstaller.php', 'Composer\\Installers\\Redaxo5Installer' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/Redaxo5Installer.php', 'Composer\\Installers\\RedaxoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/RedaxoInstaller.php', 'Composer\\Installers\\RoundcubeInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/RoundcubeInstaller.php', 'Composer\\Installers\\SMFInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/SMFInstaller.php', 'Composer\\Installers\\ShopwareInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ShopwareInstaller.php', 'Composer\\Installers\\SilverStripeInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/SilverStripeInstaller.php', 'Composer\\Installers\\SiteDirectInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/SiteDirectInstaller.php', 'Composer\\Installers\\StarbugInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/StarbugInstaller.php', 'Composer\\Installers\\SyDESInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/SyDESInstaller.php', 'Composer\\Installers\\SyliusInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/SyliusInstaller.php', 'Composer\\Installers\\TaoInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/TaoInstaller.php', 'Composer\\Installers\\TastyIgniterInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/TastyIgniterInstaller.php', 'Composer\\Installers\\TheliaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/TheliaInstaller.php', 'Composer\\Installers\\TuskInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/TuskInstaller.php', 'Composer\\Installers\\UserFrostingInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/UserFrostingInstaller.php', 'Composer\\Installers\\VanillaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/VanillaInstaller.php', 'Composer\\Installers\\VgmcpInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/VgmcpInstaller.php', 'Composer\\Installers\\WHMCSInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/WHMCSInstaller.php', 'Composer\\Installers\\WinterInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/WinterInstaller.php', 'Composer\\Installers\\WolfCMSInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/WolfCMSInstaller.php', 'Composer\\Installers\\WordPressInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/WordPressInstaller.php', 'Composer\\Installers\\YawikInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/YawikInstaller.php', 'Composer\\Installers\\ZendInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ZendInstaller.php', 'Composer\\Installers\\ZikulaInstaller' => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers/ZikulaInstaller.php', 'ContentControl\\Base\\Container' => __DIR__ . '/../..' . '/classes/Base/Container.php', 'ContentControl\\Base\\Controller' => __DIR__ . '/../..' . '/classes/Base/Controller.php', 'ContentControl\\Base\\Stream' => __DIR__ . '/../..' . '/classes/Base/Stream.php', 'ContentControl\\Base\\Upgrade' => __DIR__ . '/../..' . '/classes/Base/Upgrade.php', 'ContentControl\\Controllers\\Admin' => __DIR__ . '/../..' . '/classes/Controllers/Admin.php', 'ContentControl\\Controllers\\Admin\\Reviews' => __DIR__ . '/../..' . '/classes/Controllers/Admin/Reviews.php', 'ContentControl\\Controllers\\Admin\\SettingsPage' => __DIR__ . '/../..' . '/classes/Controllers/Admin/SettingsPage.php', 'ContentControl\\Controllers\\Admin\\Upgrades' => __DIR__ . '/../..' . '/classes/Controllers/Admin/Upgrades.php', 'ContentControl\\Controllers\\Admin\\UserExperience' => __DIR__ . '/../..' . '/classes/Controllers/Admin/UserExperience.php', 'ContentControl\\Controllers\\Admin\\WidgetEditor' => __DIR__ . '/../..' . '/classes/Controllers/Admin/WidgetEditor.php', 'ContentControl\\Controllers\\Assets' => __DIR__ . '/../..' . '/classes/Controllers/Assets.php', 'ContentControl\\Controllers\\BlockEditor' => __DIR__ . '/../..' . '/classes/Controllers/BlockEditor.php', 'ContentControl\\Controllers\\Compatibility' => __DIR__ . '/../..' . '/classes/Controllers/Compatibility.php', 'ContentControl\\Controllers\\Compatibility\\Divi' => __DIR__ . '/../..' . '/classes/Controllers/Compatibility/Divi.php', 'ContentControl\\Controllers\\Compatibility\\Elementor' => __DIR__ . '/../..' . '/classes/Controllers/Compatibility/Elementor.php', 'ContentControl\\Controllers\\Compatibility\\QueryMonitor' => __DIR__ . '/../..' . '/classes/Controllers/Compatibility/QueryMonitor.php', 'ContentControl\\Controllers\\Frontend' => __DIR__ . '/../..' . '/classes/Controllers/Frontend.php', 'ContentControl\\Controllers\\Frontend\\Blocks' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Blocks.php', 'ContentControl\\Controllers\\Frontend\\Restrictions' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Restrictions.php', 'ContentControl\\Controllers\\Frontend\\Restrictions\\MainQuery' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Restrictions/MainQuery.php', 'ContentControl\\Controllers\\Frontend\\Restrictions\\PostContent' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Restrictions/PostContent.php', 'ContentControl\\Controllers\\Frontend\\Restrictions\\QueryPosts' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Restrictions/QueryPosts.php', 'ContentControl\\Controllers\\Frontend\\Widgets' => __DIR__ . '/../..' . '/classes/Controllers/Frontend/Widgets.php', 'ContentControl\\Controllers\\PostTypes' => __DIR__ . '/../..' . '/classes/Controllers/PostTypes.php', 'ContentControl\\Controllers\\RestAPI' => __DIR__ . '/../..' . '/classes/Controllers/RestAPI.php', 'ContentControl\\Controllers\\Shortcodes' => __DIR__ . '/../..' . '/classes/Controllers/Shortcodes.php', 'ContentControl\\Controllers\\TrustedLogin' => __DIR__ . '/../..' . '/classes/Controllers/TrustedLogin.php', 'ContentControl\\Installers\\Install_Skin' => __DIR__ . '/../..' . '/classes/Installers/Install_Skin.php', 'ContentControl\\Installers\\PluginSilentUpgrader' => __DIR__ . '/../..' . '/classes/Installers/PluginSilentUpgrader.php', 'ContentControl\\Installers\\PluginSilentUpgraderSkin' => __DIR__ . '/../..' . '/classes/Installers/PluginSilentUpgraderSkin.php', 'ContentControl\\Interfaces\\Controller' => __DIR__ . '/../..' . '/classes/Interfaces/Controller.php', 'ContentControl\\Interfaces\\Upgrade' => __DIR__ . '/../..' . '/classes/Interfaces/Upgrade.php', 'ContentControl\\Models\\Restriction' => __DIR__ . '/../..' . '/classes/Models/Restriction.php', 'ContentControl\\Models\\RuleEngine\\Group' => __DIR__ . '/../..' . '/classes/Models/RuleEngine/Group.php', 'ContentControl\\Models\\RuleEngine\\Item' => __DIR__ . '/../..' . '/classes/Models/RuleEngine/Item.php', 'ContentControl\\Models\\RuleEngine\\Query' => __DIR__ . '/../..' . '/classes/Models/RuleEngine/Query.php', 'ContentControl\\Models\\RuleEngine\\Rule' => __DIR__ . '/../..' . '/classes/Models/RuleEngine/Rule.php', 'ContentControl\\Models\\RuleEngine\\Set' => __DIR__ . '/../..' . '/classes/Models/RuleEngine/Set.php', 'ContentControl\\Plugin\\Autoloader' => __DIR__ . '/../..' . '/classes/Plugin/Autoloader.php', 'ContentControl\\Plugin\\Connect' => __DIR__ . '/../..' . '/classes/Plugin/Connect.php', 'ContentControl\\Plugin\\Core' => __DIR__ . '/../..' . '/classes/Plugin/Core.php', 'ContentControl\\Plugin\\Install' => __DIR__ . '/../..' . '/classes/Plugin/Install.php', 'ContentControl\\Plugin\\License' => __DIR__ . '/../..' . '/classes/Plugin/License.php', 'ContentControl\\Plugin\\Logging' => __DIR__ . '/../..' . '/classes/Plugin/Logging.php', 'ContentControl\\Plugin\\Options' => __DIR__ . '/../..' . '/classes/Plugin/Options.php', 'ContentControl\\Plugin\\Prerequisites' => __DIR__ . '/../..' . '/classes/Plugin/Prerequisites.php', 'ContentControl\\Plugin\\Upgrader' => __DIR__ . '/../..' . '/classes/Plugin/Upgrader.php', 'ContentControl\\QueryMonitor\\Collector' => __DIR__ . '/../..' . '/classes/QueryMonitor/Collector.php', 'ContentControl\\QueryMonitor\\Data' => __DIR__ . '/../..' . '/classes/QueryMonitor/Data.php', 'ContentControl\\QueryMonitor\\Output' => __DIR__ . '/../..' . '/classes/QueryMonitor/Output.php', 'ContentControl\\RestAPI\\BlockTypes' => __DIR__ . '/../..' . '/classes/RestAPI/BlockTypes.php', 'ContentControl\\RestAPI\\License' => __DIR__ . '/../..' . '/classes/RestAPI/License.php', 'ContentControl\\RestAPI\\ObjectSearch' => __DIR__ . '/../..' . '/classes/RestAPI/ObjectSearch.php', 'ContentControl\\RestAPI\\Settings' => __DIR__ . '/../..' . '/classes/RestAPI/Settings.php', 'ContentControl\\RuleEngine\\Handler' => __DIR__ . '/../..' . '/classes/RuleEngine/Handler.php', 'ContentControl\\RuleEngine\\Rules' => __DIR__ . '/../..' . '/classes/RuleEngine/Rules.php', 'ContentControl\\Services\\Restrictions' => __DIR__ . '/../..' . '/classes/Services/Restrictions.php', 'ContentControl\\Services\\UpgradeStream' => __DIR__ . '/../..' . '/classes/Services/UpgradeStream.php', 'ContentControl\\Upgrades\\Backup' => __DIR__ . '/../..' . '/classes/Upgrades/Backup.php', 'ContentControl\\Upgrades\\Backup_2' => __DIR__ . '/../..' . '/classes/Upgrades/Backup_2.php', 'ContentControl\\Upgrades\\PluginMeta_2' => __DIR__ . '/../..' . '/classes/Upgrades/PluginMeta_2.php', 'ContentControl\\Upgrades\\Restrictions_2' => __DIR__ . '/../..' . '/classes/Upgrades/Restrictions_2.php', 'ContentControl\\Upgrades\\Settings_2' => __DIR__ . '/../..' . '/classes/Upgrades/Settings_2.php', 'ContentControl\\Upgrades\\UserMeta_2' => __DIR__ . '/../..' . '/classes/Upgrades/UserMeta_2.php', 'ContentControl\\Vendor\\Pimple\\Container' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Container.php', 'ContentControl\\Vendor\\Pimple\\Exception\\ExpectedInvokableException' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Exception/ExpectedInvokableException.php', 'ContentControl\\Vendor\\Pimple\\Exception\\FrozenServiceException' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Exception/FrozenServiceException.php', 'ContentControl\\Vendor\\Pimple\\Exception\\InvalidServiceIdentifierException' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Exception/InvalidServiceIdentifierException.php', 'ContentControl\\Vendor\\Pimple\\Exception\\UnknownIdentifierException' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Exception/UnknownIdentifierException.php', 'ContentControl\\Vendor\\Pimple\\Psr11\\Container' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Psr11/Container.php', 'ContentControl\\Vendor\\Pimple\\Psr11\\ServiceLocator' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Psr11/ServiceLocator.php', 'ContentControl\\Vendor\\Pimple\\ServiceIterator' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/ServiceIterator.php', 'ContentControl\\Vendor\\Pimple\\ServiceProviderInterface' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/ServiceProviderInterface.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Fixtures\\Invokable' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Fixtures/Invokable.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Fixtures\\NonInvokable' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Fixtures/NonInvokable.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Fixtures\\PimpleServiceProvider' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Fixtures/PimpleServiceProvider.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Fixtures\\Service' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Fixtures/Service.php', 'ContentControl\\Vendor\\Pimple\\Tests\\PimpleServiceProviderInterfaceTest' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/PimpleServiceProviderInterfaceTest.php', 'ContentControl\\Vendor\\Pimple\\Tests\\PimpleTest' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/PimpleTest.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Psr11\\ContainerTest' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Psr11/ContainerTest.php', 'ContentControl\\Vendor\\Pimple\\Tests\\Psr11\\ServiceLocatorTest' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/Psr11/ServiceLocatorTest.php', 'ContentControl\\Vendor\\Pimple\\Tests\\ServiceIteratorTest' => __DIR__ . '/../..' . '/vendor-prefixed/pimple/pimple/src/Pimple/Tests/ServiceIteratorTest.php', 'ContentControl\\Vendor\\Psr\\Container\\ContainerExceptionInterface' => __DIR__ . '/../..' . '/vendor-prefixed/psr/container/src/ContainerExceptionInterface.php', 'ContentControl\\Vendor\\Psr\\Container\\ContainerInterface' => __DIR__ . '/../..' . '/vendor-prefixed/psr/container/src/ContainerInterface.php', 'ContentControl\\Vendor\\Psr\\Container\\NotFoundExceptionInterface' => __DIR__ . '/../..' . '/vendor-prefixed/psr/container/src/NotFoundExceptionInterface.php', 'ContentControl\\Vendor\\TrustedLogin\\Admin' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Admin.php', 'ContentControl\\Vendor\\TrustedLogin\\Ajax' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Ajax.php', 'ContentControl\\Vendor\\TrustedLogin\\Client' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Client.php', 'ContentControl\\Vendor\\TrustedLogin\\Config' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Config.php', 'ContentControl\\Vendor\\TrustedLogin\\Cron' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Cron.php', 'ContentControl\\Vendor\\TrustedLogin\\Encryption' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Encryption.php', 'ContentControl\\Vendor\\TrustedLogin\\Endpoint' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Endpoint.php', 'ContentControl\\Vendor\\TrustedLogin\\Envelope' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Envelope.php', 'ContentControl\\Vendor\\TrustedLogin\\Form' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Form.php', 'ContentControl\\Vendor\\TrustedLogin\\Logger' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Logger.php', 'ContentControl\\Vendor\\TrustedLogin\\Logging' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Logging.php', 'ContentControl\\Vendor\\TrustedLogin\\Remote' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/Remote.php', 'ContentControl\\Vendor\\TrustedLogin\\SecurityChecks' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/SecurityChecks.php', 'ContentControl\\Vendor\\TrustedLogin\\SiteAccess' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/SiteAccess.php', 'ContentControl\\Vendor\\TrustedLogin\\SupportRole' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/SupportRole.php', 'ContentControl\\Vendor\\TrustedLogin\\SupportUser' => __DIR__ . '/../..' . '/vendor-prefixed/trustedlogin/client/src/SupportUser.php');
        public static function getInitializer(\Composer\Autoload\ClassLoader $loader)
        {
        }
    }
}
namespace {
    // autoload_real.php @generated by Composer
    class ComposerAutoloaderInit587424cd8cb0e184e70e99f475bf660b
    {
        public static function loadClassLoader($class)
        {
        }
        /**
         * @return \Composer\Autoload\ClassLoader
         */
        public static function getLoader()
        {
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
    function get_options($widget_id)
    {
    }
    /**
     * Checks for & adds missing widget options to prevent errors or missing data.
     *
     * @param array<string,mixed> $options Widget options.
     *
     * @return array<string,mixed>
     */
    function parse_options($options = [])
    {
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
     * @param int|null $post_id Post ID.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_has_restrictions($post_id = null)
    {
    }
    /**
     * Check if user can access content.
     *
     * @param int|null $post_id Post ID.
     *
     * @return bool True if user meets requirements, false if not.
     *
     * @since 2.0.0
     */
    function user_can_view_content($post_id = null)
    {
    }
    /**
     * Helper that checks if given or current post is restricted or not.
     *
     * @see \ContentControl\user_can_view_content() to check if user can view content.
     *
     * @param int|null $post_id Post ID.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_restricted($post_id = null)
    {
    }
    /**
     * Get applicable restriction.
     *
     * @param int|null $post_id Post ID.
     *
     * @return \ContentControl\Models\Restriction|false
     *
     * @since 2.0.0
     */
    function get_applicable_restriction($post_id = null)
    {
    }
    /**
     * Get all applicable restrictions.
     *
     * @param int|null $post_id Post ID.
     *
     * @return \ContentControl\Models\Restriction[]
     *
     * @since 2.0.11
     */
    function get_all_applicable_restrictions($post_id = null)
    {
    }
    /**
     * Check if query has restrictions.
     *
     * @param \WP_Query $query Query object.
     *
     * @return array<array{restriction:\ContentControl\Models\Restriction,post_ids:int[]}>|false
     *
     * @since 2.0.0
     */
    function get_restriction_matches_for_queried_posts($query)
    {
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
    function protection_is_disabled()
    {
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
    function current_rule($rule = false)
    {
    }
    /**
     * Get the current rule ID.
     *
     * @return string
     */
    function get_rule_id()
    {
    }
    /**
     * Get the current rule name.
     *
     * @return string
     */
    function get_rule_name()
    {
    }
    /**
     * Get the current rule options.
     *
     * @param array<string,mixed> $defaults Default options.
     *
     * @return array<string,mixed>
     */
    function get_rule_options($defaults = [])
    {
    }
    /**
     * Get the current rule extras.
     *
     * @return array<string,mixed>
     */
    function get_rule_extras()
    {
    }
    /**
     * Get the current rule option.
     *
     * @param string $key Option key.
     * @param mixed  $default_value Default value.
     * @return mixed
     */
    function get_rule_option($key, $default_value = false)
    {
    }
    /**
     * Get the current rule extra.
     *
     * @param string $key Extra key.
     * @param mixed  $default_value Default value.
     * @return mixed
     */
    function get_rule_extra($key, $default_value = false)
    {
    }
    /**
     * Gets a filterable array of the allowed user roles.
     *
     * @return array|mixed
     */
    function allowed_user_roles()
    {
    }
    /**
     * Checks if the current post is a post type.
     *
     * @param string $post_type Post type slug.
     * @return boolean
     */
    function is_post_type($post_type)
    {
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
    function get_default_permissions()
    {
    }
    /**
     * Get the default media queries.
     *
     * @return array<string,array{override:bool,breakpoint:int}> Array of media queries.
     */
    function get_default_media_queries()
    {
    }
    /**
     * Returns an array of the default settings.
     *
     * @return array<string,mixed> Default settings.
     */
    function get_default_settings()
    {
    }
    /**
     * Get default restriction settings.
     *
     * @return array<string,mixed> Default restriction settings.
     */
    function get_default_restriction_settings()
    {
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
    function redirect($type = 'login', $url = null)
    {
    }
    /**
     * Set the query to the page with the specified ID.
     *
     * @param int       $page_id Page ID.
     * @param \WP_Query $query   Query object.
     * @return void
     */
    function set_query_to_page($page_id, $query = null)
    {
    }
}
/**
 * Rule callback functions.
 *
 * @package ContentControl
 */
namespace ContentControl\Rules {
    /**
     * Checks if a user has one of the selected roles.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function user_has_role()
    {
    }
    /**
     * Check if this is the home page.
     *
     * @uses current_query_context() To get the current query context.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_home_page()
    {
    }
    /**
     * Check if this is the home page.
     *
     * @uses current_query_context() To get the current query context.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_blog_index()
    {
    }
    /**
     * Check if this is an archive for a specific post type.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_post_type_archive()
    {
    }
    /**
     * Check if this is a single post for a specific post type.
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_post_type()
    {
    }
    /**
     * Check if content is a selected post(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_selected_post()
    {
    }
    /**
     * Check if the current post is a child of a selected post(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_child_of_post()
    {
    }
    /**
     * Check if the current post is a ancestor of a selected post(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_ancestor_of_post()
    {
    }
    /**
     * Check if current post uses selected template(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_post_with_template()
    {
    }
    /**
     * Check if current post has selected taxonomy term(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_post_with_tax_term()
    {
    }
    /**
     * Check if current content is a selected taxonomy(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_taxonomy_archive()
    {
    }
    /**
     * Check if current content is a selected taxonomy term(s).
     *
     * @return bool
     *
     * @since 2.0.0
     */
    function content_is_selected_term()
    {
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
    function current_data_versions()
    {
    }
    /**
     * Get all data versions.
     *
     * @return int[]
     */
    function get_data_versions()
    {
    }
    /**
     * Set the data version.
     *
     * @param string $key    Data key.
     * @param int    $version Data version.
     *
     * @return bool
     */
    function set_data_version($key, $version)
    {
    }
    /**
     * Set the data version.
     *
     * @param int[] $versioning Data versions.
     *
     * @return bool
     */
    function set_data_versions($versioning)
    {
    }
    /**
     * Get the current data version.
     *
     * @param string $key Type of data to get version for.
     *
     * @return int|bool
     */
    function get_data_version($key)
    {
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
    function maybe_force_v2_migrations($old_version)
    {
    }
    /**
     * Get the name of an upgrade.
     *
     * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to get name for.
     *
     * @return string
     */
    function get_upgrade_name($upgrade)
    {
    }
    /**
     * Get the completed upgrades.
     *
     * @return string[]
     */
    function get_completed_upgrades()
    {
    }
    /**
     * Set the completed upgrades.
     *
     * @param string[] $upgrades Completed upgrades.
     *
     * @return bool
     */
    function set_completed_upgrades($upgrades)
    {
    }
    /**
     * Mark an upgrade as complete.
     *
     * @param \ContentControl\Base\Upgrade $upgrade Upgrade to mark as complete.
     *
     * @return void
     */
    function mark_upgrade_complete($upgrade)
    {
    }
    /**
     * Check if an upgrade has been completed.
     *
     * @param string|\ContentControl\Base\Upgrade $upgrade Upgrade to check.
     *
     * @return bool
     */
    function is_upgrade_complete($upgrade)
    {
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
    function get_excerpt_by_id($post_id = null)
    {
    }
    /**
     * Filter feed post content when needed.
     *
     * @param string                             $content Content to display.
     * @param \ContentControl\Models\Restriction $restriction Restriction object.
     *
     * @return string
     */
    function append_post_excerpts($content, $restriction)
    {
    }
    /**
     * Apply content filters for the_content without our own again.
     *
     * @param string $content Content to display.
     *
     * @return string
     */
    function the_content_filters($content)
    {
    }
    /**
     * Apply get_the_excerpt fitlers without our own again.
     *
     * @param string $excerpt Excerpt to display.
     *
     * @return string
     */
    function the_excerpt_filters($excerpt)
    {
    }
    /**
     * Get the current page URL.
     *
     * @return string
     */
    function get_current_page_url()
    {
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
    function get_all_plugin_options()
    {
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
    function get_plugin_option($key, $default_value = false)
    {
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
    function update_plugin_option($key = '', $value = false)
    {
    }
    /**
     * Update many values at once.
     *
     * @param array<string,mixed> $new_options Array of new replacement options.
     *
     * @return bool
     */
    function update_plugin_options($new_options = [])
    {
    }
    /**
     * Remove an option
     *
     * @param string|string[] $keys Can be a single string  or array of option keys.
     *
     * @return boolean True if updated, false if not.
     */
    function delete_plugin_options($keys = '')
    {
    }
    /**
     * Get index of blockTypes.
     *
     * @return array<array{name:string,category:string,description:string,keywords:string[],title:string}>
     */
    function get_block_types()
    {
    }
    /**
     * Sanitize expetced block type data.
     *
     * @param array<string,string|string[]> $type Block type definition.
     * @return array<string,mixed> Sanitized definition.
     */
    function sanitize_block_type($type = [])
    {
    }
    /**
     * Update block type list.
     *
     * @param array<array{name:string,category:string,description:string,keywords:string[],title:string}> $incoming_block_types Array of updated block type declarations.
     *
     * @return void
     */
    function update_block_types($incoming_block_types = [])
    {
    }
    /**
     * Get default denial message.
     *
     * @return string
     */
    function get_default_denial_message()
    {
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
    function get_main_wp_query()
    {
    }
    /**
     * Get the current wp query.
     *
     * Helper that returns the current query object, reguardless of if
     * it's the main query or not.
     *
     * @return \WP_Query|null
     */
    function get_current_wp_query()
    {
    }
    /**
     * Get the current query.
     *
     * @param \WP_Query|null $query Query object.
     *
     * @return \WP_Query|null
     */
    function get_query($query = null)
    {
    }
    /**
     * Set the current query context.
     *
     * @param string $context 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`.
     *
     * @return void
     */
    function override_query_context($context)
    {
    }
    /**
     * Reset the current query context.
     *
     * @return void
     */
    function reset_query_context()
    {
    }
    /**
     * Get or set the current rule (globaly accessible).
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
     * @param \WP_Query|null $query Query object.
     *
     * @return string 'main', 'main/posts', 'posts', 'main/blocks', 'blocks`.
     */
    function current_query_context($query = null)
    {
    }
    /**
     * Set the current rule (globaly accessible).
     *
     * Because we check posts in `the_posts`, we can't trust the global $wp_query
     * has been set yet, so we need to manage global state ourselves.
     *
     * @param \WP_Query|null $query WP_Query object.
     *
     * @return void
     */
    function set_rules_query($query)
    {
    }
    /**
     * Check and overload global post if needed.
     *
     * This has no effect when checking global queries ($post_id = null).
     *
     * @param int|\WP_Post|null $post_id Post ID.
     *
     * @return bool
     */
    function setup_post($post_id = null)
    {
    }
    /**
     * Check and clear global post if needed.
     *
     * @return void
     */
    function clear_post()
    {
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
    function is_func_disabled($func)
    {
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
    function is_rest()
    {
    }
    /**
     * Check if this is a cron request.
     *
     * @return boolean
     */
    function is_cron()
    {
    }
    /**
     * Check if this is an AJAX request.
     *
     * @return boolean
     */
    function is_ajax()
    {
    }
    /**
     * Check if this is a frontend request.
     *
     * @return boolean
     */
    function is_frontend()
    {
    }
    /**
     * Change camelCase to snake_case.
     *
     * @param string $str String to convert.
     *
     * @return string Converted string.
     */
    function camel_case_to_snake_case($str)
    {
    }
    /**
     * Change snake_case to camelCase.
     *
     * @param string $str String to convert.
     *
     * @return string Converted string.
     */
    function snake_case_to_camel_case($str)
    {
    }
    /**
     * Get array values using dot.notation.
     *
     * @param string              $key Key to fetch.
     * @param array<string,mixed> $arr Array to fetch from.
     *
     * @return mixed|null
     */
    function fetch_key_from_array($key, $arr)
    {
    }
    /**
     * Convert hex to rgba.
     *
     * @param string $hex_code Hex code to convert.
     * @param float  $opacity Opacity to use.
     *
     * @return string Converted rgba string.
     */
    function convert_hex_to_rgba($hex_code, $opacity = 1)
    {
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
    function deep_clean_array($arr)
    {
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
    function get_restriction($restriction)
    {
    }
    /**
     * Check if admins are excluded from restrictions.
     *
     * @return bool True if admins are excluded, false if not.
     */
    function admins_are_excluded()
    {
    }
    /**
     * Current user is excluded from restrictions.
     *
     * @return bool True if user is excluded, false if not.
     */
    function user_is_excluded()
    {
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
    function user_meets_requirements($user_status, $user_roles = [], $role_match = 'match')
    {
    }
    /**
     * Check if a given query can be ignored.
     *
     * @param \WP_Query $query Query object.
     *
     * @return bool True if query can be ignored, false if not.
     */
    function query_can_be_ignored($query = null)
    {
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
    function get_v1_restrictions()
    {
    }
    /**
     * Remap old conditions to new rules.
     *
     * @param array<array<string,mixed>> $old_conditions Array of old conditions.
     *
     * @return array{logicalOperator:string,items:array<array<string,mixed>>}
     */
    function remap_conditions_to_query($old_conditions)
    {
    }
    /**
     * Remap old condition to new rule.
     *
     * @param array<string,mixed> $condition Old condition.
     *
     * @return array<string,mixed>
     */
    function remap_condition_to_rule($condition)
    {
    }
}
/**
 * Plugin Name: Content Control
 * Plugin URI: https://contentcontrolplugin.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=plugin-uri
 * Description: Restrict content to logged in/out users or specific user roles. Restrict access to certain parts of a page/post. Control the visibility of widgets.
 * Version: 2.0.12
 * Author: Code Atlantic
 * Author URI: https://code-atlantic.com/?utm_campaign=plugin-info&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=author-uri
 * Donate link: https://code-atlantic.com/donate/?utm_campaign=donations&utm_source=php-file-header&utm_medium=plugin-ui&utm_content=donate-link
 * Text Domain: content-control
 *
 * Minimum PHP: 5.6
 * Minimum WP: 5.6
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
    function get_plugin_config()
    {
    }
    /**
     * Get config or config property.
     *
     * @param string|null $key Key of config item to return.
     *
     * @return mixed
     */
    function config($key = null)
    {
    }
    /**
     * Check plugin prerequisites.
     *
     * @return bool
     */
    function check_prerequisites()
    {
    }
    /**
     * Initiates and/or retrieves an encapsulated container for the plugin.
     *
     * This kicks it all off, loads functions and initiates the plugins main class.
     *
     * @return \ContentControl\Plugin\Core
     */
    function plugin_instance()
    {
    }
    /**
     * Easy access to all plugin services from the container.
     *
     * @see \ContentControl\plugin_instance
     *
     * @param string|null $service_or_config Key of service or config to fetch.
     * @return \ContentControl\Plugin\Core|mixed
     */
    function plugin($service_or_config = null)
    {
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
    function remove_wp_options_data()
    {
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
    function content_control($service_or_config = \null)
    {
    }
    /**
     * Get the Content Control plugin instance.
     *
     * @deprecated 2.0.0 Use \ContentControl\plugin() instead.
     *
     * @return \ContentControl\Plugin\Core
     */
    function jp_content_control()
    {
    }
}