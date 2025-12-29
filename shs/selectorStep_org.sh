#!/bin/bash

kiosk='chromium'
#kiosk='firefox'

twoQestHOME="" ## to setIt Up

#viteyssHOME='/home/yoyo/Apps/viteysxs'
viteyssHOME="$twoQestHOME""/../viteyss"



#cd $viteyssHOME
#echo "will exit now -1"
#echo `pwd`
#env
#sleep 6

#~/.local/share/nautilus/scripts

arg=$*

echo "-- selector --"
date >> /tmp/sel1
echo "entry" >> /tmp/sel1
echo $arg >> /tmp/sel1
echo "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS" >> /tmp/sel2Naut


if test "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS" = "";then
    echo "nautilus is empty selection, swap to arg"
    NAUTILUS_SCRIPT_SELECTED_FILE_PATHS=$arg
fi


laj=""

echo "Selected files:">> /tmp/sel1b
for file_path in "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS"; do
    echo "$file_path" >> /tmp/sel1b
    laj+="$file_path"
    
done


echo "select j" >> /tmp/sel1c
echo "filesSelected:"$laj >> /tmp/sel1c


cd $viteyssHOME

if test -e "./runItSelector.js"; then
    echo "GO GO "
else
    echo "EE wrong directory ? [$viteyssHOME] is this a viteyss directory?"
    #exit -1
    sleep 60
fi



cmdTo="bash -c 'node ./runItSelector.js --site=2qest --files=\"$laj\"; sleep 5; exec bash'"
echo $cmdTo > /tmp/nps

echo "$cmdTo"
gnome-terminal --command="bash -c 'node ./runItSelector.js --site=2qest --files=\"$laj\"; sleep 5; exec bash'" 
sleep 4;


if test "$kiosk" = "chromium"; then
    ./startKioskChrome2.sh "http://localhost:8080/yss/index.html#pageByName=2%20Qest"

elif test "$kiosk" = "firefox"; then
    ./startKioskFirefox2.sh "http://localhost:8080/yss/index.html#pageByName=2%20Qest"
else

    echo "TODO no kiosk [$kiosk] for you :("
       
fi
