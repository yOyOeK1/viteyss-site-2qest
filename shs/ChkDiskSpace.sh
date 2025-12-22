#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./ChkDiskSpace.sh "/dev/sda1" 9000
# filesystem "/dev/sda1"
# minSpace 9000
#
# return 0
#


# filesystem minSpace
argsMin=2

filePath="$1"
minSpace="$2"
if test $argsC -eq 2; then
    freeS=`df | grep "$filePath" | awk '{print $4}'`
    #echo "# freeS: [$freeS] bytes"
    freeK=$[ $freeS / 1024 ]
    #echo "# freeK: [$freeK] Kbytes"
    
    if test $freeS -ge $minSpace; then
        echo "# space is ok [ $freeK ] Kbytes"
        exit 0
    else
        echo "# no space [ $freeK ] KB"
        exit 1
    fi
    

else
    echo "EE wrong argument count"
    exit -1


fi

