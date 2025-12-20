#!/bin/bash

argsC=$#

#
# example
# ./mkTemp.sh true "exit 2"
# enterDir true
# cmd "exit 2"
#
# return 2
#
# example
# ./mkTemp.sh true "cp /tmp/usbBurn_iters.log ./; pwd; ls; exit 2" 
# enterDir true
# cmd "cp /tmp/usbBurn_iters.log ./;pwd;ls;exit 2"
#
# return 2
#


# enterDir cmd liveDir
argsMin=1

tDir=`mktemp -d`
dStart=`pwd`
echo "#argC $argsC"
echo "#mktemp $tDir"


if test $argsC -ge 1; then
    cd "$tDir"
   
fi

if test $argsC -ge 2; then
    echo "exec [$2]"
    sh -c "$2"
    res=$?
fi

if test $argsC -ge 3; then
    cd "$dStart"
fi

echo "#mktemp exit"$res
exit $res