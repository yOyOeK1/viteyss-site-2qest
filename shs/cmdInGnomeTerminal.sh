#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./cmdInGnomeTerminal.sh "cal;sleep 1; exec bash"
# cmd "cal;sleep 1; exec bash"
#
# return 0
#
# example
# ./cmdInGnomeTerminal.sh "cal;sleep 5;" "title of window"
# cmd "cal;sleep 5;"
# title "title of window"
#
# return 0
#
#
# example
# ./cmdInGnomeTerminal.sh "sleep 1;exit 2" "okok" true
# cmd "sleep 1;exit 2" "okok"
# title "okok"
# cmdExitCodePass true
#
# return 2
#

# cmd title wait
argsMin=1

if test $argsC -eq 1; then
    cmd=$1
    echo "args 1 ok -e [$cmd]"
    gnome-terminal -- sh -c "$cmd"
fi

if test $argsC -eq 2; then
    echo "args 2 tytle [$2] -e [$1]"
    gnome-terminal -t "$2" -- sh -c "$1"
fi

if test $argsC -eq 3; then
    echo "args 3 wait [$3] tytle [$2] -e [$1]"
    gnome-terminal --wait -t "$2" -- sh -c "$1"
fi