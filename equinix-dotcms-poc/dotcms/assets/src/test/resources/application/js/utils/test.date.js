var dateUtil = require('../../../../../../src/main/resources/application/js/utils/date');

describe("Date Util Tests", function() {
    it("Should return the current date in the correct format", function() {
        expect(dateUtil.formatYyyymmdd(new Date())).toMatch(/^\d{4}\d{1,2}\d{1,2}$/);
    });
});