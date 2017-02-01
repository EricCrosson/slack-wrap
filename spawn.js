// var utils = require('./utils');
var childProcess = require('child_process');
var _spawn = childProcess.spawn;

module.exports = function spawn(command) {
    return new Promise(function(resolve, reject) {

        var stdio = ['pipe', 'pipe', 'pipe'];

        // if (config.options.stdout) {
        // stdio = ['pipe', process.stdout, process.stderr];
        // }

        var sh = 'sh';
        var shFlag = '-c';

        // if (utils.isWindows) {
        //     sh = 'cmd';
        //     shFlag = '/c';
        // }

        var args = '';

        if (!Array.isArray(command)) {
            command = [command];
        }

        args = command.join(' ');

        const env = process.env;
        const child = _spawn(sh, [shFlag, args], {
            env: env,
            stdio: stdio,
        });
        child.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        child.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        child.on('close', (code) => {
            resolve(code);
        });

        // if (config.required) {
        // if (false) {
        //     var emit = {
        //         stdout: function (data) {
        //             bus.emit('stdout', data);
        //         },
        //         stderr: function (data) {
        //             bus.emit('stderr', data);
        //         },
        //     };

        //     // now work out what to bind to...
        //     // if (config.options.stdout) {
        //     if (true) {
        //         child.on('stdout', emit.stdout).on('stderr', emit.stderr);
        //     } else {
        //         child.stdout.on('data', emit.stdout);
        //         child.stderr.on('data', emit.stderr);

        //         bus.stdout = child.stdout;
        //         bus.stderr = child.stderr;
        //     }
        // }
    });
};
