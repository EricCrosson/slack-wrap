var assert = require('assert');
var should = require('should');

var trila = require('../trila.js');

function lowerBound(expected_time) {
    const expectation = expected_time * 0.75;
    console.log(`lowerBound: ${expectation}`);
    return expectation;
}
function upperBound(expected_time) {
    const expectation = expected_time * 1.25;
    console.log(`upperBound: ${expectation}`);
    return expectation;
}

describe('CommandWrapper', function() {
    describe('#exec()', function() {
        it('should do nothing when passed no args', function() {
            var wrapper = new trila('hamroctopus');
            const start = new Date().getTime();
            wrapper.exec();
            const end = new Date().getTime();
            const time = end - start;  // milliseconds
            time.should.be.greaterThanOrEqual(0);
            time.should.be.lessThanOrEqual(10);
        });
        it('should execute the command asynchronously', function() {
            var wrapper = new trila('hamroctopus');
            const start = new Date().getTime();
            wrapper.exec(`${__dirname}/bin/simple-wait.sh`);
            const end = new Date().getTime();
            const time = end - start;  // milliseconds
            const expected_time = 10;  // milliseconds
            time.should.be.lessThan(expected_time);
        });
        it('should execute string passed to it as a command', function() {
            var wrapper = new trila('hamroctopus');
            const test_string = `${__dirname}/bin/simple-wait.sh`;
            console.log("From tester: test string is " + test_string);

            const start = new Date().getTime();
            wrapper.exec(test_string);
            // FIXME: wait for the callback
            const end = new Date().getTime();

            const time = end - start; // milliseconds
            const expected_time = 10;  // milliseconds

            time.should.be.greaterThan(lowerBound(expected_time));
            time.should.be.lessThan(upperBound(expected_time));
        });
        xit('should pass the executed command all arguments', function() {
            var wrapper = new trila('hamroctopus');
            wrapper.exec(`${__dirname}/bin/simple-wait.sh 1`);
        });
        xit('should pass the exit code of the wrapped command', function() {

            exit_code.should.equal(0);
        });
        xit('should pass additional arguments to the executing command', function() {
            var wrapper = new trila();
            var start = new Date().getTime();
            wrapper.exec(`bash ${__dirname}/bin/simple-wait 0.005`);
            var end = new Date().getTime();
            const time = end - start;
            const expected_time = 5;  // milliseconds
            time.should.be.greaterThan(expected_time);
            time.should.be.lessThan(upperBoundExpectedTime(expected_time));
        });
    });

    // describe('#indexOf()', function() {
    //     // pending test below
    //     it('should return -1 when the value is not present');
    // });
});
