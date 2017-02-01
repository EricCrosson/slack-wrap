#!/usr/bin/env node

'use strict';

const _ = require('lodash');

const wrapCommand = require('./slack-wrap.js').wrapCommand;

function main(args) {
    const command = _.join(args, ' ');
    wrapCommand(command).then(exit_code => {
        process.exit(exit_code);
    }).catch(e => console.log(e));
}

let args = process.argv.slice(2);

if (args) {
    main(args);
}
