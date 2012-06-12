beforeEach(function () {


    function inArray(array, el) {
        for (var i = array.length; i--; ) {
            if (array[i] === el) {
                return true;
            }
        }
        return false;
    }

    function isEqArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = arr1.length; i--; ) {
            if (!inArray(arr2, arr1[i])) {
                return false;
            }
        }
        return true;
    }

    function toCSV(items) {
        var value = "";
        var first = true;
        $.each(items, function () {

            if (!first) {
                value = value + ", ";
            }
            first = false;

            value = value + this;

        });
        return value;
    }


    this.addMatchers({
        toContainSameItemsAs: function (expected) {

            this.message = function () {

                var actualIds = $.map(this.actual, function (item) {
                    return $(item).attr('id') || "\'unknown id\'"
                });

                actualIds = toCSV(actualIds);

                var expectedIds = $.map(expected, function (item) {
                    return $(item).attr('id') || "\'unknown id\'"
                });

                expectedIds = toCSV(expectedIds);

                return 'expected [' + actualIds + '] to contain same items as [' + expectedIds + ']';
            }
            return isEqArrays(this.actual, expected);
        }
    });
});
