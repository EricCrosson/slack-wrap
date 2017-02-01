'use strict';

const os = require('os');

const _ = require('lodash');
const findup = require('findup');
const Slack = require('node-slack');
const date = require('date-and-time');

const spawn = require('./spawn.js');

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
function runCommand(command) {
    return new Promise((resolve, reject) => {
        spawn(command.split(/\s+/)).then(code => {
            resolve(code);
        }).catch(e => {
            reject(e);
        });
    });
}

module.exports.wrapCommand = wrapCommand;
function wrapCommand(command) {
    return new Promise((resolve, reject) => {
        let rcfile = findRcFile();
        if (!rcfile) { reject('could not find rc file'); }
        let rc = require(rcfile);

        commandStartHook(rc, command).then(function() {
            runCommand(command).then(code => {
                commandEndHook(rc, command, code).then(function() {
                    resolve(code);
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        }).catch(e => reject(e));
    });
}

function commandStartHook(rc, command) {
    return new Promise((resolve, reject) => {
        const slack = new Slack(rc.webhook_url);
        let now = new Date();
        const msg = `Action invoked on \`${os.hostname()}\` at ` +
              `${date.format(now, 'HH:mm:ss')}: \`${command}\``;
        resolve(
            slack.send({
                text: msg,
                channel: rc.channel,
                username: rc.username
        }));
    });
}

function commandEndHook (rc, command, exit_code) {
    return new Promise((resolve, reject) => {
        const slack = new Slack(rc.webhook_url);
        const msg = `\`${command}\` completed on ` +
              `\`${os.hostname()}\` with exit code \`${exit_code}\``;
        resolve(
            slack.send({
                text: msg,
                channel: rc.channel,
                username: rc.username
            }));
    });
}
