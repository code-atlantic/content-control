<?php


namespace JP\CC\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Footer_Templates {

	public static function fields() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-section">
			<div class="jp-cc-field-section {{data.classes}}">
				<# _.each(data.fields, function(field) { #>
					{{{field}}}
					<# }); #>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-wrapper">
			<div class="jp-cc-field jp-cc-field-{{data.type}} {{data.id}}-wrapper {{data.classes}}" data-id="{{data.id}}">
				<label for="{{data.id}}">{{data.label}}</label>
				{{{data.field}}}
				<# if (data.desc) { #>
					<span class="jp-cc-desc desc">{{data.desc}}</span>
				<# } #>
			</div>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-heading">
			<h3 class="jp-cc-field-heading">{{data.desc}}</h3>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-separator">
			<hr {{{data.meta}}}/>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-text">
			<input type="text" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-link">
			<button type="button" class="dashicons dashicons-admin-generic button"></button>
			<input type="text" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-range">
			<input type="range" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-search">
			<input type="search" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-number">
			<input type="number" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-email">
			<input type="email" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-url">
			<input type="url" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-tel">
			<input type="tel" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-password">
			<input type="password" placeholder="{{data.placeholder}}" class="{{data.size}}-text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-textarea">
			<textarea name="{{data.name}}" id="{{data.id}}" class="{{data.size}}-text" {{{data.meta}}}>{{data.value}}</textarea>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-editor">
			<textarea name="{{data.name}}" id="{{data.id}}" class="jp-cc-wpeditor {{data.size}}-text" {{{data.meta}}}>{{data.value}}</textarea>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-hidden">
			<input type="hidden" class="{{data.classes}}" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-select">
			<select id="{{data.id}}" name="{{data.name}}" data-allow-clear="true" {{{data.meta}}}>
				<# _.each(data.options, function(option, key) {

					if (option.options !== undefined && option.options.length) { #>

						<optgroup label="{{option.label}}">

							<# _.each(option.options, function(option, key) { #>
								<option value="{{option.value}}" {{{option.meta}}}>{{option.label}}</option>
							<# }); #>

						</optgroup>

					<# } else { #>
						<option value="{{option.value}}" {{{option.meta}}}>{{option.label}}</option>
					<# }
				}); #>
			</select>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-checkbox">
			<input type="checkbox" id="{{data.id}}" name="{{data.name}}" value="1" {{{data.meta}}} />
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-multicheck">
			<ul class="jp-cc-field-mulitcheck-list">
				<# _.each(data.options, function(option, key) { #>
					<li>
						<input type="checkbox" id="{{data.id}}_{{key}}" name="{{data.name}}[{{option.value}}]" value="1" {{{option.meta}}} />
						<label for="{{data.id}}_{{key}}">{{option.label}}</label>
					</li>
					<# }); #>
			</ul>
		</script>

		<script type="text/html" id="tmpl-jp-cc-field-rangeslider">
			<input type="text" id="{{data.id}}" name="{{data.name}}" value="{{data.value}}" class="popmake-range-manual jp-cc-range-manual" {{{data.meta}}} />
			<span class="range-value-unit regular-text">{{data.unit}}</span>
		</script>

		<?php
	}

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
			<div class="jp-cc-tabs-container {{data.classes}}" {{data.meta}}>
		
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

	public static function conditions_editor() {
		?>
		<script type="text/html" id="tmpl-jp-cc-field-conditions">
			<#
				print(JPCC.conditions.template.editor({
					groups: data.value
					}));
				#>
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
							<# print(JPCC.conditions.template.selectbox({id: 'jp-cc-first-condition', name: ""})); #>
						</div>
					</div>
				</div>
			</script>

			<script type="text/html" id="tmpl-jp-cc-condition-group">

				<div class="facet-group-wrap" data-index="{{data.index}}">
					<section class="facet-group">
						<div class="facet-list">
							<#
								_.each(data.facets, function (facet) {
									print(JPCC.conditions.template.facet(facet));
								});
							#>
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
				<div class="facet-col jp-cc-field jp-cc-facet-target select jpselect2 <# if (typeof data.not_operand !== 'undefined' && data.not_operand == '1') print('not-operand-checked'); #>">
					<button type="button" class="jp-cc-not-operand" aria-label="<?php _e( 'Enable the Not Operand', 'content-control' ); ?>">
						<span class="is"><?php _e( 'Is', 'content-control' ); ?></span>
						<span class="not"><?php _e( 'Is Not', 'content-control' ); ?></span>
						<input type="checkbox" name="conditions[{{data.group}}][{{data.index}}][not_operand]" value="1" <# if (typeof data.not_operand !== 'undefined') print(JPCC.checked(data.not_operand, true, true)); #> />
					</button>
					<# print(JPCC.conditions.template.selectbox({index: data.index, group: data.group, value: data.target})); #>
				</div>

				<div class="facet-settings">
					<#
						print(JPCC.conditions.template.settings(data, data.settings));
					#>
				</div>

				<div class="facet-actions">
					<button type="button" class="remove remove-facet dashicons dashicons-dismiss no-button" aria-label="<?php _e( 'Remove Condition', 'content-control' ); ?>"></button>
				</div>
			</div>
		</script>
		<?php
	}

}
