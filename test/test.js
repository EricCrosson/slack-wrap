var assert = require('assert');
var should = require('should');

const runCommand = require('../slack-wrap.js').runCommand;

function lowerBound(expectedTime) { return expectedTime * 0.70; }
function upperBound(expectedTime) { return expectedTime * 1.30; }

/**
 * Wrap the command and return its timing profile.
 */
function profile(command) {
    return new Promise(function(resolve, reject) {
        const start = new Date().getTime();
        runCommand(command).then(function(code) {
            resolve(new Date().getTime() - start);
        }).catch(err => reject(err));
    });
}

describe('runCommand', function() {
    it('should do nothing when passed no args', function(done) {
        profile('').then(elapsedTime => {
            elapsedTime.should.be.within(0, 20);
            done();
        }).catch(err => done(err));
    });
    it('should execute string passed to it as a command', function(done) {
        profile(`${__dirname}/bin/simple-wait.sh`).then(elapsedTime => {
            const expectedTime = 100;  // milliseconds
            elapsedTime.should.be.within(lowerBound(expectedTime),
                                         upperBound(expectedTime));
            done();
        }).catch(err => done(err));
    });
    it('should pass the executed command all arguments', function(done) {
        profile(`${__dirname}/bin/simple-wait.sh .5`).then(elapsedTime => {
            const expectedTime = 500;  // milliseconds
            elapsedTime.should.be.within(lowerBound(expectedTime),
                                         upperBound(expectedTime));
            done();
        }).catch(err => done(err));
    });
    it('should pass the exit code of the wrapped command', function(done) {
        const testString = `which qwertytrewq`;
        runCommand(testString).then(code => {
            code.should.equal(1);
            done();
        }).catch(err => { done(err); });
    });
    it('should execute complex commands', function(done) {
        const testString = `${__dirname}/bin/simple-wait.sh 0.2`;
        profile(`${testString}; ${testString}`).then(elapsedTime => {
            const expectedTime = 400;  // milliseconds
            elapsedTime.should.be.within(lowerBound(expectedTime),
                                         upperBound(expectedTime));
            done();
        }).catch(err => done(err));
    });
});
