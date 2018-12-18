#!/usr/bin/env bash

trap "{ kill $(jobs -p) }" SIGINT SIGTERM

cd $(dirname $0)

to_run="${1:-all}"

it_exit_code=0
ut_exit_code=0

# Run integration tests
if [[ "$to_run" == "integration" || "$to_run" == "all" ]]; then
    PORT=3345 npm run start:test &
    if [[ $? != 0 ]]; then
	echo "Node server failed to start"
	exit $?
    fi
    pipenv run python integrationTests.py --port 8345 --client-port 3345 --headless true
    kill $(jobs -p)
fi

# Run unit tests
if [[ "$to_run" == "unit" || "$to_run" == "all" ]]; then
    npm test
    ut_exit_code=$?
fi

if [[ $it_exit_code != 0 || $ut_exit_code != 0 ]]; then
	exit 1
else
	exit 0
fi
