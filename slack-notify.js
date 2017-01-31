'use strict';

const _ = require('lodash');

const util = require('util');
const Slack = require('node-slack');

const spawn = require('./spawn.js');

function CommandWrapper(channel, incoming_webhook_url) {

    this.slack = new Slack(incoming_webhook_url);
    this.channel = channel;
}

CommandWrapper.prototype.exec = function (command) {
    function startExecHook() {
        // slack.send({
        //     text: argv._[0],
        //     channel: '@hamroctopus',
        //     username: 'slack-notify'
        //     // TODO: add picture
        // });
    }
    function endExecHook (exit_code, resolve) {
        // slack.send({
        //     text: argv._[0],
        //     channel: '@hamroctopus',
        //     username: 'slack-notify'
        //     // TODO: add picture
        // });
        // resolve(exit_code)
        // TODO: ensure this happens
        // process.exit(exit_code);
    }
    return new Promise(function(resolve, reject) {
        const cmd_array = command.split(/\s+/);
        startExecHook();
        const child = spawn(cmd_array).then(function(code) {
            resolve(code);
        });
    });
}


function main() {
    var cmd = _.head(argv._);
    var args = _.drop(argv._);

    const command = _.join(argv._, ' ');
    console.log("fake main receives command: " + util.inspect(command));

    // TODO: parse .rc file
    const wrapper = new SlackNotify('hamroctopus', "https://hooks.slack.com/services/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");
    wrapper.exec(command);
}



// console.log("Args are " + util.inspect(argv._));
// console.log("Argv is empty:" + empty(argv._));

// if (!empty(argv._)) {
//     main(argv._);
// }



// //// Slack control
// const slack_incoming_webhook_url =
//       "https://hooks.slack.com/services/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";

// var Slack = require('node-slack');
// var slack = new Slack(slack_incoming_webhook_url);


module.exports = CommandWrapper;
