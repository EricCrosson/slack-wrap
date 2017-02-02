Overview
========

This package exists to notify users upon the completion of a command
line action.

Whereas some command line actions take a long time to complete, and the
default notification of these actions (namely, re-displaying your
`$PS1`) can be easy to miss, this project provides a script that

1.  sends a message before invoking the desired action, describing the
    action to be commenced and on what host

    This message provides a timestamp denoting the *start* of the
    long-running action.

2.  sends a message after the action termination, describing the
    action's exit code

    This message provides a push-notification that the long-running
    operation has ceased.

With these two recorded notifications, a developer can gather valuable
metrics about the average runtime of a long-running command, multi-task
more efficiently during long-running operations, and collect feedback
from daemons and other periodic processes.

Installation
============

Install with npm:

    npm install --global slack-wrap

Then create a configuration file at `${HOME}/.slack-wrap.json` with the
following contents:

    {
        "channel": "@<my-slack-username>",
        "username": "slack-notify",
        "webhook_url": "https://hooks.slack.com/services/RANDOM/WEBHOOK/HASH"
    }

The values of these keys will depend on how you set up your
`webhook_url`,
[here](https://my.slack.com/services/new/incoming-webhook/).
