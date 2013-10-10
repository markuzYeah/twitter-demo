#! /usr/bin/env sh

cd $HOME/work/twitter-demo

forever stopall

forever start -c sh sh/grunt-server.sh
forever start -c sh sh/redis.sh
sleep 2
forever start  --minUpTime 1 server/main.js 

# 600_000 = 10 mins
forever start  --minUpTime 1 --spinSleepTime 300000 -c sh sh/restarter.sh

forever list
