#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./cmdTry.sh "cal" "abc1" 1;
# cmod "cal"
# tryId "abc1"
#
# return 0
#

# cmd tryId stdToFileLog
argsMin=2


ucon=""
if test $argsC -ge 2; then
    {
        #echo "ok rout ident[$2]"
        tFile="./CTryId_$2"
        cmd="$1!"
        echo "# tFile:   [ $tFile ]"
        echo "# cmd:     [ $cmd ]"
        echo "# argsC:   [ $argsC ]"



        if test -f $tFile"_0_start"; then
            echo "EE files are present for try ...."
            ls $tFile*
            exit -1
        else
            echo "ok"
        fi

        echo "$cmd" > "$tFile""_0_cmd"
        touch "$tFile""_0_start"
        
        if test $argsC -eq 3; then
            #echo "do to log"
            sh -c "$cmd" > "$tFile""_1_std_log"
            res=$?
        else
            sh -c "$cmd" 
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



