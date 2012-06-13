/*global describe:true, beforeEach:true, loadFixtures:true, expect:true, it:true, loadFixtures:true, spyOn:true */

(function () {
    "use strict";
    describe("simple-expand", function () {

        var base_test_settings = {};

        var matchedtargets;

        var mockFindTargets = function () {
            var base = $.fn.simpleexpand.fn.findTargets;
            spyOn($.fn.simpleexpand.fn, 'findTargets').andCallFake(function (a, b, c) {
                matchedtargets = base(a, b, c);
                return matchedtargets;
            });
        };

        beforeEach(function () {
            // default hideMode is fadeToggle but that is incompatible with jasmine-jquery.
            base_test_settings = { 'hideMode': 'basic' };
        });

        //This test uses the default parent mode but does not test that mode per se. It just tests that toggeling works.
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

            beforeEach(function () {
                loadFixtures("parent mode.html");
                mockFindTargets();
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

            beforeEach(function () {
                $.extend(base_test_settings, { 'defaultSearchMode': 'absolute' });
                loadFixtures("absolute mode.html");
                mockFindTargets();
            });

            describe("when single match", function () {

                it("target is found", function () {
                    $("#when-single-match .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#2000'));
                });
            });

            describe("when multiple matches", function () {
                it("targets are found", function () {
                    $("#when-multiple-matches .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#3000').add('#3001'));
                });
            });

        });

        // Requires html fixture: parent.html
        describe("when searchMode is 'relative'", function () {

            beforeEach(function () {
                $.extend(base_test_settings, { 'defaultSearchMode': 'relative' });
                loadFixtures("relative mode.html");
                mockFindTargets();
            });

            describe("when single match", function () {

                it("target is found", function () {
                    $("#when-single-match .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#2000'));
                });
            });

            describe("when multiple matches", function () {

                it("targets are found", function () {
                    $("#when-multiple-matches .expander1").simpleexpand(base_test_settings);
                    expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
                    expect(matchedtargets).toContainSameItemsAs($('#3000').add('#3001'));
                });
            });
        });

        // Requires html fixture: throwOnMissingTarget.html
        describe("when throwOnMissingTarget is 'true'", function () {

            beforeEach(function () {
                $.extend(base_test_settings, { 'throwOnMissingTarget': true });
                loadFixtures("throwOnMissingTarget.html");
            });

            it("exception is thrown", function () {
                expect(function () {
                    $("#missing-target .expander1").simpleexpand(base_test_settings);
                }).toThrow(new Error("simple-expand: Targets not found"));
            });
        });

        // Requires html fixture: throwOnMissingTarget.html
        describe("when throwOnMissingTarget is 'false'", function () {

            beforeEach(function () {
                $.extend(base_test_settings, { 'throwOnMissingTarget': false });
                loadFixtures("throwOnMissingTarget.html");
            });

            it("error is silent", function () {
                expect(function () {
                    $("#missing-target .expander1").simpleexpand(base_test_settings);
                }).not.toThrow();
            });
        });

    });
} ());
