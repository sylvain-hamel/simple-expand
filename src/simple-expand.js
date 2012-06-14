/* 
===============================================================
jQuery plugin to expand/collapse a content element when a 
expander element is clicked. When expanding/collapsing the plug-in 
also toggles a class on the element.
See https://github.com/redhotsly/simple-expand
===============================================================
Copyright (C) 2012 Sylvain Hamel

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
===============================================================
*/
(function () {
    "use strict";

    function PlugIn() {

        var that = this;

        that.defaults = {

            // hideMode
            // -----------
            // Specifies method to hide the content element.
            //
            // Default: fadeToggle
            //
            // Values:
            // - fadeToggle: Use jquery.fadeToggle()
            // - basic: Use jquery.toggle()
            // - css: relies on user provided css to show/hide. you can defines
            //   classes for "collapsed" and "expanded" classes.
            //
            // If un an unknown value is specified, the plug-in reverts to "css".
            'hideMode': 'fadeToggle',

            // searchMode
            // -----------
            // Specifies the defaut value for  data-expander-target-search
            // when none is specified on the expander element.
            //
            // Default: parent
            //
            // Values:
            // - parent: go up the expander's parents hierarchy searching 
            //           each parent's childens looking for a target
            //
            // - absolute : finds a target globally in the document (useful when 
            //              matching an id)
            //
            // - relative : finds a target nested inside the expander
            //
            // If un an unknown value is specified, no targets will be found.
            'defaultSearchMode': 'parent',

            // defaultTarget
            // -----------
            // Specifies the defaut value for data-expander-target when
            // none is specified on the expander element.
            //
            // Default: .content
            'defaultTarget': '.content',

            // throwOnMissingTarget
            // -----------
            // Specifies whether the plug-in throws an exception if it
            // cannot find a target for the expander 
            //
            // Default: true
            'throwOnMissingTarget': true
        };

        that.settings = {};
        $.extend(that.settings, that.defaults);


        // Search in the children of the 'parent' element for an element that matches 'filterSelector'
        // but don't search deeper if a 'stopAtSelector' element is met.
        //     See this question to better understand what this does.
        //     http://stackoverflow.com/questions/10902077/how-to-select-children-elements-but-only-one-level-deep-with-jquery
        that.findLevelOneDeep = function (parent, filterSelector, stopAtSelector) {
            return parent.find(filterSelector).filter(function () {
                return !$(this).parentsUntil(parent, stopAtSelector).length;
            });
        };


        // Hides targets
        that.hideTargets = function (targets) {

            if (that.settings.hideMode === "fadeToggle") {
                targets.hide();
            } else if (that.settings.hideMode === "basic") {
                targets.hide();
            }

        };

        // Toggles the targets and sets the 'collapsed' or 'expanded'
        // class on the expander
        that.toggle = function (expander, targets) {
            if (expander.hasClass("expanded")) {
                expander.toggleClass("collapsed expanded");
            }
            else {
                expander.toggleClass("expanded collapsed");
            }

            if (that.settings.hideMode === "fadeToggle") {
                targets.fadeToggle(150);
            } else if (that.settings.hideMode === "basic") {
                targets.toggle();
            }

            // prevent default to stop browser from scrolling to: href="#"
            return false;
        };

        // returns the targets for the given expander
        that.findTargets = function (expander, searchMode, targetSelector) {
            // find the targets using the specified searchMode
            var targets = [];
            if (searchMode === "absolute") {
                targets = $(targetSelector);
            }
            else if (searchMode === "relative") {
                targets = that.findLevelOneDeep(expander, targetSelector, targetSelector);
            }
            else if (searchMode === "parent") {

                // Search the expander's parents recursively until targets are found.
                var parent = expander.parent();
                do {
                    targets = that.findLevelOneDeep(parent, targetSelector, targetSelector);

                    // No targets found, prepare for next iteration...
                    if (targets.length === 0) {
                        parent = parent.parent();
                    }
                } while (targets.length === 0 && parent.length !== 0);
            }
            return targets;
        };

        that.activate = function (jquery, options) {
            $.extend(that.settings, options);

            // Plug-in entry point
            //
            // For each expander:
            //    search targets
            //    hide targets
            //    register to targets' click event to toggle them on click
            jquery.each(function () {
                var expander = $(this);

                var targetSelector = expander.attr("data-expander-target") || that.settings.defaultTarget;
                var searchMode = expander.attr("data-expander-target-search") || that.settings.defaultSearchMode;

                var targets = that.findTargets(expander, searchMode, targetSelector);

                // no elements match the target selector
                // there is nothing we can do
                if (targets.length === 0) {
                    if (that.settings.throwOnMissingTarget) {
                        throw "simple-expand: Targets not found";
                    }
                    return this;
                }

                // set initial style
                expander.removeClass("expanded").addClass("collapsed");

                // start with all targets hidden
                that.hideTargets(targets);

                // hook the click on the expander
                expander.click(function () {
                    return that.toggle(expander, targets);
                });
            });
        };
    }

    var instance = new PlugIn();

    $.fn.simpleexpand = function (options) {
        instance.activate(this, options);
        return this;
    };

    // expose plugin publicly for unit testing
    $.fn.simpleexpand.fn = instance;

} ());
