#! /usr/bin/env sh

#
#
#

echo 'restarting all forever jobs in 60s'
echo $(date)
(sleep 10; forever restartall)&
