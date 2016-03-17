/*
 * jQuery UI Virtual Keyboard Navigation v1.2 for Keyboard v1.8.14+ only
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to navigate
 * the virtual keyboard keys using the arrow, page, home and end keys
 * Using this extension WILL prevent keyboard navigation inside of all
 * input and textareas
 *
 * Requires:
 *  jQuery
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .addNavigation();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .addNavigation();    // this keyboard extension
 * 
 */
/*jshint browser:true, jquery:true, unused:false */
(function ($) {
    "use strict";
    $.keyboard = $.keyboard || {};

    $.keyboard.navigationKeys = {
        // all keys
        toggle: KEY_CODES.RBIKEYBOARD_TOGGLE, // toggle key; F1 = 112 (event.which value for function 1 key)
        enter: KEY_CODES.RBIKEYBOARD_ENTER,
        pageup: KEY_CODES.RBIKEYBOARD_PAGEUP,
        pagedown: KEY_CODES.RBIKEYBOARD_PAGEDOWN,
        end: KEY_CODES.RBIKEYBOARD_END,
        home: KEY_CODES.RBIKEYBOARD_HOME,
        left: KEY_CODES.RBIKEYBOARD_LEFT,
        up: KEY_CODES.RBIKEYBOARD_UP,
        right: KEY_CODES.RBIKEYBOARD_RIGHT,
        down: KEY_CODES.RBIKEYBOARD_DOWN

    };

    var LastKeyPosition = {
        lastkey: 'this'
    };

    $.fn.addNavigation = function (options) {

        return this.each(function () {
            // make sure a keyboard is attached

            var o, k, base = $(this).data('keyboard'),
                defaults = {

                    position: [0, 0],     // set start position [row-number, key-index]
                    toggleMode: false,     // true = navigate the virtual keyboard, false = navigate in input/textarea

                    focusClass: 'hasFocus' // css class added when toggle mode is on
                };
            if (!base) { return; }

            base.navigation_options = o = $.extend({}, defaults, options);
            base.navigation_keys = k = $.extend({}, $.keyboard.navigationKeys);
            // save navigation settings - disabled when the toggled
            base.saveNav = [base.options.tabNavigation, base.options.enterNavigation];
            base.allNavKeys = $.map(k, function (v, i) { return v; });

            // Setup
            base.navigation_init = function () {

                base.$keyboard[(o.toggleMode) ? 'addClass' : 'removeClass'](o.focusClass)
                    .find('.ui-keyboard-keyset:visible')
                    .find('.ui-keyboard-button[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
                    .addClass('ui-state-hover');

                base.$preview
                .unbind('keydown.keyboardNav')
                .bind('keydown.keyboardNav', function (e) {
                    return base.checkKeys(e.which);
                });

            };

            base.checkKeys = function (key, disable) {
                var k = base.navigation_keys;
                if (key === k.toggle || disable) {
                    o.toggleMode = (disable) ? false : !o.toggleMode;
                    base.options.tabNavigation = (o.toggleMode) ? false : base.saveNav[0];
                    base.options.enterNavigation = (o.toggleMode) ? false : base.saveNav[1];
                }
                base.$keyboard[(o.toggleMode) ? 'addClass' : 'removeClass'](o.focusClass);
                if (o.toggleMode && key === k.enter) {
                    base.$keyboard
                        .find('.ui-keyboard-keyset:visible')
                        .find('.ui-keyboard-button[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
                        .trigger('repeater.keyboard');
                    return false;
                }
                if (o.toggleMode && $.inArray(key, base.allNavKeys) >= 0) {
                    base.navigateKeys(key);
                    return false;
                }
            };

            base.navigateKeys = function (key, row, indx) {
            	 o.position = lastKeyPressed;
                indx = indx || o.position[1];
                row = row || o.position[0];
                var vis = base.$keyboard.find('.ui-keyboard-keyset:visible'),
                    maxRow = vis.find('.ui-keyboard-button-endrow').length - 1,
                    maxIndx = vis.find('.ui-keyboard-button[data-pos^="' + row + ',"]').length - 1,
                    k = base.navigation_keys;

                // code for disabling focus on empty keyboard






                switch (key) {
                    case k.pageup: row = 0; break; // pageUp
                    case k.pagedown: row = maxRow; break; // pageDown
                    case k.end: indx = maxIndx; break; // End
                    case k.home: indx = 0; break; // Home
                    case k.left:
                        if (row == 2 && indx == 2 || row == 3 && indx == 14 || row == 2 && indx == 14)
                            indx -= 1;
                        if (row == 3 && indx == 3)
                            indx -= 2;
                        if (row == 4 && indx == 7)
                            indx -= 1;

			//for circular navigation
                        if (indx == 0 && (row == 0 || row == 1 || row == 2 || row == 3))
                            indx = 15;
			//for circular navigation
                        if (row == 4 && indx == 0)
                            indx = 9;

                        indx += (indx > 0) ? -1 : 0;
                        break; // Left
                    case k.up:
                        if (row == 4 && indx == 1)
                            indx += 2;

                        if (row == 4 && indx == 2)
                            indx += 1;

                        if (row == 4 && indx == 5)
                            indx = 10;

                        if (row == 4 && indx == 7)
                            indx = 12;

                        if (row == 4 && indx == 8)
                            indx = 14;

                        row += (row > 0) ? -1 : 0; break; // Up
                    case k.right:
                        if (row == 3 && indx == 12 || row == 2 && indx == 12 || row == 2 && indx == 0)
                            indx += 1;

                        if (row == 3 && indx == 0)
                            indx += 2;

                        if (row == 4 && indx == 5)
                            indx += 1;

			//for circular navigation
                        if (indx == 14 && (row == 0 || row == 1 || row == 2 || row == 3))
                            indx = -1;
			//for circular navigation
                        if (row == 4 && indx == 8)
                            indx = -1;

                        indx += 1;
                        break; // Right
                    case k.down:
                        if (row == 1 && indx == 1)
                            row += 2;

                        if (row == 1 && indx == 13) {
                            row += 2; indx = 12;
                        }

                        if (row == 2 && indx == 2)
                            indx += 2;

                        if (row == 3 && (indx == 2 || indx == 5 || indx == 6 || indx == 7 || indx == 8 || indx == 9))
                            indx = 4;

                        if (row == 3 && (indx == 10 || indx == 11))
                            indx = 5;

                        if (row == 3 && (indx == 12))
                            indx = 7;

                        row += (row + 1 > maxRow) ? 0 : 1; break; // Down
                }


                // get max index of new row
                maxIndx = vis.find('.ui-keyboard-button[data-pos^="' + row + ',"]').length - 1;
                if (indx > maxIndx) { indx = maxIndx; }
                LastKeyPosition.lastkey = 'hello from keyboard event';
                vis.find('.ui-state-hover').removeClass('ui-state-hover');
                vis.find('.ui-keyboard-button[data-pos="' + row + ',' + indx + '"]').addClass('ui-state-hover');
                o.position = [row, indx];
                lastKeyPressed = o.position;
            };

            // visible event is fired before this extension is initialized, so check!
            if (base.options.alwaysOpen && base.isVisible) {
                base.$keyboard.find('.ui-state-hover').removeClass('ui-state-hover');
                base.navigation_init();
            }
            // capture and simulate typing
            base.$el
                .bind('visible.keyboard', function (e) {
                    base.$keyboard.find('.ui-state-hover').removeClass('ui-state-hover');
                    base.navigation_init();
                })
                .bind('inactive.keyboard hidden.keyboard', function (e) {
                    base.checkKeys(e.which, true); // disable toggle mode & revert navigation options
                })
                .bind('navigate navigateTo', function (e, row, indx) {
                    // no row given, check if it's a key name
                    row = isNaN(row) ? row.toLowerCase() : row;
                    if (base.navigation_keys.hasOwnProperty(row)) {
                        base.checkKeys(base.navigation_keys[row]);
                    } else {
                        base.navigateKeys(null, row, indx);
                    }
                });

        });
    };
})(jQuery);