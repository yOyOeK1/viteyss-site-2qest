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

# userConfig cmd wait
argsMin=2


ucon=""
if test $argsC -ge 2; then
    {
        #echo "ok rout ident[$2]"
        tFile="./CTryid_$2"
        echo "# tFile:   [ $tFile ]"
        echo "# cmd:     [ $1 ]"
        echo "# argsC:   [ $argsC ]"

        if test -f $tFile"_0_start"; then
            echo "EE files are present for try ...."
            ls $tFile*
            exit -1
        else
            echo "ok"
        fi

        touch "$tFile""_0_start"
        
        if test $argsC -eq 3; then
            #echo "do to log"
            sh -c "$1" > "$tFile""_1_std_log"
            res=$?
        else
            sh -c "$1" 
            res=$?
        fi
        
        echo "$res" > "$tFile""_2_exitCode"

        if test $res -eq 0; then
            touch "$tFile""_3_done"
            echo "ok rout ident[$2] OK exitCode $res"
        else
            echo "ok rout ident[$2] ERROR exitCode $res"
        fi

        fList=`ls $tFile*`
        fLen=$[ ${#tFile}+2 ]
        echo "fLen $fLen"
        for f in $fList; do

            fThisLen=${#f}
            fSub=$( echo $f | cut -c $fLen-$fThisLen )

            echo -e "\n * [$fSub] $f: \n\t[ "`cat $f`" ]"
        done

        exit $res

    } ||
    {
        #res=$?
        touch "$tFile""_4_error"
        echo "# EE rout ident[$2] exitCode "$res
    }

fi

echo "EE wrong argsC count"
exit -1



