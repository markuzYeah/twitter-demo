#! /usr/bin/env sh

cd $HOME/work/twitter-demo

forever stopall

forever start -a -c sh sh/grunt-server.sh
forever start -a -c sh sh/redis.sh
sleep 2
forever start -a --minUpTime 1 server/main.js
forever start -a --minUpTime 1 --spinSleepTime 60000 -c sh sh/restarter.sh


forever list
