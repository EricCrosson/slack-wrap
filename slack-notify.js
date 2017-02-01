'use strict';

const _ = require('lodash');
const util = require('util');
const Slack = require('node-slack');

const spawn = require('./spawn.js');

module.exports.wrapCommand = wrapCommand;
function wrapCommand(command) {
    return new Promise((resolve, reject) => {

        const cmd_array = command.split(/\s+/);
        commandStartHook();
        const child = spawn(cmd_array).then(code => {
            commandEndHook(code);
            resolve(code);
        });
    });
}

function commandStartHook() {
    console.log('startexechook')
    // this.slack.send({
    //     text: argv._[0],
    //     channel: '@hamroctopus',
    //     username: 'slack-notify'
    //     // TODO: add picture
    // });
}

function commandEndHook (exit_code, resolve) {
    console.log('END hook')
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

// function main() {
//     var cmd = _.head(argv._);
//     var args = _.drop(argv._);

//     const command = _.join(argv._, ' ');
//     console.log("fake main receives command: " + util.inspect(command));

//     // TODO: parse .rc file
//     const wrapper = new SlackNotify('hamroctopus', "https://hooks.slack.com/services/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");
//     wrapper.exec(command);
// }

// if (!empty(argv._)) {
//     main(argv._);
// }
