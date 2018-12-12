#!/usr/bin/env bash

to_run="${1:-all}"

it_exit_code=0
ut_exit_code=0

# Run integration tests
if [[ "$to_run" == "integration" || "$to_run" == "all" ]]; then
    npm start:test &>/dev/null &
    server_pid=$!
    pipenv run python integrationTests.py
    it_exit_code=$?
    kill $server_pid
fi

# Run unit tests
if [[ "$to_run" == "unit" || "$to_run" == "all" ]]; then
    npm test
    ut_exit_code=$?
fi

exit $($it_exit_code || $ut_exit_code)
