'use strict';

var _ = require('lodash');

// TODO: can all be const?
const util = require('util');
var empty = require('is-empty');

function CommandWrapper(channel) {
    this.channel = channel;
}

CommandWrapper.prototype.startExecHook = function () {
    // console.log("I'm in the precommandhook");
    // slack.send({
    //     text: argv._[0],
    //     channel: '@hamroctopus',
    //     username: 'slack-notify'
    //     // TODO: add picture
    // });
}
CommandWrapper.prototype.endExecHook = function (exit_code) {
    // console.log(`Exit code is ${exit_code}`);
    // slack.send({
    //     text: argv._[0],
    //     channel: '@hamroctopus',
    //     username: 'slack-notify'
    //     // TODO: add picture
    // });
    process.exit(exit_code);
}
CommandWrapper.prototype.exec = function (command) {
    if (empty(command)) {
        return;
    }
    const cmd_array = command.split(/\s+/);
    // console.log("array split to: " + util.inspect(cmd_array));
    const cmd = _.head(cmd_array);
    const args = _.drop(cmd_array);
    // console.log(`Command is: ${util.inspect(cmd)} ${util.inspect(args)}`);

    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args);
    this.startExecHook();

    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    child.on('error', (err) => {
        console.log(err);
    });
    child.on('close', (code) => {
        this.endExecHook(code);
    });
}


function main() {
    var cmd = _.head(argv._);
    var args = _.drop(argv._);

    const command = _.join(argv._, ' ');
    console.log("fake main receives command: " + util.inspect(command));

    var wrapper = new CommandWrapper('hamroctopus');
    wrapper.exec(command);
}



var argv = require('minimist')(process.argv.slice(2));

// console.log("Args are " + util.inspect(argv._));
// console.log("Argv is empty:" + empty(argv._));

if (!empty(argv._)) {
    main(argv._);
}



// //// Slack control
// const slack_incoming_webhook_url =
//       "https://hooks.slack.com/services/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";

// var Slack = require('node-slack');
// var slack = new Slack(slack_incoming_webhook_url);


module.exports = CommandWrapper;
