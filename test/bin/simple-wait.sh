#!/usr/bin/env bash
# Written by Eric Crosson
# 2017-01-18
#
# This program delays ${1:-0.001} seconds and exits with rc=0.

main() {
    local -r delay=${1:-0.1}
    (time sleep ${delay}s) &>/dev/null
}

main "$@"
