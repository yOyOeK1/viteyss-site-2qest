#!/bin/bash

fPath="$1"

echo "# * will convert .2qest to .sh ... "
echo "# src     [ $fPath ]"
sleep 1

mkpLog=`mktemp`
viteyssPath="/home/yoyo/Apps/viteyss"
viteyss2qestPath="/home/yoyo/Apps/viteyss-site-2qest"

cd ${viteyssPath}
node ./runItSelector.js --site=2qest --convertToSh=1 --files="$fPath" >> "$mkpLog"
exitC="$?"
echo "# [d] Exit convert with code: [ ""$exitC"" ]"                
if test "$exitC" = "11";then
    echo "# * echo convert OK in log file [ $mkpLog ]"
    shFilePath=`cat "$mkpLog" | grep "target sh file " | awk '{print $6}' `
    echo "# * sh file path  ...  [ $shFilePath ]"
    if test -e "$shFilePath";then
        echo "# * make it executable ..."
        chmod +x "$shFilePath"
        cd `dirname "$shFilePath"`
        echo "# * in directory will "
        pwd
        echo "# run in ... 5"
        echo "# exec "./"`basename "$shFilePath"`"
        sleep 5
        exec "./"`basename "$shFilePath"`

    else
        echo "#EE * no sh file in target place "
    fi

else
    echo "#EE * convert error exit 9"
    
fi                
               
echo "# Done _______________"\`date\`