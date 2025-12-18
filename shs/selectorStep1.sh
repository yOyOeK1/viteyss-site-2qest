#!/bin/bash


#~/.local/share/nautilus/scripts

arg=$*

echo "-- selector --"
echo "entry">>/tmp/sel1
echo $arg >> /tmp/sel1

laj=""

echo "Selected files:">> /tmp/sel1b
for file_path in "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS"; do
    echo "$file_path" >> /tmp/sel1b
    laj+="$file_path"
    
done


echo "select j" >> /tmp/sel1c
echo "filesSelected:"$laj >> /tmp/sel1c

vy='/home/yoyo/Apps/viteyss'

cd $vy

cmdTo="bash -c 'node ./runItSelector.js --site=2qest --files=\"$laj\"; sleep 5; exec bash'"
echo $cmdTo > /tmp/nps

echo "$cmdTo"
gnome-terminal --command="bash -c 'node ./runItSelector.js --site=2qest --files=\"$laj\"; sleep 5; exec bash'" 
sleep 4;
./startKioskChrome2.sh "http://localhost:8080/yss/index.html#pageByName=2%20Qest"
