#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./cmdInSsh.sh h "cal"
# userConfig h
# cmd "cal"
#
# return 0
#
# example
# ./cmdInSsh.sh h "exit 2" true
# userConfig h
# cmd "exit 2"
# cmdExitCodePass true
#
# return 2
#


# userConfig cmd wait
argsMin=1


ucon=""
if test $argsC -ge 1; then
    sU=`./sshConfigs.sh $1 user`
    sP=`./sshConfigs.sh $1 port`
    if test $? = 0; then
        ucon="ssh $sU -p $sP "
    else
        echo "EE no userConfig"
        exit -1
    fi

fi

if test $argsC -eq 2; then

    #echo "args 2 [$1]"

    exec $ucon $2

fi

if test $argsC -eq 3; then

    #echo "args 3 [$1]"
    exec $ucon -o ExitOnForwardFailure=yes $2
    exit $?
fi



