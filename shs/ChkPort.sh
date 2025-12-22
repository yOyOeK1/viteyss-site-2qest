#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./ChkPort.sh 808
# localPort 808
# return 0
#


# portNo
argsMin=1


lPort="$1"
if test $argsC -eq 1; then
    testR=`ss -tulpn | grep :$lPort`
    res=$?
    if test $res -eq 0;then
        echo "# post [$lPort] NOT USED"
    else
        echo "# post [$lPort] IN USE"
    fi
    exit $res

else
    echo "EE wrong argument count"
    exit -1


fi

