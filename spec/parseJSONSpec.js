// test cases are described in fixtures.js
describe('parseJSON', function () {

  it('should match the result of calling JSON.parse', function () {
    parseableStrings.forEach(function (test) {
      var result = parseJSON(test);
      var expected = JSON.parse(test);
      var equality = _.isEqual(result, expected);
      expect(equality).to.equal(true);
    });
  });

  it('should throw an error for invalid stringified JSON', function () {
    unparseableStrings.forEach(function (test) {
      var fn = function () {
        parseJSON(test);
      };
      expect(fn).to.throw(SyntaxError);
    });
  });

});