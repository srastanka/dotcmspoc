var stringUtil = require('../../../../../../src/main/resources/application/js/utils/string-extensions');

describe("String Extension Utility Tests", function() {

    beforeAll(function() {
        stringUtil.init();
    });

    it("Should replace all instances of a character in a given string", function() {
        expect("sssoftware".replaceAll("s","d")).toEqual("dddoftware");
    });

    it("Should transform a string to Title Case", function() {
        expect("something".toTitleCase("something")).toEqual("Something");
        expect("something".toTitleCase("something")).not.toEqual("SomeThing");
    });

    it("Should correctly identify if a string ends with a given substring", function() {
       expect("ThisStringEndsWith".endsWith("With")).toBe(true);
       expect("ThisStringDoesntEndWith".endsWith("TheRightThing")).toBe(false);
       expect("ThisStringAlsoDoesntEndWith".endsWith("TheRightThing")).not.toBe(true);
    });

    it("Should format a string correctly", function() {
       expect("Your account balance is {0}".format(1000)) .toEqual("Your account balance is 1000");
    });

});