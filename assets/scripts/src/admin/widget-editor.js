(function ($) {
    "use strict";

    function which_users() {
        var $this = $(this),
            $item = $this.parents('.widget').eq(0),
            $roles = $item.find('.widget_options-roles');

        if ($this.val() == 'logged_in') {
            $roles.show();
        } else {
            $roles.hide();
        }
    }


    function refresh_all_items() {
        $('.widget_options-which_users select').each(which_users);
    }

    $(document)
        .on('change', '.widget_options-which_users select', which_users)
        .on('widget-updated', refresh_all_items)
        .ready(refresh_all_items);

}(jQuery));