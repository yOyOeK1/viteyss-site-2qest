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


# userConfig
argsMin=1

userConfig="$1"


jStr=`cat ./sshData.json`
jLen=$[`echo "$jStr" | jq 'length'`-1]

while test $jLen -ge 0 ; do
    jRow=`echo "$jStr" | jq .[$jLen]`
    jName=`echo "$jRow" | jq -r .name`
    
    if test "$jName" = "$userConfig"; then
        #echo "# have it"
        echo "$jRow"
        exit 0
    fi
    
    
    
    jLen=$[$jLen-1]
done




if test $argsC -eq 1; then
    echo "# not found"
    exit 1
else
    echo "EE wrong argument count"
    exit -1

fi

