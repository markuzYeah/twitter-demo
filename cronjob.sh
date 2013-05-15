#! /usr/bin/env sh

cd $HOME/work/twitter-demo

forever start -a -c sh sh/grunt-server.sh
forever start -a -c sh sh/redis.sh
sleep 2
forever start -a server/main.js

