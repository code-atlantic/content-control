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

	/**
	 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
	 * Author: R Reid
	 * source: http://www.strictly-software.com/htmlencode
	 * Licences: GPL, The MIT License (MIT)
	 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 *
	 * Revision:
	 *  2011-07-14, Jacques-Yves Bleau:
	 *       - fixed conversion error with capitalized accentuated characters
	 *       + converted arr1 and arr2 to object property to remove redundancy
	 *
	 * Revision:
	 *  2011-11-10, Ce-Yi Hio:
	 *       - fixed conversion error with a number of capitalized entity characters
	 *
	 * Revision:
	 *  2011-11-10, Rob Reid:
	 *		 - changed array format
	 *
	 * Revision:
	 *  2012-09-23, Alex Oss:
	 *		 - replaced string concatonation in numEncode with string builder, push and join for peformance with ammendments by Rob Reid
	 */

	var Encoder = {

		// When encoding do we convert characters into html or numerical entities
		EncodeType : "entity",  // entity OR numerical

		isEmpty : function(val){
			if(val){
				return ((val===null) || val.length==0 || /^\s+$/.test(val));
			}else{
				return true;
			}
		},

		// arrays for conversion from HTML Entities to Numerical values
		arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
		arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],

		// Convert HTML entities into numerical entities
		HTML2Numerical : function(s){
			return this.swapArrayVals(s,this.arr1,this.arr2);
		},

		// Convert Numerical entities into HTML entities
		NumericalToHTML : function(s){
			return this.swapArrayVals(s,this.arr2,this.arr1);
		},


		// Numerically encodes all unicode characters
		numEncode : function(s){
			if(this.isEmpty(s)) return "";

			var a = [],
				l = s.length;

			for (var i=0;i<l;i++){
				var c = s.charAt(i);
				if (c < " " || c > "~"){
					a.push("&#");
					a.push(c.charCodeAt()); //numeric value of code point
					a.push(";");
				}else{
					a.push(c);
				}
			}

			return a.join("");
		},

		// HTML Decode numerical and HTML entities back to original values
		htmlDecode : function(s){

			var c,m,d = s;

			if(this.isEmpty(d)) return "";

			// convert HTML entites back to numerical entites first
			d = this.HTML2Numerical(d);

			// look for numerical entities &#34;
			var arr=d.match(/&#[0-9]{1,5};/g);

			// if no matches found in string then skip
			if(arr!=null){
				for(var x=0;x<arr.length;x++){
					m = arr[x];
					c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
					// if its a valid number we can decode
					if(c >= -32768 && c <= 65535){
						// decode every single match within string
						d = d.replace(m, String.fromCharCode(c));
					}else{
						d = d.replace(m, ""); //invalid so replace with nada
					}
				}
			}

			return d;
		},

		// encode an input string into either numerical or HTML entities
		htmlEncode : function(s,dbl){

			if(this.isEmpty(s)) return "";

			// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
			dbl = dbl || false; //default to prevent double encoding

			// if allowing double encoding we do ampersands first
			if(dbl){
				if(this.EncodeType=="numerical"){
					s = s.replace(/&/g, "&#38;");
				}else{
					s = s.replace(/&/g, "&amp;");
				}
			}

			// convert the xss chars to numerical entities ' " < >
			s = this.XSSEncode(s,false);

			if(this.EncodeType=="numerical" || !dbl){
				// Now call function that will convert any HTML entities to numerical codes
				s = this.HTML2Numerical(s);
			}

			// Now encode all chars above 127 e.g unicode
			s = this.numEncode(s);

			// now we know anything that needs to be encoded has been converted to numerical entities we
			// can encode any ampersands & that are not part of encoded entities
			// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
			// I am going to use a placeholder

			// if we don't want double encoded entities we ignore the & in existing entities
			if(!dbl){
				s = s.replace(/&#/g,"##AMPHASH##");

				if(this.EncodeType=="numerical"){
					s = s.replace(/&/g, "&#38;");
				}else{
					s = s.replace(/&/g, "&amp;");
				}

				s = s.replace(/##AMPHASH##/g,"&#");
			}

			// replace any malformed entities
			s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

			if(!dbl){
				// safety check to correct any double encoded &amp;
				s = this.correctEncoding(s);
			}

			// now do we need to convert our numerical encoded string into entities
			if(this.EncodeType=="entity"){
				s = this.NumericalToHTML(s);
			}

			return s;
		},

		// Encodes the basic 4 characters used to malform HTML in XSS hacks
		XSSEncode : function(s,en){
			if(!this.isEmpty(s)){
				en = en || true;
				// do we convert to numerical or html entity?
				if(en){
					s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
					s = s.replace(/\"/g,"&quot;");
					s = s.replace(/</g,"&lt;");
					s = s.replace(/>/g,"&gt;");
				}else{
					s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
					s = s.replace(/\"/g,"&#34;");
					s = s.replace(/</g,"&#60;");
					s = s.replace(/>/g,"&#62;");
				}
				return s;
			}else{
				return "";
			}
		},

		// returns true if a string contains html or numerical encoded entities
		hasEncoded : function(s){
			if(/&#[0-9]{1,5};/g.test(s)){
				return true;
			}else if(/&[A-Z]{2,6};/gi.test(s)){
				return true;
			}else{
				return false;
			}
		},

		// will remove any unicode characters
		stripUnicode : function(s){
			return s.replace(/[^\x20-\x7E]/g,"");

		},

		// corrects any double encoded &amp; entities e.g &amp;amp;
		correctEncoding : function(s){
			return s.replace(/(&amp;)(amp;)+/,"$1");
		},


		// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
		swapArrayVals : function(s,arr1,arr2){
			if(this.isEmpty(s)) return "";
			var re;
			if(arr1 && arr2){
				//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
				// array lengths must match
				if(arr1.length == arr2.length){
					for(var x=0,i=arr1.length;x<i;x++){
						re = new RegExp(arr1[x], 'g');
						s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2
					}
				}
			}
			return s;
		},

		inArray : function( item, arr ) {
			for ( var i = 0, x = arr.length; i < x; i++ ){
				if ( arr[i] === item ){
					return i;
				}
			}
			return -1;
		}

	};

	Encoder.EncodeType = "entity";


	JPCC = {
		forms: {
			init: function () {
                JPCC.forms.checkDependencies();
			},
            /**
             * dependencies should look like this:
             *
             * {
             *   field_name_1: value, // Select, radio etc.
             *   field_name_2: true // Checkbox
             * }
             *
             * Support for Multiple possible values of one field
             *
             * {
             *   field_name_1: [ value_1, value_2 ]
             * }
             *
             */
            checkDependencies: function ($dependent_fields) {
                var _fields = $($dependent_fields);

                // If no fields passed, only do those not already initialized.
                $dependent_fields = _fields.length ? _fields : $("[data-jp-cc-dependencies]:not([data-jp-cc-processed-dependencies])");

                $dependent_fields.each(function () {
                    var $dependent = $(this),
                        dependentID = $dependent.data('id'),
                        // The dependency object for this field.
                        dependencies = $dependent.data("jp-cc-processed-dependencies") || {},
                        // Total number of fields this :input is dependent on.
                        requiredCount = Object.keys(dependencies).length,
                        // Current count of fields this :input matched properly.
                        count = 0,
                        // An array of fields this :input is dependent on.
                        dependentFields = $dependent.data("jp-cc-dependent-fields"),
                        // Early declarations.
                        key;

                    // Clean up & pre-process dependencies so we don't need to rebuild each time.
                    if (!$dependent.data("jp-cc-processed-dependencies")) {
                        dependencies = $dependent.data("jp-cc-dependencies");
                        if (typeof dependencies === 'string') {
                            dependencies = JSON.parse(dependencies);
                        }

                        // Convert each key to an array of acceptable values.
                        for (key in dependencies) {
                            if (dependencies.hasOwnProperty(key)) {
                                if (typeof dependencies[key] === "string") {
                                    // Leave boolean values alone as they are for checkboxes or checking if an input has any value.

                                    if (dependencies[key].indexOf(',') !== -1) {
                                        dependencies[key] = dependencies[key].split(',');
                                    } else {
                                        dependencies[key] = [dependencies[key]];
                                    }
                                } else if (typeof dependencies[key] === "number") {
                                    dependencies[key] = [dependencies[key]];
                                }
                            }
                        }

                        // Update cache & counts.
                        requiredCount = Object.keys(dependencies).length;
                        $dependent.data("jp-cc-processed-dependencies", dependencies).attr("data-jp-cc-processed-dependencies", dependencies);
                    }

                    if (!dependentFields) {
                        dependentFields = $.map(dependencies, function (value, index) {
                            var $wrapper = $('.jp-cc-field[data-id="' + index + '"]');

                            return $wrapper.length ? $wrapper.eq(0) : null;
                        });

                        $dependent.data("jp-cc-dependent-fields", dependentFields);
                    }

                    $(dependentFields).each(function () {
                        var $wrapper = $(this),
                            $field = $wrapper.find(':input:first'),
                            id = $wrapper.data("id"),
                            value = $field.val(),
                            required = dependencies[id],
                            matched,
                            // Used for limiting the fields that get updated when this field is changed.
                            all_this_fields_dependents = $wrapper.data('jp-cc-field-dependents') || [];

                        if (all_this_fields_dependents.indexOf(dependentID) === -1) {
                            all_this_fields_dependents.push(dependentID);
                            $wrapper.data('jp-cc-field-dependents', all_this_fields_dependents);
                        }

                        // If no required values found bail early.
                        if (typeof required === 'undefined' || required === null) {
                            $dependent.removeClass('jp-cc-dependencies-met').hide(0).trigger('jpCCFormDependencyUnmet');
                            // Effectively breaks the .each for this $dependent and hides it.
                            return false;
                        }

                        if ($wrapper.hasClass('jp-cc-field-radio')) {
                            value = $wrapper.find(':input:checked').val();
                        }

                        if ($wrapper.hasClass('jp-cc-field-multicheck')) {
                            value = [];
                            $wrapper.find(':checkbox:checked').each(function (i) {
                                value[i] = $(this).val();

                                if (typeof value[i] === 'string' && !isNaN(parseInt(value[i]))) {
                                    value[i] = parseInt(value[i]);
                                }

                            });
                        }

                        // Check if the value matches required values.
                        if ($wrapper.hasClass('jp-cc-field-select') || $wrapper.hasClass('jp-cc-field-radio')) {
                            matched = required && required.indexOf(value) !== -1;
                        } else if ($wrapper.hasClass('jp-cc-field-checkbox')) {
                            matched = required === $field.is(':checked');
                        } else if ($wrapper.hasClass('jp-cc-field-multicheck')) {
                            if (Array.isArray(required)) {
                                matched = false;
                                for (var i = 0; i < required.length; i++) {
                                    if (value.indexOf(required[i]) !== -1) {
                                        matched = true;
                                    }
                                }
                            } else {
                                matched = value.indexOf(required) !== -1;
                            }
                        } else {
                            matched = Array.isArray(required) ? required.indexOf(value) !== -1 : required == value;
                        }

                        if (matched) {
                            count++;
                        } else {
                            $dependent.removeClass('jp-cc-dependencies-met').hide(0).trigger('jpCCFormDependencyUnmet');
                            // Effectively breaks the .each for this $dependent and hides it.
                            return false;
                        }

                        if (count === requiredCount) {
                            $dependent.addClass('jp-cc-dependencies-met').show(0).trigger('jpCCFormDependencyMet');
                        }
                    });
                });
            },
            form_check: function () {
				$(document).trigger('jp_cc_form_check');
			},
            flattenFields: function (data) {
                var form_fields = {},
                    tabs = data.tabs || {},
                    sections = data.sections || {},
                    fields = data.fields || {};

                if (Object.keys(tabs).length && Object.keys(sections).length) {
                    // Loop Tabs
                    _.each(fields, function (subTabs, tabID) {

                        // If not a valid tab or no subsections skip it.
                        if (typeof subTabs !== 'object' || !Object.keys(subTabs).length) {
                            return;
                        }

                        // Loop Tab Sections
                        _.each(subTabs, function (subTabFields, subTabID) {

                            // If not a valid subtab or no fields skip it.
                            if (typeof subTabFields !== 'object' || !Object.keys(subTabFields).length) {
                                return;
                            }

                            // Move single fields into the main subtab.
                            if (forms.is_field(subTabFields)) {
                                var newSubTabFields = {};
                                newSubTabFields[subTabID] = subTabFields;
                                subTabID = 'main';
                                subTabFields = newSubTabFields;
                            }

                            // Loop Tab Section Fields
                            _.each(subTabFields, function (field) {
                                // Store the field by id for easy lookup later.
                                form_fields[field.id] = field;
                            });
                        });
                    });
                }
                else if (Object.keys(tabs).length) {
                    // Loop Tabs
                    _.each(fields, function (tabFields, tabID) {

                        // If not a valid tab or no subsections skip it.
                        if (typeof tabFields !== 'object' || !Object.keys(tabFields).length) {
                            return;
                        }

                        // Loop Tab Fields
                        _.each(tabFields, function (field) {
                            // Store the field by id for easy lookup later.
                            form_fields[field.id] = field;
                        });
                    });
                }
                else if (Object.keys(sections).length) {

                    // Loop Sections
                    _.each(fields, function (sectionFields, sectionID) {
                        // Loop Tab Section Fields
                        _.each(sectionFields, function (field) {
                            // Store the field by id for easy lookup later.
                            form_fields[field.id] = field;
                        });
                    });
                }
                else {
                    fields = forms.parseFields(fields, values);

                    // Replace the array with rendered fields.
                    _.each(fields, function (field) {
                        // Store the field by id for easy lookup later.
                        form_fields[field.id] = field;
                    });
                }

                return form_fields;
            },
            parseFields: function (fields, values) {

                values = values || {};

                _.each(fields, function (field, fieldID) {

                    fields[fieldID] = JPCC.models.field(field);

                    if (typeof fields[fieldID].meta !== 'object') {
                        fields[fieldID].meta = {};
                    }

                    if (undefined !== values[fieldID]) {
                        fields[fieldID].value = values[fieldID];
                    }

                    if (fields[fieldID].id === '') {
                        fields[fieldID].id = fieldID;
                    }
                });

                return fields;
            },
            renderTab: function () {

            },
            renderSection: function () {

            },
            render: function (args, values, $container) {
                var form,
                    sections = {},
                    section = [],
                    form_fields = {},
                    data = $.extend(true, {
                        id: "",
                        tabs: {},
                        sections: {},
                        fields: {},
                        maintabs: {},
                        subtabs: {}
                    }, args),
                    maintabs = $.extend({
                        id: data.id,
                        classes: [],
                        tabs: {},
                        vertical: true,
                        form: true,
                        meta: {
                            'data-min-height': 250
                        }
                    }, data.maintabs),
                    subtabs = $.extend({
                        classes: ['link-tabs', 'sub-tabs'],
                        tabs: {}
                    }, data.subtabs),
                    container_classes = ['jp-cc-dynamic-form'];

                values = values || {};

                if (Object.keys(data.tabs).length && Object.keys(data.sections).length) {
                    container_classes.push('tabbed-content');

                    // Loop Tabs
                    _.each(data.fields, function (subTabs, tabID) {

                        // If not a valid tab or no subsections skip it.
                        if (typeof subTabs !== 'object' || !Object.keys(subTabs).length) {
                            return;
                        }

                        // Define this tab.
                        if (undefined === maintabs.tabs[tabID]) {
                            maintabs.tabs[tabID] = {
                                label: data.tabs[tabID],
                                content: ''
                            };
                        }

                        // Define the sub tabs model.
                        subtabs = $.extend(subtabs, {
                            id: data.id + '-' + tabID + '-subtabs',
                            tabs: {}
                        });

                        // Loop Tab Sections
                        _.each(subTabs, function (subTabFields, subTabID) {

                            // If not a valid subtab or no fields skip it.
                            if (typeof subTabFields !== 'object' || !Object.keys(subTabFields).length) {
                                return;
                            }

                            // Move single fields into the main subtab.
                            if (forms.is_field(subTabFields)) {
                                var newSubTabFields = {};
                                newSubTabFields[subTabID] = subTabFields;
                                subTabID = 'main';
                                subTabFields = newSubTabFields;
                            }

                            // Define this subtab model.
                            if (undefined === subtabs.tabs[subTabID]) {
                                subtabs.tabs[subTabID] = {
                                    label: data.sections[tabID][subTabID],
                                    content: ''
                                };
                            }

                            subTabFields = forms.parseFields(subTabFields, values);

                            // Loop Tab Section Fields
                            _.each(subTabFields, function (field) {
                                // Store the field by id for easy lookup later.
                                form_fields[field.id] = field;

                                // Push rendered fields into the subtab content.
                                subtabs.tabs[subTabID].content += JPCC.templates.field(field);
                            });

                            // Remove any empty tabs.
                            if ("" === subtabs.tabs[subTabID].content) {
                                delete subtabs.tabs[subTabID];
                            }
                        });

                        // If there are subtabs, then render them into the main tabs content, otherwise remove this main tab.
                        if (Object.keys(subtabs.tabs).length) {
                            maintabs.tabs[tabID].content = JPCC.templates.tabs(subtabs);
                        } else {
                            delete maintabs.tabs[tabID];
                        }
                    });

                    if (Object.keys(maintabs.tabs).length) {
                        form = JPCC.templates.tabs(maintabs);
                    }
                }
                else if (Object.keys(data.tabs).length) {
                    container_classes.push('tabbed-content');

                    // Loop Tabs
                    _.each(data.fields, function (tabFields, tabID) {

                        // If not a valid tab or no subsections skip it.
                        if (typeof tabFields !== 'object' || !Object.keys(tabFields).length) {
                            return;
                        }

                        // Define this tab.
                        if (undefined === maintabs.tabs[tabID]) {
                            maintabs.tabs[tabID] = {
                                label: data.tabs[tabID],
                                content: ''
                            };
                        }

                        section = [];

                        tabFields = forms.parseFields(tabFields, values);

                        // Loop Tab Fields
                        _.each(tabFields, function (field) {
                            // Store the field by id for easy lookup later.
                            form_fields[field.id] = field;

                            // Push rendered fields into the subtab content.
                            section.push(JPCC.templates.field(field));
                        });

                        // Push rendered tab into the tab.
                        if (section.length) {
                            // Push rendered sub tabs into the main tabs if not empty.
                            maintabs.tabs[tabID].content = JPCC.templates.section({
                                fields: section
                            });
                        } else {
                            delete (maintabs.tabs[tabID]);
                        }
                    });

                    if (Object.keys(maintabs.tabs).length) {
                        form = JPCC.templates.tabs(maintabs);
                    }
                }
                else if (Object.keys(data.sections).length) {

                    // Loop Sections
                    _.each(data.fields, function (sectionFields, sectionID) {
                        section = [];

                        section.push(JPCC.templates.field({
                            type: 'heading',
                            desc: data.sections[sectionID] || ''
                        }));

                        sectionFields = forms.parseFields(sectionFields, values);

                        // Loop Tab Section Fields
                        _.each(sectionFields, function (field) {
                            // Store the field by id for easy lookup later.
                            form_fields[field.id] = field;

                            // Push rendered fields into the section.
                            section.push(JPCC.templates.field(field));
                        });

                        // Push rendered sections into the form.
                        form += JPCC.templates.section({
                            fields: section
                        });
                    });
                }
                else {
                    data.fields = forms.parseFields(data.fields, values);

                    // Replace the array with rendered fields.
                    _.each(data.fields, function (field) {
                        // Store the field by id for easy lookup later.
                        form_fields[field.id] = field;

                        // Push rendered fields into the section.
                        section.push(JPCC.templates.field(field));
                    });

                    // Render the section.
                    form = JPCC.templates.section({
                        fields: section
                    });
                }

                if ($container !== undefined && $container.length) {
                    $container
                        .addClass(container_classes.join('  '))
                        .data('form_fields', form_fields)
                        .html(form)
                        .trigger('jp_cc_init');
                }

                return form;

            },
            parseValues: function (values, fields) {
                fields = fields || false

                if (!fields) {
                    return values;
                }

                debugger;

                for (var key in fields) {
                    if (!fields.hasOwnProperty(key)) {
                        continue;
                    }

                    // Measure field value corrections.
                    if (values.hasOwnProperty(key + "_unit")) {
                        values[key] += values[key + "_unit"];
                        delete values[key + "_unit"];
                    }

                    // If the value key is empty and a checkbox set it to false. Then return.
                    if (typeof values[key] === 'undefined') {
                        if (fields[key].type === 'checkbox') {
                            values[key] = false;
                        }
                        continue;
                    }

                    if (fields[key].allow_html && !JPCC.utils.htmlencoder.hasEncoded(values[key])) {
                        values[key] = JPCC.utils.htmlencoder.htmlEncode(values[key]);
                    }
                }

                return values;
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
					dynamic_desc: null,
					size: 'regular',
					classes: [],
					dependencies: '',
					value: null,
					select2: false,
					allow_html: false,
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
					units: {},
					required: false,
					desc_position: 'bottom',
					meta: {},
				}, args);
			}
		},
		selectors: new Selector_Cache(),
		utils: {
			htmlencoder: Encoder,
			convert_meta_to_object: function (data) {
				var converted_data = {},
					element,
					property,
					key;

				for (key in data) {
					if (data.hasOwnProperty(key)) {
						element = key.split(/_(.+)?/)[0];
						property = key.split(/_(.+)?/)[1];
						if (converted_data[element] === undefined) {
							converted_data[element] = {};
						}
						converted_data[element][property] = data[key];
					}
				}
				return converted_data;
			},
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
			},
			convert_hex: function (hex, opacity) {
				if (undefined === hex) {
					return '';
				}
				if (undefined === opacity) {
					opacity = 100;
				}

				hex = hex.replace('#', '');
				var r = parseInt(hex.substring(0, 2), 16),
					g = parseInt(hex.substring(2, 4), 16),
					b = parseInt(hex.substring(4, 6), 16),
					result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
				return result;
			},
			debounce: function (callback, threshold) {
				var timeout;
				return function () {
					var context = this, params = arguments;
					window.clearTimeout(timeout);
					timeout = window.setTimeout(function () {
						callback.apply(context, params);
					}, threshold);
				};
			},
			throttle: function (callback, threshold) {
				var suppress = false,
					clear = function () {
						suppress = false;
					};
				return function () {
					if (!suppress) {
						callback();
						window.setTimeout(clear, threshold);
						suppress = true;
					}
				};
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

				data = data || {};

				if (data.classes !== undefined && Array.isArray(data.classes)) {
					data.classes = data.classes.join(' ');
				}

				// Prepare the meta data for template.
				data = JPCC.templates.prepareMeta(data);

				return _template(data);
			},
			renderInline: function (content, data) {
				var options = {
						evaluate: /<#([\s\S]+?)#>/g,
						interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
						escape: /\{\{([^\}]+?)\}\}(?!\})/g,
						variable: 'data'
					},
					template = _.template(content, null, options);

				return template(data);
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
			tabs: function (data) {
				data = $.extend(true, {}, {
					id: '',
					vertical: true,
					form: true,
					classes: [],
					tabs: {
						general: {
							label: 'General',
							content: ''
						}
					},
					meta: {}
				}, data);

				if (typeof data.classes === 'string') {
					data.classes = [data.classes];
				}

				if (data.form) {
					data.classes.push('jp-cc-tabbed-form');
				}

				data.meta['data-tab-count'] = Object.keys(data.tabs).length;

				data.classes.push(data.vertical ? 'vertical-tabs' : 'horizontal-tabs');

				data.classes = data.classes.join('  ');

				return JPCC.templates.render('jp-cc-tabs', data);
			},
			section: function (args) {
				var data = $.extend(true, {}, {
					classes: [],
					fields: []
				}, args);


				return JPCC.templates.render('jp-cc-field-section', data);
			},
			fieldArgs: function (args) {
				var options = [],
					data = $.extend(true, {}, JPCC.models.field(args));

				if (args.std !== undefined && args.type !== 'checkbox' && (data.value === null || data.value === false)) {
					data.value = args.std;
				}

				if ('string' === typeof data.classes) {
					data.classes = data.classes.split(' ');
				}

				if (args.class !== undefined) {
					data.classes.push(args.class);
				}

				if (args.dependencies !== undefined && typeof args.dependencies === 'object') {
					data.dependencies = JSON.stringify(args.dependencies);
				}

				if (data.required) {
					data.meta.required = true;
					data.classes.push('jp-cc-required');
				}

				if (typeof data.dynamic_desc === 'string' && data.dynamic_desc.length) {
					data.classes.push('jp-cc-field-dynamic-desc');
					data.desc = JPCC.templates.renderInline(data.dynamic_desc, data);
				}

				if (data.allow_html) {
					data.classes.push('jp-cc-field-' + data.type + '--html');
					if ( typeof data.value === 'string' && data.value !== '' && JPCC.utils.htmlencoder.hasEncoded(data.value)) {
						data.value = JPCC.utils.htmlencoder.htmlDecode(data.value);
					}
				}

				switch (args.type) {
				case 'select':
				case 'objectselect':
				case 'postselect':
				case 'taxonomyselect':
					if (data.options !== undefined) {
						_.each(data.options, function (label, value) {
							var selected = false,
								optgroup,
								optgroup_options;

							// Check if the label is an object. If so this is a optgroup and the label is sub options array.
							// NOTE: The value in the case its an optgroup is the optgroup label.
							if (typeof label !== 'object') {

								if (data.value !== null) {
									if (data.multiple && ((typeof data.value === 'string' && data.value == value) || (Array.isArray(data.value) && data.value.indexOf(value) !== -1) || (!Array.isArray(data.value) && typeof data.value === 'object' && Object.keys(data.value).length && data.value[value] !== undefined))) {
										selected = 'selected';
									} else if (!data.multiple && data.value == value) {
										selected = 'selected';
									}
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

								// Swap label & value due to group labels being used as keys.
								optgroup = value;
								optgroup_options = [];

								_.each(label, function (label, value) {
									var selected = false;

									if (data.value !== null) {
										if (data.multiple && ((typeof data.value === 'string' && data.value == value) || (Array.isArray(data.value) && data.value.indexOf(value) !== -1) || (!Array.isArray(data.value) && typeof data.value === 'object' && Object.keys(data.value).length && data.value[value] !== undefined))) {
											selected = 'selected';
										} else if (!data.multiple && data.value == value) {
											selected = 'selected';
										}
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
						data.meta['data-current'] = typeof data.value === 'object' || Array.isArray(data.value) ? JSON.stringify(data.value) : data.value;
					}

					if (data.select2) {
						data.classes.push('jp-cc-field-select2');
						data.classes.push('jpselect2');

						if (data.placeholder) {
							data.meta['data-placeholder'] = data.placeholder;
						}
					}

					break;
				case 'radio':
					if (data.options !== undefined) {
						_.each(data.options, function (label, value) {

							options.push(
								JPCC.templates.prepareMeta({
									label: label,
									value: value,
									meta: {
										checked: data.value === value
									}
								})
							);

						});

						data.options = options;
					}
					break;
				case 'multicheck':
					if (data.options !== undefined) {

						if (data.value === false || data.value === null) {
							data.value = [];
						}

						if (typeof data.value === 'string' && data.value.indexOf(',')) {
							data.value = data.value.split(',');
						}

						if (data.as_array) {
							data.name += '[]';
						}

						_.each(data.options, function (label, value) {

							options.push(
								JPCC.templates.prepareMeta({
									label: label,
									value: value,
									meta: {
										checked: (Array.isArray(data.value) && data.value.indexOf(value) !== -1) || (!Array.isArray(data.value) && typeof data.value === 'object' && Object.keys(data.value).length && data.value[value] !== undefined)
									}
								})
							);

						});

						data.options = options;
					}
					break;
				case 'checkbox':
					switch (typeof data.value) {
					case 'object':
						if (Array.isArray(data.value) && data.value.length === 1 && data.value[0].toString() === '1') {
							data.value = true;
							data.meta.checked = true;
						} else {

						}
						break;
					case 'boolean':
						if (data.value) {
							data.meta.checked = true;
						}
						break;
					case 'string':
						if (data.value === 'true' || data.value === 'yes' || data.value === '1') {
							data.meta.checked = true;
						}
						break;
					case 'number':
						if (parseInt(data.value, 10) === 1 || parseInt(data.value, 10) > 0) {
							data.meta.checked = true;
						}
					}
					break;
				case 'rangeslider':
					// data.meta.readonly = true;
					data.meta.step = data.step;
					data.meta.min = data.min;
					data.meta.max = data.max;
					data.meta['data-force-minmax'] = data.force_minmax.toString();
					break;
				case 'textarea':
					data.meta.cols = data.cols;
					data.meta.rows = data.rows;
					break;
				case 'measure':
					if (typeof data.value === 'string' && data.value !== '') {
						data.number = parseInt(data.value);
						data.unitValue = data.value.replace(data.number, "");
						data.value = data.number;
					} else {
						data.unitValue = null;
					}

					if (data.units !== undefined) {
						_.each(data.units, function (label, value) {
							var selected = false;

							if (data.unitValue == value) {
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

						});

						data.units = options;
					}
					break;
				case 'color':
					if ( typeof data.value === 'string' && data.value !== '') {
						data.meta['data-default-color'] = data.value;
					}
					break;
				case 'license_key':

					data.value = $.extend({
						key: '',
						license: {},
						messages: [],
						status: 'empty',
						expires: false,
						classes: false
					}, data.value);

					data.classes.push('jp-cc-license-' + data.value.status + '-notice');

					if (data.value.classes) {
						data.classes.push(data.value.classes);
					}
					break;
				}

				return data;
			},
			field: function (args) {
				var fieldTemplate,
					data = JPCC.templates.fieldArgs(args);

				fieldTemplate = 'jp-cc-field-' + data.type;

				if (data.type === 'objectselfect' || data.type === 'postselect' || data.type === 'taxonomyselect') {
					fieldTemplate = 'jp-cc-field-select';
				}

				if (!$('#tmpl-' + fieldTemplate).length) {
					console.warn('No field template found for type:' + data.type + ' fieldID: ' + data.id);
					return '';
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
				$( '.jpselect2 select' ).filter( ':not(.jpselect2-initialized)' ).each( function () {
					var $this = $( this ),
						current = $this.data( 'current' ) || $this.val(),
						object_type = $this.data( 'objecttype' ),
						object_key = $this.data( 'objectkey' ),
						object_excludes = $this.data( 'objectexcludes' ) || null,
						options = {
							width: '100%',
							multiple: false,
							dropdownParent: $this.parent(),
						};

					if ( $this.attr( 'multiple' ) ) {
						options.multiple = true;
					}

					if ( object_type && object_key ) {
						options = $.extend( options, {
							ajax: {
								url: ajaxurl,
								dataType: 'json',
								delay: 250,
								data: function ( params ) {
									return {
										s: params.term, // search term
										paged: params.page,
										action: 'jp_cc_object_search',
										object_type: object_type,
										object_key: object_key,
										exclude: object_excludes,
									};
								},
								processResults: function ( data, params ) {
									// parse the results into the format expected by Select2
									// since we are using custom formatting functions we do not need to
									// alter the remote JSON data, except to indicate that infinite
									// scrolling can be used
									params.page = params.page || 1;

									return {
										results: data.items,
										pagination: {
											more: ( params.page * 10 ) < data.total_count,
										},
									};
								},
								cache: true,
							},
							cache: true,
							escapeMarkup: function ( markup ) {
								return markup;
							}, // let our custom formatter work
							maximumInputLength: 20,
							closeOnSelect: ! options.multiple,
							templateResult: JPCC.select2.formatObject,
							templateSelection: JPCC.select2.formatObjectSelection,
						} );
					}

					$this
						.addClass( 'jpselect2-initialized' )
						.jpselect2( options );

					if ( current !== null && current !== undefined ) {

						if ( options.multiple && 'object' !== typeof current && current !== '' ) {
							current = [ current ];
						} else if ( ! options.multiple && current === '' ) {
							current = null;
						}
					} else {
						current = null;
					}

					if ( object_type && object_key && current !== null && ( typeof current === 'number' || current.length ) ) {
						$.ajax( {
							url: ajaxurl,
							data: {
								action: 'jp_cc_object_search',
								object_type: object_type,
								object_key: object_key,
								exclude: object_excludes,
								include: current && current.length ? ( typeof current === 'string' || typeof current === 'number' ) ? [ current ] : current : null,
							},
							dataType: 'json',
							success: function ( data ) {
								$.each( data.items, function ( key, item ) {
									// Add any option that doesn't already exist
									if ( ! $this.find( 'option[value="' + item.id + '"]' ).length ) {
										$this.prepend( '<option value="' + item.id + '">' + item.text + '</option>' );
									}
								} );
								// Update the options
								$this.val( current ).trigger( 'change' );
							},
						} );
					} else if ( current && ( ( options.multiple && current.length ) || ( ! options.multiple && current !== '' ) ) ) {
						$this.val( current ).trigger( 'change' );
					} else if ( current === null ) {
						$this.val( current ).trigger( 'change' );
					}
				} );
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
				return window.jp_cc_conditions_selectlist;
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
					var data = $.extend(true, {}, {
							index: '',
							facets: []
						}, args),
						i;

					data.facets = JPCC.utils.object_to_array(data.facets);

					for (i = 0; data.facets.length > i; i++) {
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

						$('#jp-cc-first-condition')
							.val(null)
							.trigger('change');
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
							this.name = this.name.replace(/conditions\[\d*?\]\[\d*?\]/, "conditions[" + groupIndex + "][" + facetIndex + "]");
							this.id = this.id.replace(/conditions_\d*?_\d*?_/, "conditions_" + groupIndex + "_" + facetIndex + "_");
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
        // Forms
        .on('jp_cc_init  jp_cc_form_check', function () {
            JPCC.forms.init();
        })
        .on('jpCCFieldChanged', '.jp-cc-field', function () {
            var $wrapper = $(this),
                dependent_field_ids = $wrapper.data('jp-cc-field-dependents') || [],
                $fields_with_dependencies = $(),
                i;

            if (!dependent_field_ids || dependent_field_ids.length <= 0) {
                return;
            }

            for (i = 0; i < dependent_field_ids.length; i++) {
                $fields_with_dependencies = $fields_with_dependencies.add('.jp-cc-field[data-id="' + dependent_field_ids[i] + '"]');
            }

            JPCC.forms.checkDependencies($fields_with_dependencies);
        })
        .on('jpCCFieldChanged', '.jp-cc-field-dynamic-desc', function () {
            var $this = $(this),
                $input = $this.find(':input'),
                $container = $this.parents('.jp-cc-dynamic-form:first'),
                val = $input.val(),
                form_fields = $container.data('form_fields') || {},
                field = form_fields[$this.data('id')] || {},
                $desc = $this.find('.jp-cc-desc'),
                desc = $this.data('jp-cc-dynamic-desc');

            switch (field.type) {
                case 'radio':
                    val = $this.find(':input:checked').val();
                    break;
            }

            field.value = val;

            if (desc && desc.length) {
                $desc.html(JPCC.templates.renderInline(desc, field));
            }
        })
        .on('change', '.jp-cc-field-select select', function () {
            $(this).parents('.jp-cc-field').trigger('jpCCFieldChanged');
        })
        .on('click', '.jp-cc-field-checkbox input', function () {
            $(this).parents('.jp-cc-field').trigger('jpCCFieldChanged');
        })
        .on('click', '.jp-cc-field-multicheck input', function () {
            $(this).parents('.jp-cc-field').trigger('jpCCFieldChanged');
        })
        .on('click', '.jp-cc-field-radio input', function (event) {
            var $this = $(this),
                $selected = $this.parents('li'),
                $wrapper = $this.parents('.jp-cc-field');

            $wrapper.trigger('jpCCFieldChanged');

            $wrapper.find('li.jp-cc-selected').removeClass('jp-cc-selected');

            $selected.addClass('jp-cc-selected');
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

			$operand.prop('checked', false).parents('.jp-cc-facet-target, .face-target').removeClass('not-operand-checked');
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