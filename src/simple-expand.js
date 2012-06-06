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
    $.fn.simpleexpand = function (options) {

        var settings = $.extend({

            // hideMode
            // -----------
            // Specifies method to hide the content element. 
            // Default: fadeToggle.
            //
            // Values:
            // - fadeToggle: Use jquery.fadeToggle()
            // - css       : relies on user provided css to show/hide. you can defines classes for "collapsed" and "expanded" classes.
            //  
            // If un an unknown value is specified, the plug-in reverts to "css".
            'hideMode': 'fadeToggle'


        }, options);


        // See this question to better understand what this does. http://stackoverflow.com/questions/10902077/how-to-select-children-elements-but-only-one-level-deep-with-jquery
        var findLevelOneDeep = function (parent, filterSelector, stopAtSelector) {
            return parent.find(filterSelector).filter(function () {
                return !$(this).parentsUntil(parent, stopAtSelector).length;
            });
        };

        this.each(function () {
            var that = $(this);

            // Find all "content" elements to affect. Don't dig into sub .content elements
            var contents = findLevelOneDeep(that, ".content", ".content");

            if (settings.hideMode === "fadeToggle") {
                contents.hide();
            }
            that.removeClass("expanded").addClass("collapsed");

            // Find all "expander" elements to affect. Don't dig into sub .content elements.
            var expanders = findLevelOneDeep(that, ".expander", ".content");
            expanders.click(function () {
                if (that.hasClass("expanded")) {
                    that.toggleClass("collapsed expanded");
                }
                else {
                    that.toggleClass("expanded collapsed");
                }
                if (settings.hideMode === "fadeToggle") {
                    contents.fadeToggle(150);
                }
            });
        });
        return this;
    };
}());


