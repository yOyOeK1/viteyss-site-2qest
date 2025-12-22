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

# for c in local hu iloo;do 
#    echo "* "$c"----------------------";  ./cmdInSsh.sh "$c" "uptime; echo 'ok and home path is [ `./sshConfigs.sh "$c" "home"` ]'"; echo "exitCode:"$? ;  done
# 

# userConfig cmd wait
argsMin=1


ucon=""
userN="$1"
cmd="$2"
if test $argsC -ge 1; then
    sU=`./sshConfigs.sh $userN user`
    sP=`./sshConfigs.sh $userN port`
    sD=`./sshConfigs.sh $userN home`

    if test $? = 0; then
        ucon="ssh $sU -p $sP "
    else
        echo "EE no userConfig"
        exit -1
    fi
    
    dTest="echo '# test 2Quest home [$sD]';
        if test -d '$sD'; then
            echo 'Ok';
        else
            echo 'No target directory';
        fi
    "
    cmd="$dTest;$cmd"

fi

if test $argsC -eq 2; then

    #echo "args 2 [$userN]"

    exec $ucon $cmd

fi

if test $argsC -eq 3; then

    #echo "args 3 [$userN]"
    exec $ucon -o ExitOnForwardFailure=yes $cmd
    exit $?
fi



