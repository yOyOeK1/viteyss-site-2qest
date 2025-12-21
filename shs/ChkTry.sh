#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./chkTry.sh "abc10"
# tryId "abc10"
#
# return 0
#
# desc
# ./cmdTry.sh "echo 'hello'" 'abc10'
# can spon task with ident "abc10"
#

# tryId
argsMin=1


ucon=""
if test $argsC -ge 1; then
    tFile="./CTryId_$1"
    echo "# tFile:      [ $tFile ]"
    isStatus="NaN"
    exitCod=0
    
    if test -f $tFile"_0_start"; then
        isStatus='running'
    fi

    if test -f $tFile"_2_exitCode"; then
        exitCod=`cat $tFile"_2_exitCode"`
        if test $exitCod -eq 0; then
            isStatus='finish'
        else
            isStatus='crash'
        fi


    fi




    echo "# status      [ $isStatus ]"
    echo "# exitCode    [ $exitCod ]"
    exit $exitCod
fi

echo "EE wrong argsC count"
exit -1



