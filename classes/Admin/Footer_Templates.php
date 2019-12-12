<?php


namespace JP\CC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Footer_Templates {

	/**
	 *
	 */
	public static function init() {
		if ( did_action( 'admin_footer' ) || doing_action( 'admin_footer' ) ) {
			self::render();
		} else {
			add_action( 'admin_footer', array( __CLASS__, 'render' ) );
		}
	}

	/**
	 *
	 */
	public static function render() {
		self::general_fields();
		self::html5_fields();
		self::custom_fields();
		self::misc_fields();
		self::helpers();
		self::conditions_editor();
		self::restrictions();
	}

	/**
	 *
	 */
	public static function general_fields() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-text">
			<input type="text" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-password">
			<input type="password" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-select">
			<select id="{{data.id}}" name="{{data.name}}" data-allow-clear="true" {{{data.meta}}}>
				<# _.each(data.options, function(option, key) {

				if (option.options !== undefined && option.options.length) { #>

				<optgroup label="{{{option.label}}}">

					<# _.each(option.options, function(option, key) { #>
					<option value="{{option.value}}" {{{option.meta}}}>{{option.label}}</option>
					<# }); #>

				</optgroup>

				<# } else { #>
				<option value="{{option.value}}" {{{option.meta}}}>{{{option.label}}}</option>
				<# }

				}); #>
			</select>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-radio">
			<ul class="jp-cc-field-radio-list">
				<# _.each(data.options, function(option, key) { #>
				<li
				<# print(option.value === data.value ? 'class="jp-cc-selected"' : ''); #>>
				<input type="radio" id="{{data.id}}_{{key}}" name="{{data.name}}" value="{{option.value}}" {{{option.meta}}}/>
				<label for="{{data.id}}_{{key}}">{{{option.label}}}</label>
				</li>
				<# }); #>
			</ul>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-checkbox">
			<input type="checkbox" id="{{data.id}}" name="{{data.name}}" value="1" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-multicheck">
			<ul class="jp-cc-field-mulitcheck-list">
				<# _.each(data.options, function(option, key) { #>
				<li>
					<input type="checkbox" id="{{data.id}}_{{key}}" name="{{data.name}}[{{option.value}}]" value="{{option.value}}" {{{option.meta}}}/>
					<label for="{{data.id}}_{{key}}">{{option.label}}</label>
				</li>
				<# }); #>
			</ul>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-textarea">
			<textarea name="{{data.name}}" id="{{data.id}}" class="{{data.size}}-text" {{{data.meta}}}>{{data.value}}</textarea>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-hidden">
			<input type="hidden" class="{{data.classes}}" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>
		<?php
	}

	/**
	 *
	 */
	public static function html5_fields() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-range">
			<input type="range" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-search">
			<input type="search" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-number">
			<input type="number" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-email">
			<input type="email" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-url">
			<input type="url" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-tel">
			<input type="tel" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>
		<?php
	}

	/**
	 *
	 */
	public static function custom_fields() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-editor">
			<textarea name="{{data.name}}" id="{{data.id}}" class="jp-cc-wpeditor {{data.size}}-text" {{{data.meta}}}>{{data.value}}</textarea>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-link">
			<button type="button" class="dashicons dashicons-admin-generic button"></button>
			<input type="text" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-rangeslider">
			<input type="text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" class="jp-cc-range-manual" {{{data.meta}}}/>
			<span class="jp-cc-range-value-unit regular-text">{{data.unit}}</span>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-color">
			<input type="text" class="jp-cc-color-picker color-picker" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" data-default-color="{{data.std}}" {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-measure">
			<input type="number" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" size="5" {{{data.meta}}}/>            <select id="{{data.id}}_unit" name="<# print(data.name.replace(data.id, data.id + '_unit')); #>">
				<# _.each(data.units, function(option, key) { #>
				<option value="{{option.value}}" {{{option.meta}}}>{{{option.label}}}</option>
				<# }); #>
			</select>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-license_key">
			<input class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value.key}}" autocomplete="off" {{{data.meta}}}/>

			<# if (data.value.key !== '') { #>
			<?php wp_nonce_field( 'pum_license_activation', 'pum_license_activation_nonce' ); ?>
			<# if (data.value.status === 'valid') { #>
			<span class="jp-cc-license-status"><?php _e( 'Active', 'popup-maker' ); ?></span>
			<input type="submit" class="button-secondary jp-cc-license-deactivate" id="{{data.id}}_deactivate" name="pum_license_deactivate[{{data.id}}]" value="<?php _e( 'Deactivate License', 'popup-maker' ); ?>"/>
			<# } else { #>
			<span class="jp-cc-license-status"><?php _e( 'Inactive', 'popup-maker' ); ?></span>
			<input type="submit" class="button-secondary jp-cc-license-activate" id="{{data.id}}_activate" name="pum_license_activate[{{data.id}}]" value="<?php _e( 'Activate License', 'popup-maker' ); ?>"/>
			<# } #>
			<# } #>

			<# if (data.value.messages && data.value.messages.length) { #>
			<div class="jp-cc-license-messages">
				<# for(var i=0; i < data.value.messages.length; i++) { #>
				<p>{{{data.value.messages[i]}}}</p>
				<# } #>
			</div>
			<# } #>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-datetime">
			<div class="jp-cc-datetime">
				<input placeholder="{{data.placeholder}}" data-input class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
				<a class="input-button" data-toggle><i class="dashicons dashicons-calendar-alt"></i></a>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-datetimerange">
			<div class="jp-cc-datetime-range">
				<input placeholder="{{data.placeholder}}" data-input class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}}/>
				<a class="input-button" data-toggle><i class="dashicons dashicons-calendar-alt"></i></a>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-ga_event_labels">
			<# data.value = _.extend({
			category:'',
			action: '',
			label: '',
			value: 0,
			}, data.value); #>

			<table>
				<tbody>
				<tr>
					<td>
						<label for="{{data.id}}_category" style="padding-left: 3px;"><?php _e( 'Category', 'popup-maker' ); ?></label>
						<input type="text" style="width:100%;" id="{{data.id}}_category" name="{{data.name}}[category]" value="{{data.value.category}}"/>
					</td>
					<td>
						<label for="{{data.id}}_action" style="padding-left: 3px;"><?php _e( 'Action', 'popup-maker' ); ?></label>
						<input type="text" style="width:100%;" id="{{data.id}}_action" name="{{data.name}}[action]" value="{{data.value.action}}"/>
					</td>
					<td>
						<label for="{{data.id}}_label" style="padding-left: 3px;"><?php _e( 'Label', 'popup-maker' ); ?></label>
						<input type="text" style="width:100%;" id="{{data.id}}_label" name="{{data.name}}[label]" value="{{data.value.label}}"/>
					</td>
					<td>
						<label for="{{data.id}}_value" style="padding-left: 3px;"><?php _e( 'Value', 'popup-maker' ); ?></label>
						<input type="number" style="width:100%;height: auto;" id="{{data.id}}_value" name="{{data.name}}[value]" value="{{data.value.value}}" step="0.01" max="999999" min="0"/>
					</td>
				</tr>
				</tbody>
			</table>

			<hr/>
		</script>
		<?php
	}

	/**
	 *
	 */
	public static function misc_fields() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-section">
			<div class="jp-cc-field-section {{data.classes}}">
				<# _.each(data.fields, function(field) { #>
				{{{field}}}
				<# }); #>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-wrapper">
			<div class="jp-cc-field jp-cc-field-{{data.type}} {{data.id}}-wrapper {{data.classes}}" data-id="{{data.id}}" <# print( data.dependencies !== '' ? "data-jp-cc-dependencies='" + data.dependencies + "'" : ''); #> <# print( data.dynamic_desc !== '' ? "data-jp-cc-dynamic-desc='" + data.dynamic_desc + "'" : ''); #>>
				<# if (typeof data.label === 'string' && data.label.length > 0) { #>
					<label for="{{data.id}}">
						{{{data.label}}}
						<# if (typeof data.doclink === 'string' && data.doclink !== '') { #>
							<a href="{{data.doclink}}" title="<?php _e( 'Documentation', 'popup-maker' ); ?>: {{data.label}}" target="_blank" class="jp-cc-doclink dashicons dashicons-editor-help"></a>
						<# } #>
					</label>
				<# } else { #>
					<# if (typeof data.doclink === 'string' && data.doclink !== '') { #>
						<a href="{{data.doclink}}" title="<?php _e( 'Documentation', 'popup-maker' ); ?>: {{data.label}}" target="_blank" class="jp-cc-doclink dashicons dashicons-editor-help"></a>
					<# } #>
				<# } #>
				{{{data.field}}}
				<# if (typeof data.desc === 'string' && data.desc.length > 0) { #>
					<span class="jp-cc-desc desc">{{{data.desc}}}</span>
				<# } #>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-html">
			{{{data.content}}}
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-heading">
			<h3 class="jp-cc-field-heading">{{data.desc}}</h3>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-separator">
			<# if (typeof data.desc === 'string' && data.desc.length > 0 && data.desc_position === 'top') { #>
				<h3 class="jp-cc-field-heading">{{data.desc}}</h3>
			<# } #>
			<hr {{{data.meta}}}/>
			<# if (typeof data.desc === 'string' && data.desc.length > 0 && data.desc_position === 'bottom') { #>
				<h3 class="jp-cc-field-heading">{{data.desc}}</h3>
			<# } #>
		</script>
		<?php
	}

	/**
	 *
	 */
	public static function helpers() {
		?>
		<script type="text/html" id="tmpl-jp-cc-modal">
			<div id="{{data.id}}" class="jp-cc-modal-background {{data.classes}}" role="dialog" aria-hidden="true" aria-labelledby="{{data.id}}-title" aria-describedby="{{data.id}}-description" {{{data.meta}}}>
				<div class="jp-cc-modal-wrap">
					<form class="jp-cc-form">
						<div class="jp-cc-modal-header">
							<# if (data.title.length) { #>
							<span id="{{data.id}}-title" class="jp-cc-modal-title">{{data.title}}</span>
							<# } #>
							<button type="button" class="jp-cc-modal-close" aria-label="<?php _e( 'Close', 'content-control' ); ?>"></button>
						</div>
						<# if (data.description.length) { #>
						<span id="{{data.id}}-description" class="screen-reader-text">{{data.description}}</span>
						<# } #>
						<div class="jp-cc-modal-content">
							{{{data.content}}}
						</div>
						<# if (data.save_button || data.cancel_button) { #>
						<div class="jp-cc-modal-footer submitbox">
							<# if (data.cancel_button) { #>
							<div class="cancel">
								<button type="button" class="submitdelete no-button" href="#">{{data.cancel_button}}</button>
							</div>
							<# } #>
							<# if (data.save_button) { #>
							<div class="jp-cc-submit">
								<span class="spinner"></span>
								<button class="button button-primary">{{data.save_button}}</button>
							</div>
							<# } #>
						</div>
						<# } #>
					</form>
				</div>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-tabs">
			<div class="jp-cc-tabs-container {{data.classes}}" {{{data.meta}}}>
				<ul class="tabs">
					<# _.each(data.tabs, function(tab, key) { #>
					<li class="tab">
						<a href="#{{data.id + '_' + key}}">{{tab.label}}</a>
					</li>
					<# }); #>
				</ul>
				<# _.each(data.tabs, function(tab, key) { #>
				<div id="{{data.id + '_' + key}}" class="tab-content">
					{{{tab.content}}}
				</div>
				<# }); #>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-shortcode">
			[{{{data.tag}}} {{{data.meta}}}]
		</script>

		<script type="text/html" id="tmpl-jp-cc-shortcode-w-content">
			[{{{data.tag}}} {{{data.meta}}}]{{{data.content}}}[/{{{data.tag}}}]
		</script>
		<?php
	}

	/**
	 *
	 */
	public static function conditions_editor() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-conditions">
			<# print(JPCC.conditions.template.editor({groups: data.value})); #>
		</script>

		<script type="text/html" id="tmpl-jp-cc-condition-editor">
			<div class="facet-builder <# if (data.groups && data.groups.length) { print('has-conditions'); } #>">
				<p>
					<strong>
						<?php _e( 'Apply this restriction if the user views content that is:', 'content-control' ); ?>
						<?php /* printf( '%2$s<i class="dashicons dashicons-editor-help" title="%1$s"></i>%3$s',
								__( 'Learn more about restriction content conditions', 'content-control' ),
								'<a href="http://docs.wppopupmaker.com/article/140-conditions" target="_blank">',
								'</a>'
							); */ ?>
					</strong>
				</p>

				<p><?php _e( 'When users visit your site, the plugin will check the viewed content against your selection below and permit or deny access.', 'content-control' ); ?></p>


				<section class="jp-cc-alert-box" style="display:none"></section>
				<div class="facet-groups condition-groups">
					<#
						_.each(data.groups, function (group, group_ID) {
							print(JPCC.conditions.template.group({
								index: group_ID,
								facets: group
							}));
						});
					#>
				</div>
				<div class="no-facet-groups">
					<label for="jp-cc-first-condition"><?php _e( 'Choose a content type to get started.', 'content-control' ); ?></label>
					<div class="jp-cc-field select jpselect2 jp-cc-facet-target">
						<button type="button" class="jp-cc-not-operand" aria-label="<?php _e( 'Enable the Not Operand', 'content-control' ); ?>">
							<span class="is"><?php _e( 'Is', 'content-control' ); ?></span>
							<span class="not"><?php _e( 'Is Not', 'content-control' ); ?></span>
							<input type="checkbox" id="jp-cc-first-facet-operand" value="1" />
						</button>
						<# print(JPCC.conditions.template.selectbox({id: 'jp-cc-first-condition', name: "", placeholder: "<?php _e( 'Choose a condition', 'content-control' ); ?>"})); #>
					</div>
				</div>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-condition-group">

			<div class="facet-group-wrap" data-index="{{data.index}}">
				<section class="facet-group">
					<div class="facet-list">
						<# _.each(data.facets, function (facet) {
						print(JPCC.conditions.template.facet(facet));
						}); #>
					</div>
					<div class="add-or">
						<button type="button" class="add add-facet no-button" aria-label="<?php _ex( 'Add another OR condition', 'aria-label for add new OR condition button', 'content-control' ); ?>"><?php _e( 'or', 'content-control' ); ?></button>
					</div>
				</section>
				<p class="and">
					<button type="button" class="add-facet no-button" aria-label="<?php _ex( 'Add another AND condition group', 'aria-label for add new AND condition button', 'content-control' ); ?>"><?php _e( 'and', 'content-control' ); ?></button>
				</p>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-condition-facet">
			<div class="facet" data-index="{{data.index}}" data-target="{{data.target}}">
				<i class="or"><?php _e( 'or', 'content-control' ); ?></i>
				<div class="facet-col facet-target jp-cc-field jp-cc-facet-target select jpselect2 <# if (typeof data.not_operand !== 'undefined' && data.not_operand == '1') print('not-operand-checked'); #>">
					<button type="button" class="jp-cc-not-operand" aria-label="<?php _e( 'Enable the Not Operand', 'content-control' ); ?>">
						<span class="is"><?php _e( 'Is', 'content-control' ); ?></span>
						<span class="not"><?php _e( 'Is Not', 'content-control' ); ?></span>
						<input type="checkbox" name="conditions[{{data.group}}][{{data.index}}][not_operand]" value="1" <# if (typeof data.not_operand !== 'undefined') print(JPCC.checked(data.not_operand, true, true)); #> />
					</button>
					<# print(JPCC.conditions.template.selectbox({index: data.index, group: data.group, value: data.target, placeholder: "<?php _e( 'Choose a condition', 'content-control' ); ?>"})); #>
				</div>

				<div class="facet-settings facet-col">
					<# print(JPCC.conditions.template.settings(data, data.settings)); #>
				</div>

				<div class="facet-actions">
					<button type="button" class="remove remove-facet dashicons dashicons-dismiss no-button" aria-label="<?php _e( 'Remove Condition', 'content-control' ); ?>"></button>
				</div>
			</div>
		</script>
		<?php
	}

	public static function restrictions() {
		?>

		<script type="text/html" id="tmpl-jp-cc-restriction-table-row">
			<tr data-index="{{data.index}}">
				<th scope="row" class="check-column">
					<label class="screen-reader-text" for="cb-select-{{data.index}}">
						<?php _e( 'Select restriction', 'content-control' ); ?>
					</label>
					<input id="cb-select-{{data.index}}" type="checkbox" name="restriction[]" value="{{data.index}}">
					<div class="locked-indicator"></div>
				</th>
				<td><i class="dashicons dashicons-menu"></i></td>
				<td>
					<strong>
						<a href="#{{data.index}}" class="edit_restriction row-title">
							{{data.title}}
						</a>
					</strong>
					<input type="hidden" class="jp_cc_restriction" name="jp_cc_settings[restrictions][]" value='{{JSON.stringify(data)}}' />
					<div class="row-actions">
						<span class="edit">
							<button type="button" class="edit_restriction no-button link-button" aria-label="<?php echo _x( 'Edit “{{data.title}}”', 'Edit button label for restriction table', 'content-control' ); ?>"><?php _e( 'Edit', 'content-control' ); ?></button> |
						</span>
						<span class="trash">
							<button type="button" class="remove_restriction no-button link-button delete-button" aria-label="<?php echo _x( 'Delete “{{data.title}}!”', 'Trash button label for restriction table', 'content-control' ); ?>"><?php _e( 'Trash', 'content-control' ); ?></button> |
						</span>
					</div>
				</td>
				<td>
					<# switch (data.who) {
					case '' : print("<strong><?php _e( 'Everyone', 'content-control' ); ?></strong>");
					break;
					case 'logged_out' : print("<strong><?php _e( 'Logged Out Users', 'content-control' ); ?></strong>");
					break;
					case 'logged_in' :
					print("<strong><?php _e( 'Logged In Users', 'content-control' ); ?></strong>: ");
					if (Object.keys(data.roles).length !== 0) {
					var roles = []
					for (key in data.roles) {
					roles.push(key.charAt(0).toUpperCase() + key.slice(1));
					}
					print(roles.join(', '));
					} else {
					print("<?php _e( 'All Users', 'content-control' ); ?>");
					}
					break;
					} #>
					<!--<br/>
					<small>All Pages OR All Posts with Tag: XYZ</small>-->
				</td>
			</tr>
		</script>
		<?php
	}

}
