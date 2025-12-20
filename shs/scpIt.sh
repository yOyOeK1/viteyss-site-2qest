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


# userConfig srcPath targetPath
argsMin=3


if test $argsC -eq 3; then
    sU=`./sshConfigs.sh $1 user`
    sP=`./sshConfigs.sh $1 port`
    scp -P $sP "$2" "$sU"":""$3"
    res=$?
    exit $res
fi

echo "EE no correct argC" 
exit -1



