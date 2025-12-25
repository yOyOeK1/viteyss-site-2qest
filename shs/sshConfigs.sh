#!/bin/bash



argsC=$#



# example
# ./sshConfigs.sh hu home
# userConfig hu
# attr home
#
# return 0
#
#

# userConfig attr
argsMin=1


if test $argsC -lt 2; then
    echo "EE wrang argC"
    exit -1
fi


j=`sshConfigsJson.sh "$1"`
if test $? -ne 0; then
    exit $?
fi

resS=`echo "$j" | jq -e -r ".$2"`
res=$?

if test $res -eq 0 ; then
    echo $resS
fi
exit $res




if test $1 = "hu";then
    if test $2 = "user"; then
        echo "a@hu"
    elif test $2 = "port"; then
        echo "2222"
    elif test $2 = "home"; then
        echo "/data/data/com.termux/files/usr/tmp/2Qhu"
    elif test $2 = "filesystem"; then
        echo "/dev/block/by-name/userdata"
    fi
    
    exit 0
fi

if test $1 = "local";then
    if test $2 = "user"; then
        echo "yoyo@192.168.43.220"
    elif test $2 = "port"; then
        echo "2222"
    elif test $2 = "home"; then
        echo "/tmp/2Qlocal"
    elif test $2 = "filesystem"; then
        echo "/dev/sda1"
    fi
    exit 0
fi

if test $1 = "iloo";then
    if test $2 = "user"; then
        echo "iloo@192.168.43.88"
    elif test $2 = "port"; then
        echo "22"
    elif test $2 = "home"; then
        echo "/tmp/2Qiloo"
    elif test $2 = "filesystem"; then
        echo "/dev/sda1"
    fi
    exit 0
fi

echo "EE no userConfig"
exit -1
