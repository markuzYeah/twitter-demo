#! /usr/bin/env sh

forever start -a -c sh sh/redis.sh
forever start -a -c grunt server
sleep 1
forever start -a server/main.js

