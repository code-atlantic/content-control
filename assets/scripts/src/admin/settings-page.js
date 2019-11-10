var JPCC;
var wpActiveEditor = true;
(function ($) {
    var $html = $('html'),
        $document = $(document),
        $top_level_elements,
        focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
        previouslyFocused,
        I10n = jp_cc_vars.I10n,
        current_link_field;

    function Selector_Cache() {
        var elementCache = {};

        var get_from_cache = function (selector, $ctxt, reset) {

            if ('boolean' === typeof $ctxt) {
                reset = $ctxt;
                $ctxt = false;
            }
            var cacheKey = $ctxt ? $ctxt.selector + ' ' + selector : selector;

            if (undefined === elementCache[cacheKey] || reset) {
                elementCache[cacheKey] = $ctxt ? $ctxt.find(selector) : jQuery(selector);
            }

            return elementCache[cacheKey];
        };

        get_from_cache.elementCache = elementCache;
        return get_from_cache;
    }

    JPCC = {
        forms: {
            init: function () {

                $(document)
                    .on('change', '.jp-cc-field-select select', JPCC.forms.select)
                    .on('click', '.jp-cc-field-checkbox input, .jp-cc-field-checkbox label', JPCC.forms.checkbox)

                    .on('jp_cc_form_check', function () {
                        $('.jp-cc-field-select select').each(JPCC.forms.select);
                        $('.jp-cc-field-checkbox input').each(JPCC.forms.checkbox);
                    })
                    .trigger('jp_cc_form_check');
            },
            form_check: function () {
                $(document).trigger('jp_cc_form_check');
            },
            select: function () {
                var $this = $(this),
                    id = $this.parents('.jp-cc-field').data('id'),
                    val = $this.val(),
                    toggle_fields = $('.jp-cc-field').filter('[class*="' + id + '--"]');

                toggle_fields.hide();

                toggle_fields.filter('.' + id + '--' + val).show();
            },
            checkbox: function () {
                var $this = $(this),
                    id = $this.parents('.jp-cc-field').data('id'),
                    checked = $this.is(':checked'),
                    checkbox_class = id + '--',
                    $toggle_fields = $('.jp-cc-field').filter('[class*="' + checkbox_class + '"]');

                if (checked) {
                    $toggle_fields.filter('.' + id + '--checked').show();
                    $toggle_fields.filter('.' + id + '--unchecked').hide();
                } else {
                    $toggle_fields.filter('.' + id + '--checked').show();
                    $toggle_fields.filter('.' + id + '--unchecked').hide();
                }
            }
        },
        models: {
            field: function (args) {
                return $.extend(true, {}, {
                    type: 'text',
                    id: '',
                    id_prefix: '',
                    name: '',
                    label: null,
                    placeholder: '',
                    desc: null,
                    size: 'regular',
                    classes: [],
                    value: null,
                    select2: false,
                    multiple: false,
                    as_array: false,
                    options: [],
                    object_type: null,
                    object_key: null,
                    std: null,
                    min: 0,
                    max: 50,
                    step: 1,
                    unit: 'px',
                    required: false,
                    meta: {}
                }, args);
            }
        },
        selectors: new Selector_Cache(),
        utils: {
            object_to_array: function (object) {
                var array = [],
                    i;

                // Convert facets to array (JSON.stringify breaks arrays).
                if (typeof object === 'object') {
                    for (i in object) {
                        array.push(object[i]);
                    }
                    object = array;
                }

                return object;
            }
        },
        wp_editor: function (options) {

            var default_options,
                id_regexp = new RegExp('jp_cc_id', 'g');

            if (typeof tinyMCEPreInit == 'undefined' || typeof QTags == 'undefined' || typeof jp_cc_wpeditor_vars == 'undefined') {
                console.warn('js_wp_editor( $settings ); must be loaded');
                return this;
            }

            default_options = {
                'mode': 'html',
                'mceInit': {
                    "theme": "modern",
                    "skin": "lightgray",
                    "language": "en",
                    "formats": {
                        "alignleft": [
                            {
                                "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                                "styles": {"textAlign": "left"},
                                "deep": false,
                                "remove": "none"
                            },
                            {
                                "selector": "img,table,dl.wp-caption",
                                "classes": ["alignleft"],
                                "deep": false,
                                "remove": "none"
                            }
                        ],
                        "aligncenter": [
                            {
                                "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                                "styles": {"textAlign": "center"},
                                "deep": false,
                                "remove": "none"
                            },
                            {
                                "selector": "img,table,dl.wp-caption",
                                "classes": ["aligncenter"],
                                "deep": false,
                                "remove": "none"
                            }
                        ],
                        "alignright": [
                            {
                                "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                                "styles": {"textAlign": "right"},
                                "deep": false,
                                "remove": "none"
                            },
                            {
                                "selector": "img,table,dl.wp-caption",
                                "classes": ["alignright"],
                                "deep": false,
                                "remove": "none"
                            }
                        ],
                        "strikethrough": {"inline": "del", "deep": true, "split": true}
                    },
                    "relative_urls": false,
                    "remove_script_host": false,
                    "convert_urls": false,
                    "browser_spellcheck": true,
                    "fix_list_elements": true,
                    "entities": "38,amp,60,lt,62,gt",
                    "entity_encoding": "raw",
                    "keep_styles": false,
                    "paste_webkit_styles": "font-weight font-style color",
                    "preview_styles": "font-family font-size font-weight font-style text-decoration text-transform",
                    "wpeditimage_disable_captions": false,
                    "wpeditimage_html5_captions": false,
                    "plugins": "charmap,hr,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpeditimage,wpgallery,wplink,wpdialogs,wpview,image",
                    "content_css": jp_cc_wpeditor_vars.includes_url + "css/dashicons.css?ver=3.9," + jp_cc_wpeditor_vars.includes_url + "js/mediaelement/mediaelementplayer.min.css?ver=3.9," + jp_cc_wpeditor_vars.includes_url + "js/mediaelement/wp-mediaelement.css?ver=3.9," + jp_cc_wpeditor_vars.includes_url + "js/tinymce/skins/wordpress/wp-content.css?ver=3.9",
                    "selector": "#jp_cc_id",
                    "resize": "vertical",
                    "menubar": false,
                    "wpautop": true,
                    "indent": false,
                    "toolbar1": "bold,italic,strikethrough,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,wp_more,spellchecker,fullscreen,wp_adv",
                    "toolbar2": "formatselect,underline,alignjustify,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
                    "toolbar3": "",
                    "toolbar4": "",
                    "tabfocus_elements": ":prev,:next",
                    "body_class": "jp_cc_id"
                }
            };

            if (tinyMCEPreInit.mceInit.jp_cc_id) {
                default_options.mceInit = tinyMCEPreInit.mceInit.jp_cc_id;
            }

            options = $.extend(true, {}, default_options, options);

            return this.each(function () {
                var $this = $(this),
                    current_id = $this.attr('id'),
                    temp = {};

                if(tinyMCE.editors[current_id] !== undefined) {
                    tinyMCE.remove(tinymce.editors[current_id]);
                }

                if (!$this.is('textarea')) {
                    console.warn('Element must be a textarea');
                    if ($this.closest('.wp-editor-wrap').length) {
                        temp.editor_wrap = $this.closest('.wp-editor-wrap');
                        temp.field_parent = temp.editor_wrap.parent();

                        temp.editor_wrap.before($this.clone());
                        temp.editor_wrap.remove();

                        $this = temp.field_parent.find('textarea[id="' + current_id + '"]');
                    }
                }
                $this.addClass('wp-editor-area').show();


                $.each(options.mceInit, function (key, value) {
                    if ($.type(value) == 'string') {
                        options.mceInit[key] = value.replace(id_regexp, current_id);
                    }
                });

                options.mode = options.mode == 'tmce' ? 'tmce' : 'html';

                tinyMCEPreInit.mceInit[current_id] = options.mceInit;

                var wrap = $('<div id="wp-' + current_id + '-wrap" class="wp-core-ui wp-editor-wrap ' + options.mode + '-active" />'),
                    editor_tools = $('<div id="wp-' + current_id + '-editor-tools" class="wp-editor-tools hide-if-no-js" />'),
                    editor_tabs = $('<div class="wp-editor-tabs" />'),
                    switch_editor_html = $('<a id="' + current_id + '-html" class="wp-switch-editor switch-html" data-wp-editor-id="'+current_id+'">Text</a>'),
                    switch_editor_tmce = $('<a id="' + current_id + '-tmce" class="wp-switch-editor switch-tmce" data-wp-editor-id="'+current_id+'">Visual</a>'),
                    media_buttons = $('<div id="wp-' + current_id + '-media-buttons" class="wp-media-buttons" />'),
                    insert_media_button = $('<a href="#" id="insert-media-button" class="button insert-media add_media" data-editor="' + current_id + '" title="Add Media"><span class="wp-media-buttons-icon"></span> Add Media</a>'),
                    editor_container = $('<div id="wp-' + current_id + '-editor-container" class="wp-editor-container" />'),
                    content_css = /*Object.prototype.hasOwnProperty.call(tinyMCEPreInit.mceInit[current_id], 'content_css') ? tinyMCEPreInit.mceInit[current_id]['content_css'].split(',') :*/ false;

                insert_media_button.appendTo(media_buttons);
                media_buttons.appendTo(editor_tools);

                switch_editor_html.appendTo(editor_tabs);
                switch_editor_tmce.appendTo(editor_tabs);
                editor_tabs.appendTo(editor_tools);

                editor_tools.appendTo(wrap);
                editor_container.appendTo(wrap);

                editor_container.append($this.clone().addClass('wp-editor-area'));

                if (content_css !== false)
                    $.each(content_css, function () {
                        if (!$('link[href="' + this + '"]').length)
                            $this.before('<link rel="stylesheet" type="text/css" href="' + this + '">');
                    });

                $this.before('<link rel="stylesheet" id="editor-buttons-css" href="' + jp_cc_wpeditor_vars.includes_url + 'css/editor.css" type="text/css" media="all">');

                $this.before(wrap);
                $this.remove();

                new QTags(current_id);
                QTags._buttonsInit();
                switchEditors.go(current_id, options.mode);

                $('.insert-media', wrap).on('click', function (event) {
                    var elem = $(event.currentTarget),
                        options = {
                            frame: 'post',
                            state: 'insert',
                            title: wp.media.view.l10n.addMedia,
                            multiple: true
                        };

                    event.preventDefault();

                    elem.blur();

                    if (elem.hasClass('gallery')) {
                        options.state = 'gallery';
                        options.title = wp.media.view.l10n.createGalleryTitle;
                    }

                    wp.media.editor.open(current_id, options);
                });

            });
        },
        templates: {
            render: function (template, data) {
                var _template = wp.template(template);

                if ('object' === typeof data.classes) {
                    data.classes = data.classes.join(' ');
                }

                // Prepare the meta data for template.
                data = JPCC.templates.prepareMeta(data);

                return _template(data);
            },
            shortcode: function (args) {
                var data = $.extend(true, {}, {
                        tag: '',
                        meta: {},
                        has_content: false,
                        content: ''
                    }, args),
                    template = data.has_content ? 'jp-cc-shortcode-w-content' : 'jp-cc-shortcode';

                return JPCC.templates.render(template, data);
            },
            modal: function (args) {
                var data = $.extend(true, {}, {
                    id: '',
                    title: '',
                    description: '',
                    classes: '',
                    save_button: I10n.save,
                    cancel_button: I10n.cancel,
                    content: ''
                }, args);

                return JPCC.templates.render('jp-cc-modal', data);
            },
            tabs: function (args) {
                var classes = args.classes || [],
                    data = $.extend(true, {}, {
                        id: '',
                        vertical: true,
                        form: true,
                        classes: '',
                        tabs: {
                            general: {
                                label: 'General',
                                content: ''
                            }
                        }
                    }, args);

                if (data.form) {
                    classes.push('tabbed-form');
                }
                if (data.vertical) {
                    classes.push('vertical-tabs');
                }

                data.classes = data.classes + ' ' + classes.join(' ');

                return JPCC.templates.render('jp-cc-tabs', data);
            },
            section: function (args) {
                var data = $.extend(true, {}, {
                    classes: [],
                    fields: []
                }, args);


                return JPCC.templates.render('jp-cc-field-section', data);
            },
            field: function (args) {
                var fieldTemplate = 'jp-cc-field-' + args.type,
                    options = [],
                    data = $.extend(true, {}, JPCC.models.field(args));

                if (!$('#tmpl-' + fieldTemplate).length) {
                    if (args.type === 'objectselfect' || args.type === 'postselect' || args.type === 'taxonomyselect') {
                        fieldTemplate = 'jp-cc-field-select';
                    }
                    if (!$('#tmpl-' + fieldTemplate).length) {
                        return '';
                    }
                }

                if (!data.value && args.std !== undefined) {
                    data.value = args.std;
                }

                if ('string' === typeof data.classes) {
                    data.classes = data.classes.split(' ');
                }

                if (args.class !== undefined) {
                    data.classes.push(args.class);
                }

                if (data.required) {
                    data.meta.required = true;
                    data.classes.push('jp-cc-required');
                }

                switch (args.type) {
                case 'select':
                case 'objectselect':
                case 'postselect':
                case 'taxonomyselect':
                    if (data.options !== undefined) {
                        _.each(data.options, function (value, label) {
                            var selected = false,
                                optgroup,
                                optgroup_options;

                            if (typeof value !== 'object') {

                                if (data.multiple && ((typeof data.value === 'object' && data.value[value] !== undefined) || (typeof data.value === 'array' && data.value.indexOf(value) !== false))) {
                                    selected = 'selected';
                                } else if (!data.multiple && data.value == value) {
                                    selected = 'selected';
                                }

                                options.push(
                                    JPCC.templates.prepareMeta({
                                        label: label,
                                        value: value,
                                        meta: {
                                            selected: selected
                                        }
                                    })
                                );

                            } else {
                                // Process Option Groups

                                optgroup = label;
                                optgroup_options = [];

                                _.each(value, function (value, label) {
                                    var selected = false;

                                    if (data.multiple && ((typeof data.value === 'object' && data.value[value] !== undefined) || (typeof data.value === 'array' && data.value.indexOf(value) !== false))) {
                                        selected = 'selected';
                                    } else if (!data.multiple && data.value == value) {
                                        selected = 'selected';
                                    }

                                    optgroup_options.push(
                                        JPCC.templates.prepareMeta({
                                            label: label,
                                            value: value,
                                            meta: {
                                                selected: selected
                                            }
                                        })
                                    );

                                });

                                options.push({
                                    label: optgroup,
                                    options: optgroup_options
                                });

                            }

                        });

                        data.options = options;

                    }

                    if (data.multiple) {

                        data.meta.multiple = true;

                        if (data.as_array) {
                            data.name += '[]';
                        }

                        if (!data.value || !data.value.length) {
                            data.value = [];
                        }

                        if (typeof data.value === 'string') {
                            data.value = [data.value];
                        }

                    }

                    if (args.type !== 'select') {
                        data.select2 = true;
                        data.classes.push('jp-cc-field-objectselect');
                        data.classes.push(args.type === 'postselect' ? 'jp-cc-field-postselect' : 'jp-cc-field-taxonomyselect');
                        data.meta['data-objecttype'] = args.type === 'postselect' ? 'post_type' : 'taxonomy';
                        data.meta['data-objectkey'] = args.type === 'postselect' ? args.post_type : args.taxonomy;
                        data.meta['data-current'] = data.value;
                    }

                    if (data.select2) {
                        data.classes.push('jpselect2');

                        if (data.placeholder) {
                            data.meta['data-placeholder'] = data.placeholder;
                        }
                    }

                    break;
                case 'multicheck':
                    if (data.options !== undefined) {

                        if (!data.value) {
                            data.value = [];
                        }

                        if (data.as_array) {
                            data.name += '[]';
                        }

                        _.each(data.options, function (value, label) {

                            options.push(
                                JPCC.templates.prepareMeta({
                                    label: label,
                                    value: value,
                                    meta: {
                                        checked: (typeof data.value === 'object' && data.value[value] !== undefined) || (typeof data.value === 'array' && data.value.indexOf(value) >= 0)
                                    }
                                })
                            );

                        });

                        data.options = options;
                    }
                    break;
                case 'checkbox':
                    if (parseInt(data.value, 10) === 1) {
                        data.meta.checked = true;
                    }
                    break;
                case 'rangeslider':
                    data.meta.readonly = true;
                    data.meta.step = data.step;
                    data.meta.min = data.min;
                    data.meta.max = data.max;
                    break;
                case 'textarea':
                    data.meta.cols = data.cols;
                    data.meta.rows = data.rows;
                    break;
                }

                data.field = JPCC.templates.render(fieldTemplate, data);

                return JPCC.templates.render('jp-cc-field-wrapper', data);
            },
            prepareMeta: function (data) {
                // Convert meta JSON to attribute string.
                var _meta = [],
                    key;

                for (key in data.meta) {
                    if (data.meta.hasOwnProperty(key)) {
                        // Boolean attributes can only require attribute key, not value.
                        if ('boolean' === typeof data.meta[key]) {
                            // Only set truthy boolean attributes.
                            if (data.meta[key]) {
                                _meta.push(_.escape(key));
                            }
                        } else {
                            _meta.push(_.escape(key) + '="' + _.escape(data.meta[key]) + '"');
                        }
                    }
                }

                data.meta = _meta.join(' ');
                return data;
            }
        },
        modals: {
            _current: null,
            // Accessibility: Checks focus events to ensure they stay inside the modal.
            forceFocus: function (event) {
                if (JPCC.modals._current && !JPCC.modals._current.contains(event.target)) {
                    event.stopPropagation();
                    JPCC.modals._current.focus();
                }
            },
            trapEscapeKey: function (e) {
                if (e.keyCode === 27) {
                    JPCC.modals.closeAll();
                    e.preventDefault();
                }
            },
            trapTabKey: function (e) {
                // if tab or shift-tab pressed
                if (e.keyCode === 9) {
                    // get list of focusable items
                    var focusableItems = JPCC.modals._current.find('*').filter(focusableElementsString).filter(':visible'),
                        // get currently focused item
                        focusedItem = $(':focus'),
                        // get the number of focusable items
                        numberOfFocusableItems = focusableItems.length,
                        // get the index of the currently focused item
                        focusedItemIndex = focusableItems.index(focusedItem);

                    if (e.shiftKey) {
                        //back tab
                        // if focused on first item and user preses back-tab, go to the last focusable item
                        if (focusedItemIndex === 0) {
                            focusableItems.get(numberOfFocusableItems - 1).focus();
                            e.preventDefault();
                        }
                    } else {
                        //forward tab
                        // if focused on the last item and user preses tab, go to the first focusable item
                        if (focusedItemIndex === numberOfFocusableItems - 1) {
                            focusableItems.get(0).focus();
                            e.preventDefault();
                        }
                    }
                }
            },
            setFocusToFirstItem: function () {
                // set focus to first focusable item
                JPCC.modals._current.find('.jp-cc-modal-content *').filter(focusableElementsString).filter(':visible').first().focus();
            },
            closeAll: function (callback) {
                $('.jp-cc-modal-background')
                    .off('keydown.jp_cc_modal')
                    .hide(0, function () {
                        $('html').css({overflow: 'visible', width: 'auto'});

                        if ($top_level_elements) {
                            $top_level_elements.attr('aria-hidden', 'false');
                            $top_level_elements = null;
                        }

                        // Accessibility: Focus back on the previously focused element.
                        if (previouslyFocused.length) {
                            previouslyFocused.focus();
                        }

                        // Accessibility: Clears the JPCC.modals._current var.
                        JPCC.modals._current = null;

                        // Accessibility: Removes the force focus check.
                        $document.off('focus.jp_cc_modal');
                        if (undefined !== callback) {
                            callback();
                        }
                    })
                    .attr('aria-hidden', 'true');

            },
            show: function (modal, callback) {
                $('.jp-cc-modal-background')
                    .off('keydown.jp_cc_modal')
                    .hide(0)
                    .attr('aria-hidden', 'true');

                $html
                    .data('origwidth', $html.innerWidth())
                    .css({overflow: 'hidden', 'width': $html.innerWidth()});

                // Accessibility: Sets the previous focus element.

                var $focused = $(':focus');
                if (!$focused.parents('.jp-cc-modal-wrap').length) {
                    previouslyFocused = $focused;
                }

                // Accessibility: Sets the current modal for focus checks.
                JPCC.modals._current = $(modal);

                // Accessibility: Close on esc press.
                JPCC.modals._current
                    .on('keydown.jp_cc_modal', function (e) {
                        JPCC.modals.trapEscapeKey(e);
                        JPCC.modals.trapTabKey(e);
                    })
                    .show(0, function () {
                        $top_level_elements = $('body > *').filter(':visible').not(JPCC.modals._current);
                        $top_level_elements.attr('aria-hidden', 'true');

                        JPCC.modals._current
                            .trigger('jp_cc_init')
                            // Accessibility: Add focus check that prevents tabbing outside of modal.
                            .on('focus.jp_cc_modal', JPCC.modals.forceFocus);

                        // Accessibility: Focus on the modal.
                        JPCC.modals.setFocusToFirstItem();

                        if (undefined !== callback) {
                            callback();
                        }
                    })
                    .attr('aria-hidden', 'false');

            },
            remove: function (modal) {
                $(modal).remove();
            },
            replace: function (modal, replacement) {
                JPCC.modals.remove($.trim(modal));
                $('body').append($.trim(replacement));
            },
            reload: function (modal, replacement, callback) {
                JPCC.modals.replace(modal, replacement);
                JPCC.modals.show(modal, callback);
            }
        },
        tabs: {
            init: function () {
                $('.jp-cc-tabs-container').filter(':not(.initialized)').each(function () {
                    var $this = $(this),
                        first_tab = $this.find('.tab:first');

                    if ($this.hasClass('vertical-tabs')) {
                        $this.css({
                            minHeight: $this.find('.tabs').eq(0).outerHeight(true)
                        });
                    }

                    $this.find('.active').removeClass('active');
                    first_tab.addClass('active');
                    $(first_tab.find('a').attr('href')).addClass('active');
                    $this.addClass('initialized');
                });
            }
        },
        select2: {
            init: function () {
                $('.jpselect2 select').filter(':not(.initialized)').each(function () {
                    var $this = $(this),
                        current = $this.data('current'),
                        object_type = $this.data('objecttype'),
                        object_key = $this.data('objectkey'),
                        options = {
                            width: "100%",
                            multiple: false,
                            dropdownParent: $this.parent()
                        };

                    if ($this.attr('multiple')) {
                        options.multiple = true;
                    }

                    if (object_type && object_key) {
                        options = $.extend(options, {
                            ajax: {
                                url: ajaxurl,
                                dataType: 'json',
                                delay: 250,
                                data: function (params) {
                                    return {
                                        s: params.term, // search term
                                        page: params.page,
                                        action: "jp_cc_object_search",
                                        object_type: object_type,
                                        object_key: object_key
                                    };
                                },
                                processResults: function (data, params) {
                                    // parse the results into the format expected by Select2
                                    // since we are using custom formatting functions we do not need to
                                    // alter the remote JSON data, except to indicate that infinite
                                    // scrolling can be used
                                    params.page = params.page || 1;

                                    return {
                                        results: data.items,
                                        pagination: {
                                            more: (params.page * 10) < data.total_count
                                        }
                                    };
                                },
                                cache: true
                            },
                            cache: true,
                            escapeMarkup: function (markup) {
                                return markup;
                            }, // let our custom formatter work
                            minimumInputLength: 1,
                            templateResult: JPCC.select2.formatObject,
                            templateSelection: JPCC.select2.formatObjectSelection
                        });
                    }


                    $this
                        .addClass('initialized')
                        .jpselect2(options);

                    if (current !== undefined) {

                        if ('object' !== typeof current) {
                            current = [current];
                        }

                        if (object_type && object_key) {
                            $.ajax({
                                url: ajaxurl,
                                data: {
                                    action: "jp_cc_object_search",
                                    object_type: object_type,
                                    object_key: object_key,
                                    include: current
                                },
                                dataType: "json",
                                success: function (data) {
                                    $.each(data.items, function (key, item) {
                                        // Add any option that doesn't already exist
                                        if (!$this.find('option[value="' + item.id + '"]').length) {
                                            $this.prepend('<option value="' + item.id + '">' + item.text + '</option>');
                                        }
                                    });
                                    // Update the options
                                    $this.val(current).trigger('change');
                                }
                            });
                        } else {
                            $this.val(current).trigger('change');
                        }

                    }

                });
            },
            formatObject: function (object) {
                return object.text;
            },
            formatObjectSelection: function (object) {
                return object.text || object.text;
            }
        },
        restrictions: {
            _last_index: 0,
            _is_edit: false,
            _open_modal: null,
            template: {
                row: function (args) {
                    var data = $.extend(true, {}, {
                        index: '',
                        title: '',
                        who: '',
                        roles: [],
                        conditions: []
                    }, args);

                    return JPCC.templates.render('jp-cc-restriction-table-row', data);
                }
            },
            add: function () {
                var rows = $('table#jp-cc-restrictions tbody.has-items tr'),
                    index = rows.length ? rows.last().index() + 1 : 0;

                JPCC.restrictions._is_edit = false;
                JPCC.restrictions.renderForm(index);
            },
            edit: function (event) {
                var $this = $(event.target),
                    $row = $this.parents('tr'),
                    index = $row.data('index'),
                    values = !$row.length ? null : $row.serializeObject().jp_cc_settings.restrictions[0];

                JPCC.restrictions._is_edit = true;
                JPCC.restrictions.renderForm(index, values);
            },
            refresh: function (restrictions) {
                var $table = $('table#jp-cc-restrictions tbody.has-items'),
                    _restrictions = restrictions || $table.serializeObject().jp_cc_settings.restrictions,
                    i = 0;

                $table.find('tr').remove();

                _.each(_restrictions, function (restriction) {
                    var _restriction = restriction;

                    _restriction.index = i;

                    $table.append(JPCC.restrictions.template.row(_restriction));

                    i++;
                });
            },
            save: function (callback) {
                var index = JPCC.restrictions._modal.data('restriction_index'),
                    $form = JPCC.restrictions._modal.find('.jp-cc-form'),
                    values = $form.serializeObject(),
                    $table = $('table#jp-cc-restrictions tbody'),
                    $row = $table.find('> tr[data-index="' + index + '"]'),
                    data = $.extend(true, {}, {
                        index: index
                    }, values),
                    template = JPCC.restrictions.template.row(data);

                if ($row.length) {
                    $row.replaceWith(template);
                } else {
                    $table.filter('.no-items').hide();
                    $table.filter('.has-items').show().append(template);
                }

                JPCC.restrictions.autosave();

                if (callback !== undefined) {
                    callback();
                }
            },
            remove: function (event) {
                var $this = event.target !== undefined ? $(event.target) : $(event),
                    $row = $this.parents('tr'),
                    $table = $this.parents('table');

                $row.remove();

                if (!$table.find('tbody.has-items tr[data-index]').length) {
                    $table.find('tbody.no-items').show();
                }
            },
            toggle_roles: function () {
                var who = $('#who').val(),
                    $roles = $('.roles-wrapper');

                if (who === 'logged_in') {
                    $roles.show();
                } else {
                    $roles.hide();
                }
            },
            toggle_protection_fields: function () {
                var method = $('#protection_method').val(),
                    $message = $('.protection_method--custom_message'),
                    $redirect = $('.protection_method--redirect');

                switch (method) {
                case 'custom_message':
                    $message.show();
                    $redirect.hide();
                    JPCC.restrictions.toggle_message_fields();
                    break;
                case 'redirect':
                    $message.hide();
                    $redirect.show();
                    JPCC.restrictions.toggle_redirect_fields();
                    break;
                }
            },
            toggle_message_fields: function () {
                var checked = $('#override_default_message').is(':checked'),
                    $editor = $('.custom_message-wrapper');

                if (checked) {
                    $editor.show();
                } else {
                    $editor.hide();
                }
            },
            toggle_redirect_fields: function () {
                var type = $('#redirect_type').val(),
                    $url = $('.redirect_url-wrapper');

                if (type === 'custom') {
                    $url.show();
                } else {
                    $url.hide();
                }
            },
            renderForm: function (index, values) {
                var tabs = {},
                    sections,
                    field,
                    modal_classes = ['jp-cc-restriction-editor'],
                    data = $.extend(true, {}, {
                        id: 'jp-cc-restriction-editor',
                        label: I10n.restriction_modal.title,
                        description: I10n.restriction_modal.description,
                        values: values || {
                            index: index
                        },
                        sections: {
                            general: "General",
                            protection: "Protection",
                            content: "Content"
                        },
                        fields: jp_cc_restriction_fields
                    });

                if (undefined === values) {
                    values = {};
                }

                if (Object.keys(data.sections).length) {
                    modal_classes.push('tabbed-content');

                    if (undefined === sections) {
                        sections = {};
                    }

                    // Fields come already arranged by section. Loop Sections then Fields.
                    _.each(data.fields, function (sectionFields, sectionID) {

                        if (undefined === sections[sectionID]) {
                            sections[sectionID] = [];
                        }

                        // Replace the array with rendered fields.
                        _.each(sectionFields, function (fieldArgs, fieldKey) {
                            field = fieldArgs;

                            if (undefined !== values[fieldArgs.id]) {
                                field.value = values[fieldArgs.id];
                            }

                            sections[sectionID].push(JPCC.templates.field(field));
                        });

                        // Render the section.
                        sections[sectionID] = JPCC.templates.section({
                            fields: sections[sectionID]
                        });
                    });

                    // Generate Tab List
                    _.each(sections, function (section, id) {

                        tabs[id] = {
                            label: data.sections[id],
                            content: section
                        };

                    });

                    // Render Tabs
                    tabs = JPCC.templates.tabs({
                        id: data.id,
                        classes: '',
                        tabs: tabs
                    });

                    modal_content = tabs;
                } else {
                    if (undefined === sections) {
                        sections = [];
                    }

                    // Replace the array with rendered fields.
                    _.each(data.fields, function (fieldArgs, fieldKey) {
                        field = fieldArgs;
                        if (undefined !== values[fieldArgs.id]) {
                            field.value = values[fieldArgs.id];
                        }

                        sections.push(JPCC.templates.field(field));
                    });

                    // Render the section.
                    modal_content = JPCC.templates.section({
                        fields: sections
                    });

                }


                // Render Modal
                JPCC.restrictions._modal = JPCC.templates.modal({
                    id: data.id,
                    title: data.label,
                    description: data.description,
                    save_button: !JPCC.restrictions._is_edit ? I10n.add : I10n.update,
                    classes: modal_classes,
                    content: modal_content,
                    meta: {
                        'data-restriction_index': index
                    }
                });

                JPCC.modals.reload('#' + data.id, JPCC.restrictions._modal, function () {
                    JPCC.restrictions._modal = JPCC.modals._current;
                    JPCC.restrictions._modal.find('.jp-cc-form').submit(function (event) {
                        event.preventDefault();
                        JPCC.restrictions.save(function () {
                            JPCC.modals.closeAll(function () {
                                JPCC.restrictions._modal.remove();
                            });
                        });

                    });

                });
            },
            autosave: function () {
                var $table = $('table#jp-cc-restrictions tbody.has-items'),
                    restrictions = $table.serializeObject().jp_cc_settings.restrictions;

                wp.ajax.send( "jp_cc_options_autosave", {
                    success: function (data) {},
                    error:   function (error) {
                        console.log(error);
                    },
                    data: {
                        nonce: jp_cc_vars.nonce,
                        key: 'restrictions',
                        value: restrictions
                    }
                });
            }
        },
        conditions: {
            get_conditions: function () {
                var _conditions = jp_cc_conditions_selectlist,
                    conditions = [];

                return _conditions;
            },
            not_operand_checkbox: function ($element) {

                $element = $element || $('.jp-cc-not-operand');

                return $element.each(function () {
                    var $this = $(this),
                        $input = $this.find('input');

                    $input.prop('checked', !$input.is(':checked'));

                    JPCC.conditions.toggle_not_operand($this);
                });

            },
            toggle_not_operand: function ($element) {
                $element = $element || $('.jp-cc-not-operand');

                return $element.each(function () {
                    var $this = $(this),
                        $input = $this.find('input'),
                        $is = $this.find('.is'),
                        $not = $this.find('.not'),
                        $container = $this.parents('.jp-cc-facet-target');

                    if ($input.is(':checked')) {
                        $is.hide();
                        $not.show();
                        $container.addClass('not-operand-checked');
                    } else {
                        $is.show();
                        $not.hide();
                        $container.removeClass('not-operand-checked');
                    }
                });
            },
            template: {
                editor: function (args) {
                    var data = $.extend(true, {}, {
                            groups: []
                        }, args);

                    data.groups = JPCC.utils.object_to_array(data.groups);

                    return JPCC.templates.render('jp-cc-condition-editor', data);
                },
                group: function (args) {
                    var facets = [],
                        data = $.extend(true, {}, {
                            index: '',
                            facets: []
                        }, args),
                        i;

                    data.facets = JPCC.utils.object_to_array(data.facets);

                    for(i = 0; data.facets.length > i; i++) {
                        data.facets[i].index = i;
                        data.facets[i].group = data.index;
                    }

                    return JPCC.templates.render('jp-cc-condition-group', data);
                },
                facet: function (args) {
                    var data = $.extend(true, {}, {
                        group: '',
                        index: '',
                        target: '',
                        not_operand: false,
                        settings: {}
                    }, args);

                    return JPCC.templates.render('jp-cc-condition-facet', data);
                },
                settings: function (args, values) {
                    var fields = [],
                        data = $.extend(true, {}, {
                            index: '',
                            group: '',
                            target: null,
                            fields: []
                        }, args);

                    if (!data.fields.length && jp_cc_conditions[args.target] !== undefined) {
                        data.fields = jp_cc_conditions[args.target].fields;
                    }

                    if (undefined === values) {
                        values = {};
                    }

                    // Replace the array with rendered fields.
                    _.each(data.fields, function (field, fieldID) {

                        field = JPCC.models.field(field);

                        if (typeof field.meta !== 'object') {
                            field.meta = {};
                        }

                        if (undefined !== values[fieldID]) {
                            field.value = values[fieldID];
                        }

                        field.name = 'conditions[' + data.group + '][' + data.index + '][settings][' + fieldID + ']';

                        if (field.id === '') {
                            field.id = 'conditions_' + data.group + '_' + data.index + '_settings_' + fieldID;
                        }

                        fields.push(JPCC.templates.field(field));
                    });

                    // Render the section.
                    return JPCC.templates.section({
                        fields: fields
                    });
                },
                selectbox: function (args) {
                    var data = $.extend(true, {}, {
                            id: null,
                            name: null,
                            type: 'select',
                            group: '',
                            index: '',
                            value: null,
                            select2: true,
                            classes: ['facet-target', 'facet-select'],
                            options: JPCC.conditions.get_conditions()
                        }, args);

                    if (data.id === null) {
                        data.id = 'conditions_' + data.group + '_' + data.index + '_target';
                    }

                    if (data.name === null) {
                        data.name = 'conditions[' + data.group + '][' + data.index + '][target]';
                    }

                    return JPCC.templates.field(data);
                }
            },
            groups: {
                add: function (editor, target, not_operand) {
                    var $editor = $(editor),
                        data = {
                            index: $editor.find('.facet-group-wrap').length,
                            facets: [
                                {
                                    target: target || null,
                                    not_operand: not_operand || false,
                                    settings: {}
                                }
                            ]
                        };


                    $editor.find('.facet-groups').append(JPCC.conditions.template.group(data));
                    $editor.addClass('has-conditions');
                },
                remove: function ($group) {
                    var $editor = $group.parents('.facet-builder');

                    $group.prev('.facet-group-wrap').find('.and .add-facet').removeClass('disabled');
                    $group.remove();

                    JPCC.conditions.renumber();

                    if ($editor.find('.facet-group-wrap').length === 0) {
                        $editor.removeClass('has-conditions');
                    }
                }
            },
            facets: {
                add: function ($group, target, not_operand) {
                    var data = {
                            group: $group.data('index'),
                            index: $group.find('.facet').length,
                            target: target || null,
                            not_operand: not_operand || false,
                            settings: {}
                        };

                    $group.find('.facet-list').append(JPCC.conditions.template.facet(data));
                },
                remove: function ($facet) {
                    var $group = $facet.parents('.facet-group-wrap');

                    $facet.remove();

                    if ($group.find('.facet').length === 0) {
                        JPCC.conditions.groups.remove($group);
                    } else {
                        JPCC.conditions.renumber();
                    }
                }
            },
            renumber: function () {
                $('.facet-builder .facet-group-wrap').each(function () {
                    var $group = $(this),
                        groupIndex = $group.parent().children().index($group);

                    $group
                        .data('index', groupIndex)
                        .find('.facet').each(function () {
                        var $facet = $(this),
                            facetIndex = $facet.parent().children().index($facet);

                        $facet
                            .data('index', facetIndex)
                            .find('[name]').each(function () {
                            var replace_with = "conditions[" + groupIndex + "][" + facetIndex + "]";
                            this.name = this.name.replace(/conditions\[\d*?\]\[\d*?\]/, replace_with);
                            this.id = this.name;
                        });
                    });
                });
            }

        },
        checked: function (val1, val2, print) {
            "use strict";

            var checked = false;
            if (typeof val1 === 'object' && typeof val2 === 'string' && jQuery.inArray(val2, val1) !== -1) {
                checked = true;
            } else if (typeof val2 === 'object' && typeof val1 === 'string' && jQuery.inArray(val1, val2) !== -1) {
                checked = true;
            } else if (val1 === val2) {
                checked = true;
            } else if (val1 == val2) {
                checked = true;
            }

            if (print !== undefined && print) {
                return checked ? ' checked="checked"' : '';
            }
            return checked;
        },
        selected: function (val1, val2, print) {
            "use strict";

            var selected = false;
            if (typeof val1 === 'object' && typeof val2 === 'string' && jQuery.inArray(val2, val1) !== -1) {
                selected = true;
            } else if (typeof val2 === 'object' && typeof val1 === 'string' && jQuery.inArray(val1, val2) !== -1) {
                selected = true;
            } else if (val1 === val2) {
                selected = true;
            }

            if (print !== undefined && print) {
                return selected ? ' selected="selected"' : '';
            }
            return selected;
        }
    };

    $.fn.wp_editor = JPCC.wp_editor;

    $(document)
        .on('jp_cc_init', function () {
            JPCC.tabs.init();
            JPCC.select2.init();
            JPCC.conditions.renumber();
            JPCC.conditions.toggle_not_operand();
            $('.jp-cc-field-editor textarea:not(.initialized)').each(function () {
                var $this = $(this).addClass('initialized');
                $this.wp_editor({
                    mode: 'tmce'
                });
            });
        })
        .on('mousedown', '.jp-cc-submit button', function (event) {
            var $form = $(event.target).parents('form').eq(0);

            tinyMCE.triggerSave();

            $form.trigger('jp_cc_before_submit');
        })
        // Tabs
        .on('click', '.jp-cc-tabs-container .tab', function (e) {
            var $this = $(this),
                tab_group = $this.parents('.jp-cc-tabs-container:first'),
                link = $this.find('a').attr('href');

            tab_group.find('.active').removeClass('active');

            $this.addClass('active');
            $(link).addClass('active');

            e.preventDefault();
        })
        // Restrictions
        .on('click', '.add_new_restriction', function (event) {
            JPCC.restrictions.add();
        })
        .on('click', '.edit_restriction', function (event) {
            JPCC.restrictions.edit(event);
        })
        .on('click', '.remove_restriction', function (event) {
            if (confirm(I10n.restrictions.confirm_remove)) {
                JPCC.restrictions.remove(event);
            }
        })
        .on('click', '.bulkactions .button', function (event) {
            var $checked_rows = $('#jp-cc-restrictions tbody.has-items .check-column input:checked');
            switch($(this).prev().val()) {
            case 'trash':
                JPCC.restrictions.remove($checked_rows);
                break;
            }

            $('#cb-select-all, #cb-select-all-1').prop('checked', false);
            $('.bulkactions select').val(-1);
        })
        // Restriction Editor
        .on('change', '#who', JPCC.restrictions.toggle_roles)
        .on('change', '#protection_method', JPCC.restrictions.toggle_protection_fields)
        .on('change', '#redirect_type', JPCC.restrictions.toggle_redirect_fields)
        .on('click', '#override_default_message', JPCC.restrictions.toggle_message_fields)
        .on('jp_cc_init', '#jp-cc-restriction-editor', function () {
            JPCC.restrictions.toggle_roles();
            JPCC.restrictions.toggle_protection_fields();
        })
        // Modals
        .on('click', '.jp-cc-modal-background, .jp-cc-modal-wrap .cancel, .jp-cc-modal-wrap .jp-cc-modal-close', function (e) {
            var $target = $(e.target);
            if (/*$target.hasClass('jp-cc-modal-background') || */$target.hasClass('cancel') || $target.hasClass('jp-cc-modal-close') || $target.hasClass('submitdelete')) {
                JPCC.modals.closeAll();
                e.preventDefault();
                e.stopPropagation();
            }
        })
        // Conditions Editor
        .on('select2:select jpselect2:select', '#jp-cc-first-condition', function (event) {
            var $field = $(this),
                $editor = $field.parents('.facet-builder').eq(0),
                target = $field.val(),
                $operand = $editor.find('#jp-cc-first-facet-operand'),
                not_operand = $operand.is(':checked');

            JPCC.conditions.groups.add($editor, target, not_operand);

            $field
                .val(null)
                .trigger('change');

            $operand.prop('checked', false).parents('.jp-cc-facet-target').removeClass('not-operand-checked');
            $(document).trigger('jp_cc_init');
        })
        .on('click', '.facet-builder .jp-cc-not-operand', function () {
            JPCC.conditions.not_operand_checkbox($(this));
        })
        .on('change', '.facet-builder .facet-target select', function (event) {
            var $this = $(this),
                $facet = $this.parents('.facet'),
                target = $this.val(),
                data = {
                    target: target
                };

            if (target === '' || target === $facet.data('target')) {
                return;
            }

            $facet.data('target', target).find('.facet-settings').html(JPCC.conditions.template.settings(data));
            $(document).trigger('jp_cc_init');
        })
        .on('click', '.facet-builder .facet-group-wrap:last-child .and .add-facet', function () {
            JPCC.conditions.groups.add($(this).parents('.facet-builder').eq(0));
            $(document).trigger('jp_cc_init');
        })
        .on('click', '.facet-builder .add-or .add-facet:not(.disabled)', function () {
            JPCC.conditions.facets.add($(this).parents('.facet-group-wrap').eq(0));
            $(document).trigger('jp_cc_init');
        })
        .on('click', '.facet-builder .remove-facet', function () {
            JPCC.conditions.facets.remove($(this).parents('.facet').eq(0));
            $(document).trigger('jp_cc_init');
        })
        // Link Fields
        .on('click', '.jp-cc-field-link button', function (event) {
            var $input = $(this).next().select(),
                id = $input.attr('id');

            current_link_field = $input;

            wpLink.open(id, $input.val(), ""); //open the link popup

            JPCC.selectors('#wp-link-wrap').removeClass('has-text-field');
            JPCC.selectors('#wp-link-target').hide();
            JPCC.selectors('#jp-cc-restriction-editor', true).hide();
            return false;
        })
        .on('click', '#wp-link-submit, #wp-link-cancel button, #wp-link-close', function (event) {
            var linkAtts = wpLink.getAttrs();

            // If not for our fields then ignore it.
            if (current_link_field === undefined || !current_link_field) {
                return;
            }

            // If not the close buttons then its the save button.
            if (event.target.id === 'wp-link-submit') {
                current_link_field.val(linkAtts.href);
            }

            wpLink.textarea = current_link_field;
            wpLink.close();

            // Clear the current_link_field
            current_link_field = false;

            // Show our editor
            JPCC.selectors('#jp-cc-restriction-editor').show();

            //trap any other events
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            event.stopPropagation();
            return false;
        })
        // Doc Ready
        .ready(function () {
            var $restriction_tables = $('table#jp-cc-restrictions tbody');

            if ($restriction_tables.length) {
                if (jp_cc_restrictions !== undefined && jp_cc_restrictions.length) {
                    $restriction_tables.filter('.has-items').show();
                    $restriction_tables.filter('.no-items').hide();
                    JPCC.restrictions.refresh(jp_cc_restrictions);
                }

                $restriction_tables.sortable({
                    handle: '.dashicons-menu',
                    stop: function( event, ui ) {
                        JPCC.restrictions.refresh();
                        JPCC.restrictions.autosave();
                    }
                });
            }

        });

}(jQuery));