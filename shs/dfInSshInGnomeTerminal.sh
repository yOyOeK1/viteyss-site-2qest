#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./dfInSshInGnomeTerminal.sh h "free; bash; exit 6" "abc" true;
# userConfig h
# cmd "free;bash"
# title "abc"
# cmdExitCodePass true
#
# return 6
#


# userConfig cmd title wait
argsMin=1

if test $argsC -eq 0; then
    echo "EE wrang argC"
    exit -1
fi

uc=$1
if test $argsC -eq 1; then
    cm="df -h;";
else
    cm=$2
fi

ss="./cmdInSsh.sh '$uc' '$cm' '$4'"; 

if test $argsC -eq 4;then
    waitF=';exec bash'
else
    waitF=''
fi



if test $argsC -eq 1; then
    ./cmdInGnomeTerminal.sh "$ss$waitF" ;
    res=$?
elif test $argsC -eq 2; then
    ./cmdInGnomeTerminal.sh "$ss$waitF" ;
    res=$?
elif test $argsC -eq 3; then
    ./cmdInGnomeTerminal.sh "$ss$waitF" $2;
    res=$?
elif test $argsC -eq 4; then
    ./cmdInGnomeTerminal.sh "$ss$waitF" $2 $3;
    res=$?
fi

exit $res