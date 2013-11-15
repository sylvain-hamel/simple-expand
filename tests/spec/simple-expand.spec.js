/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" />
/// <reference path="../lib/jasmine-1.2.0/jasmine.js" />
/// <reference path="../../src/simple-expand.js" />
/*global window:false, SimpleExpand:false, $:false, describe:true, beforeEach:true, afterEach:true, loadFixtures:true, expect:true, it:true, loadFixtures:true, spyOn:true */

(function () {
    "use strict";
    describe("simple-expand", function () {

        var base_test_settings = {};

        var matchedtargets;
        var simpleexpand;

        var mockFindTargets = function () {
            var base = simpleexpand.findTargets;
            spyOn(simpleexpand, 'findTargets').andCallFake(function (a, b, c) {
                matchedtargets = base(a, b, c);
                return matchedtargets;
            });
        };

        beforeEach(function () {
            // default hideMode is fadeToggle but that is incompatible with jasmine-jquery.
            base_test_settings = { 'hideMode': 'basic' };
            simpleexpand = new SimpleExpand();
        });

        //This test uses the default parent mode but does not test that mode per se. It just tests that toggeling works.
        describe("when expanding and collapsing targets (independent of the searchMode)", function () {

            describe("with a single target", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                    simpleexpand.activate($("#expander1"), base_test_settings);
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

            describe("with a single target expanded by default", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                    simpleexpand.activate($("#expander3"), base_test_settings);
                });

                it("is expanded by default", function () {
                    expect($('#3000')).toExist();
                    expect($('#3000')).toBeVisible();
                });

                it("target can be collapsed", function () {
                    $("#expander3").click();
                    expect($('#3000')).not.toBeVisible();
                });

                it("target can be expanded again", function () {
                    $("#expander3").click();
                    $("#expander3").click();
                    expect($('#3000')).toBeVisible();
                });

            });

            describe("with multiple targets", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                    simpleexpand.activate($("#expander2"), base_test_settings);
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

        describe("search modes", function () {

            // Requires html fixture: parent.html
            describe("when searchMode is 'parent'", function () {

                beforeEach(function () {
                    loadFixtures("parent mode.html");
                    mockFindTargets();
                });

                describe("when expander is sibling of target", function () {

                    it("target is found", function () {
                        simpleexpand.activate($("#when-expander-is-sibling-of-target .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
                        expect(matchedtargets).toContainSameItemsAs($('#1000'));
                    });

                });

                describe("when expander is lower in parent than targer", function () {
                    it("target is found", function () {
                        simpleexpand.activate($("#when-expander-is-lower-in-parent .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
                        expect(matchedtargets).toContainSameItemsAs($('#2000'));
                    });
                });

                describe("when target is several parents higher than target", function () {
                    it("target is found", function () {
                        simpleexpand.activate($("#when-target-is-several-parents-higher-than-target .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
                        expect(matchedtargets).toContainSameItemsAs($('#3000'));
                    });
                });

                describe("when expander has multiple targets", function () {
                    it("targets are found", function () {
                        simpleexpand.activate($("#when-expander-has-multiple-targets .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
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
                        simpleexpand.activate($("#when-single-match .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
                        expect(matchedtargets).toContainSameItemsAs($('#2000'));
                    });
                });

                describe("when multiple matches", function () {
                    it("targets are found", function () {
                        simpleexpand.activate($("#when-multiple-matches .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
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
                        simpleexpand.activate($("#when-single-match .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
                        expect(matchedtargets).toContainSameItemsAs($('#2000'));
                    });
                });

                describe("when multiple matches", function () {

                    it("targets are found", function () {
                        simpleexpand.activate($("#when-multiple-matches .expander1"), base_test_settings);
                        expect(simpleexpand.findTargets).toHaveBeenCalled();
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
                        simpleexpand.activate($("#missing-target .expander1"), base_test_settings);
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
                        simpleexpand.activate($("#missing-target .expander1"), base_test_settings);
                    }).not.toThrow();
                });
            });

        });

        describe("hideMode", function () {

            describe("when hideMode is a function", function () {

                beforeEach(function () {
                    loadFixtures("toggeling.html");
                });

                it("calls the function with 3 params", function () {

                    var capturedexpander;
                    var capturedcontent;
                    var capturedexpanded;

                    var callback = function (expander, content, expanded) {
                        capturedexpander = expander;
                        capturedcontent = content;
                        capturedexpanded = expanded;
                    };

                    simpleexpand.activate($("#expander1"), { 'hideMode': callback });

                    $("#expander1").click();
                    
                    expect(capturedexpander).toBeDefined();
                    expect(capturedcontent).toBeDefined();
                    expect(capturedexpanded).toBeDefined();

                });
            });
        });

        // Tests for keeping the expand/collapsed state between sessions. For these tests to pass, SpecRunner.html must
        // be served via an http server because cookies cannot be set for file://
        describe("keepStateInCookie enabled", function () {

            beforeEach(function () {
                $.extend(base_test_settings, { 'keepStateInCookie': true });
            });

            describe("when cookie library is not defined", function () {
                it("it throws an error", function () {
                    $.cookie = undefined;
                    expect(function () {
                        simpleexpand.activate($("12345"), base_test_settings);
                    }
                    ).toThrow(new Error("simple-expand: keepStateInCookie option requires $.cookie to be defined."));
                });
            });

            describe("when cookie library is defined", function () {

                beforeEach(function () {
                    loadFixtures("cookies.html");
                    $.extend(base_test_settings, { 'keepStateInCookie': true, 'cookieName':'simple-expand-unit-test' });
                    $.cookie('simple-expand-unit-test', null, { raw: true, path:window.location.pathname } );
                });

                afterEach(function () {
                    $.cookie('simple-expand-unit-test', null, { raw: true, path:window.location.pathname } );
                });

                it("it does not throw an error", function () {
                    $.cookie = function function_name () {};
                    simpleexpand.activate($("12345"), base_test_settings);
                });

                describe("when expander with an Id is expanded", function () {
                    it("it saves state to cookie", function () {
                        simpleexpand.activate($("#expander1"), base_test_settings);
                        $("#expander1").click();
                        var cookie = simpleexpand.readCookie();
                        expect(cookie.expander1).toEqual(true);
                    });
                });

                describe("when expander with an Id is collapsed", function () {
                    it("it saves state to cookie", function () {
                        simpleexpand.activate($("#expander1"), base_test_settings);
                        $("#expander1").click(); //expand
                        $("#expander1").click(); //collapse
                        var cookie = simpleexpand.readCookie();
                        expect(cookie.expander1).toEqual(false);
                    });
                });

                describe("when expander without an Id is expanded", function () {
                    it("it does not save state to cookie", function () {
                        simpleexpand.activate($(".no-id"), base_test_settings);
                        $(".no-id").click(); //expand
                        
                        //no assertion; just proves it does not throw an error.
                    });
                });

                describe("when expander without an Id is collapsed", function () {
                    it("it does not save state to cookie", function () {
                        simpleexpand.activate($(".no-id"), base_test_settings);
                        $(".no-id").click(); //expand
                        $(".no-id").click(); //collapse
                        
                        //no assertion; just proves it does not throw an error.
                    });
                });            

                describe("when plug-in hides elements at starts", function () {

                    beforeEach(function () {
                        $.cookie('simple-expand-unit-test', JSON.stringify({
                                "expander2":false,
                                "expander3":true,
                                "expander5":false
                            }
                        ), { raw: true, path:window.location.pathname });
                        simpleexpand.activate($(".group1"), base_test_settings);
                    });

                    it("it hides target if expander has no cookie value", function () {
                        expect($('#1000')).not.toBeVisible();
                    });

                    it("it show target if expander has no cookie value but element has the expanded class", function () {
                        expect($('#4000')).toBeVisible();
                    });

                    it("it hides target if expander has 'false' cookie value", function () {
                        expect($('#2000')).not.toBeVisible();
                    });

                    it("it hides target if expander has 'false' cookie value even if element has the expanded class", function () {
                        expect($('#5000')).not.toBeVisible();
                    });

                    it("show targets if expander has 'true' cookie value", function () {
                        expect($('#3000')).toBeVisible();
                    });
                });
            });
        });
    });
} ());
