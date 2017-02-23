'use strict';

const os = require('os');

const _ = require('lodash');
const findup = require('findup');
const Slack = require('node-slack');
const date = require('date-and-time');

const spawn = require('./spawn.js');

var rc = {};
var slack;

function findRcFile() {
    const rcfilename = '.slack-wrap.json';
    let rcfile;
    try {
        let rcdir = findup.sync(__dirname, rcfilename);
        rcfile = `${rcdir}/${rcfilename}`;
    } catch(e) {
        rcfile = false;
    }
    return rcfile;
}

module.exports.runCommand = runCommand;
// TODO: document that arg is optional, for tests
function runCommand(command) {
    if (typeof command !== 'undefined') {
        rc['command'] = command;
    }

    return new Promise((resolve, reject) => {
        spawn(rc.command.split(/\s+/)).then(code => {
            resolve(code);
        }).catch(e => reject(e));
    });
}

module.exports.wrapCommand = wrapCommand;
function wrapCommand(command) {
    return new Promise((resolve, reject) => {
        let rcfile = findRcFile();
        if (!rcfile) { reject('could not find rc file'); }
        rc = require(rcfile);
        rc["command"] = command;
        slack = new Slack(rc.webhook_url);

        commandStartHook();
        process.on('SIGINT', function() {
            const msg = `Canceled: \`${command}\` on \`${os.hostname()}\``;
            slackSync(msg).then(function() {
                process.exit(-1);
            }).catch(e => reject(e));
        });

        runCommand().then(code => {
            if (code != null) {
                commandEndHook(code);
            }
        }).catch(e => reject(e));
    });
}

function commandStartHook() {
    let now = new Date();
    const msg = `Action invoked on \`${os.hostname()}\` at ` +
          `${date.format(now, 'HH:mm:ss')}: \`${rc.command}\``;
    slackAsync(msg, rc);
}

function commandEndHook(exit_code) {
    const msg = `\`${rc.command}\` completed on ` +
          `\`${os.hostname()}\` with exit code \`${exit_code}\``;
    slackAsync(msg, rc);
}

function slackAsync(msg) {
    slack.send({
        text: msg,
        channel: rc.channel,
        username: rc.username
    });
}

function slackSync(msg) {
    return new Promise(function(resolve, reject) {
        resolve(
            slack.send({
                text: msg,
                channel: rc.channel,
                username: rc.username
            }));
    });
}
