/*global describe:true, beforeEach:true, loadFixtures:true, expect:true, it:true, loadFixtures:true, spyOn:true */

(function () {
    "use strict";
    describe("simple-expand", function () {

        var base_test_settings = {};

        beforeEach(function () {
            base_test_settings = { 'hideMode': 'basic' };
        });


        /*
        This test uses the parent mode but does not test that mode per se. It just tests that toggeling works.
        */
        describe("when expanding and collapsing targets (independent of the searchMode)", function () {

            describe("with a single target", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                    var x = $("#expander1").simpleexpand(base_test_settings);
                });

                it("is collapsed by default", function () {
                    expect($('#1000')).toExist();
                    expect($('#1000')).not.toBeVisible();
                });

                it("target can be expanded", function () {
                    $("#expander1").click();
                    expect($('#1000')).toBeVisible();
                });

                it("target can be collapsed again", function () {
                    $("#expander1").click();
                    $("#expander1").click();
                    expect($('#1000')).not.toBeVisible();
                });
            });

            describe("with multiple targets", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                    $("#expander2").simpleexpand(base_test_settings);
                });

                it("is collapsed by default", function () {
                    expect($('#2000')).toExist();
                    expect($('#2000')).not.toBeVisible();
                    expect($('#2001')).toExist();
                    expect($('#2001')).not.toBeVisible();
                });

                it("targets can be expanded", function () {
                    $("#expander2").click();
                    expect($('#2000')).toBeVisible();
                    expect($('#2001')).toBeVisible();
                });

                it("targets can be collapsed again", function () {
                    $("#expander2").click();
                    $("#expander2").click();
                    expect($('#2000')).not.toBeVisible();
                    expect($('#2001')).not.toBeVisible();
                });
            });


        });

        // Requires html fixture: parent.html
        describe("when searchMode is 'parent'", function () {

            var matchedtargets;

            beforeEach(function () {

                loadFixtures("parent mode.html");

                var base = $.fn.simpleexpand.fn.findTargets;
                spyOn($.fn.simpleexpand.fn, 'findTargets').andCallFake(function (a, b, c) {

                    matchedtargets = base(a, b, c);
                    return matchedtargets;
                });

            });

            describe("when expander is sibling of target", function () {

                it("target is found", function () {
                    $("#when-expander-is-sibling-of-target .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#1000'));
                });

            });

            describe("when expander is lower in parent than targer", function () {
                it("target is found", function () {
                    $("#when-expander-is-lower-in-parent .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#2000'));
                });
            });

            describe("when target is several parents higher than target", function () {
                it("target is found", function () {
                    $("#when-target-is-several-parents-higher-than-target .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#3000'));
                });
            });

            describe("when expander has multiple targets", function () {
                it("targets are found", function () {
                    $("#when-expander-has-multiple-targets .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#4000').add('#4001').add('#4002'));
                });
            });
        });



        // Requires html fixture: parent.html
        describe("when searchMode is 'absolute'", function () {

            var matchedtargets;

            beforeEach(function () {

                $.extend(base_test_settings, { 'defaultSearchMode': 'absolute' });

                loadFixtures("absolute mode.html");

                var base = $.fn.simpleexpand.fn.findTargets;
                spyOn($.fn.simpleexpand.fn, 'findTargets').andCallFake(function (a, b, c) {

                    matchedtargets = base(a, b, c);
                    return matchedtargets;
                });

            });

            describe("when single match", function () {

                it("target is found", function () {
                    $("#when-expander-target-is-specified-when-single-match .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#2000'));
                });
            });

            describe("when multiple matches", function () {
                it("targets are found", function () {
                    $("#when-expander-target-is-specified-when-multiple-matches .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#3000').add('#3001'));
                });
            });

        });


        // Requires html fixture: parent.html
        describe("when searchMode is 'relative'", function () {

            var matchedtargets;

            beforeEach(function () {

                $.extend(base_test_settings, { 'defaultSearchMode': 'relative' });

                loadFixtures("relative mode.html");

                var base = $.fn.simpleexpand.fn.findTargets;
                spyOn($.fn.simpleexpand.fn, 'findTargets').andCallFake(function (a, b, c) {

                    matchedtargets = base(a, b, c);
                    return matchedtargets;
                });

            });

            describe("when todo", function () {

                it("target is found", function () {
                    $("#todo .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#1000'));
                });
            });
        });
    });
} ());
