// jasmine-jquery is not compatible with jquery animations
var no_animation = { hideMode: "basic" };


/*
This test uses the parent mode but does not test that mode per se. It just tests that toggeling works.
*/
describe("toggling works (no matter the searchMode)", function () {


    describe("with a single content", function () {

        beforeEach(function () {
            loadFixtures("toggeling.html");
            var x = $("#expander1").simpleexpand(no_animation);
        });

        it("is collapsed by default", function () {
            expect($('#content1')).toExist();
            expect($('#content1')).not.toBeVisible();
        });

        it("content can be expanded", function () {
            $("#expander1").click();
            expect($('#content1')).toBeVisible();
        });

        it("content can be collapsed again", function () {
            $("#expander1").click();
            $("#expander1").click();
            expect($('#content1')).not.toBeVisible();
        });
    });

    describe("with multiple content", function () {

        beforeEach(function () {
            loadFixtures("toggeling.html");
            $("#expander2").simpleexpand(no_animation);
        });

        it("is collapsed by default", function () {
            expect($('#content2')).toExist();
            expect($('#content2')).not.toBeVisible();
            expect($('#content3')).toExist();
            expect($('#content3')).not.toBeVisible();
        });

        it("content can be expanded", function () {
            $("#expander2").click();
            expect($('#content2')).toBeVisible();
            expect($('#content3')).toBeVisible();
        });

        it("content can be collapsed again", function () {
            $("#expander2").click();
            $("#expander2").click();
            expect($('#content2')).not.toBeVisible();
            expect($('#content3')).not.toBeVisible();
        });
    });


});

// Requires html fixture: parent.html
describe("searchMode: parent", function () {

    var matchedtargets;

    beforeEach(function () {
        loadFixtures("parent mode.html");

        var base = $.fn.simpleexpand.fn.findTargets;
        spyOn($.fn.simpleexpand.fn, 'findTargets').andCallFake(function (a, b, c) {

            matchedtargets = base(a, b, c);
            return matchedtargets;
        });
        
    });

    describe("when expander is sibling of content", function () {

        it("content is found", function () {
            $("#when-expander-is-sibling-of-content #expander1").simpleexpand(no_animation);
            expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
            expect(matchedtargets).toBe('#content1');
        });

    });

    describe("when expander is lower in parent", function () {
        it("content is found", function () {
            $("#when-expander-is-lower-in-parent #expander1").simpleexpand(no_animation);
            expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
            expect(matchedtargets).toBe('#content1');
        });
    });

    describe("when expander is several parents higher", function () {
        it("content is found", function () {
            $("#when-expander-is-several-parents-higher #expander1").simpleexpand(no_animation);
            expect($.fn.simpleexpand.fn.findTargets).toHaveBeenCalled();
            expect(matchedtargets).toBe('#content1');
        });
    });

});


