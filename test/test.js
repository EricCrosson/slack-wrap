var assert = require('assert');
var should = require('should');

const SlackNotify = require('../slack-notify.js');
const wrapper = new SlackNotify('hamroctopus', "https://hooks.slack.com/services/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");

function lowerBound(expected_time) { return expected_time * 0.75; }
function upperBound(expected_time) { return expected_time * 1.25; }

describe('CommandWrapper', function() {
    describe('#exec()', function() {
        it('should do nothing when passed no args', function(done) {
            const start = new Date().getTime();
            wrapper.exec('').then(function(code) {
                const end = new Date().getTime();
                const time = end - start;  // milliseconds
                time.should.be.greaterThanOrEqual(0);
                time.should.be.lessThanOrEqual(15);
                done();
            }).catch(err => done(err));
        });
        it('should execute string passed to it as a command', function(done) {

            const testString = `${__dirname}/bin/simple-wait.sh`;
            const start = new Date().getTime();

            wrapper.exec(testString).then(code => {

                const end = new Date().getTime();
                const time = end - start; // milliseconds
                const expected_time = 100;  // milliseconds

                time.should.be.greaterThan(lowerBound(expected_time));
                time.should.be.lessThan(upperBound(expected_time));
                done();
            }).catch(err => { done(err); });
        });
        it('should pass the executed command all arguments', function(done) {
            const testString = `${__dirname}/bin/simple-wait.sh .5`;
            const start = new Date().getTime();

            wrapper.exec(testString).then(code => {

                const end = new Date().getTime();
                const time = end - start; // milliseconds
                const expected_time = 500;  // milliseconds

                time.should.be.greaterThan(lowerBound(expected_time));
                time.should.be.lessThan(upperBound(expected_time));
                done();
            }).catch(err => { done(err); });
        });
        it('should pass the exit code of the wrapped command', function(done) {
            const testString = `which qwertytrewq`;
            wrapper.exec(testString).then(code => {
                code.should.equal(1);
                done();
            }).catch(err => { done(err); });
        });
        it('should pass additional arguments to the executing command', function(done) {
            const testString = `${__dirname}/bin/simple-wait.sh .2`;
            const start = new Date().getTime();

            wrapper.exec(`${testString}; ${testString}`).then(code => {

                const end = new Date().getTime();
                const time = end - start; // milliseconds
                const expected_time = 400;  // milliseconds

                time.should.be.greaterThan(lowerBound(expected_time));
                time.should.be.lessThan(upperBound(expected_time));
                done();
            }).catch(err => { done(err); });
        });
    });
});
