#!/bin/bash

kiosk='chromium'
#kiosk='firefox'

twoQestHOME="/home/yoyo/Apps/viteyss-site-2qest/../viteyss" ## to setIt Up

#viteyssHOME='/home/yoyo/Apps/viteysxs'
viteyssHOME="$twoQestHOME""/../viteyss"


#
#./selectorStep1.sh  1 --site=2qest --files=/home/yoyo/Videos/flashRool_cooding1/2509301409_checking_boat_batteries.mp4 /home/yoyo/Videos/flashRool_cooding1/2509301414_making_ffmpeg_to_do_subtitles_and_speed_up_video.mp4
#
#

#cd $viteyssHOME
#echo "will exit now -1"
#echo `pwd`
#env
#sleep 6

#~/.local/share/nautilus/scripts

arg=$*
argC=$#

kioskDo=$1 # 1 - to do kiosk else will not make kiosk


date
echo "# -- selector -- kioskDo [ $kioskDo ] "
date >> /tmp/sel1
echo "entry" >> /tmp/sel1
echo $arg >> /tmp/sel1
echo "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS" >> /tmp/sel2Naut

echo "# arg vector ( $argC ) [ $arg ]"


if test "$NAUTILUS_SCRIPT_SELECTED_FILE_PATHS" = "";then
    echo "# nautilus is empty selection, swap to arg"
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
    echo "# GO GO "
else
    echo "EE wrong directory ? [$viteyssHOME] is this a viteyss directory?"
    #exit -1
    sleep 60
fi





#cmdTo="bash -c 'node ./runItSelector.js --site=2qest --files=\"$laj\"; sleep 5; exec bash'"
echo $cmdTo > /tmp/nps



fileList=""
isFilesSt=0
filesAt=0
argOne=""
argTwo=""
argTree=""
echo -n "# parsing arguments to build files list ..."
for ar in `echo "$arg"`;do
    #echo " - [$ar]"
    echo -n '.'

    if test "$isFilesSt" = "1"; then
        fileList=""$ar" ""$fileList"
    else
        filesAt=$[$filesAt+1]
    fi

    if test "$filesAt" = "1";then
        argOne="$ar"
    elif test "$filesAt" = "2";then
        argTwo="$ar"
    elif test "$filesAt" = "3";then
        argTree="$ar"
    fi



    if test "$ar" = "--files=0";then
        echo -en " found start of files chunk "
        isFilesSt=1
    fi
done
echo -e "#\n#"

#initMsg="echo '# Starting Viteyss from context menu ...';echo '#';"

vyTmpLog=`mktemp`
echo "# [i] build fileList payload at [ $filesAt ] [ $fileList ]"
echo "# [i] temporary log path [ $vyTmpLog ]"
vitePid=0
if test "$filesAt" = "3"; then
    echo "# [i] terminal started with viteyss ... opt 3"
    echo "#     [ $argOne $argTwo ]"
    #gnome-terminal -- "bash -c echo '# Starting viteyss from arguments ...';echo '#'; date;node ./runItSelector.js $argOne $argTwo --files="$fileList" ; sleep .1; echo 'Viteyss exit ....';"
    node ./runItSelector.js $argOne $argTwo --files="$fileList" >> "$vyTmpLog" &
    vitePid=$!
elif test "$filesAt" = "4"; then
    echo "# [i] terminal started with viteyss ... opt 4"
    echo "#     [ $argOne $argTwo $argTree ]"
    #gnome-terminal -- "bash -c echo '# Starting viteyss from arguments ...';echo '#'; date;node ./runItSelector.js $argOne $argTwo --files="$fileList" ; sleep .1; echo 'Viteyss exit ....';"
    node ./runItSelector.js $argOne $argTwo $argTree --files="$fileList"
    vitePid=$!


    echo -en "# [?] it is DONE  close session? [Y/n]: "
    read line
    if test "$line" = "y" || test "$line" = "" || test "$line" = "Y" ;then 
        exit 0
    else
        exec bash
    fi

    
fi

#sleep 500
#echo "EXIT 2"
#exec bash
#exit 2

#echo "$cmdTo"
# --title="Viteyss-site-2qest - selector ..." \
#gnome-terminal --command="bash -c 'node ./runItSelector.js $arg; sleep .1; echo 'Viteyss exit ....'; exec bash'"
#sleep 4;



echo "# [i] doing kiosk [ $kioskDo ]... in [ $kiosk ] "
if test "$kioskDo" = "1";then


    abcCurl=1
    testNo=0
    echo -en "# - waiting for host to start ..."
    while test "$abcCurl" = "1";do
        sleep .3
        curl -q http://localhost:8080 2>>"$vyTmpLog"
        testCurl=$?
        testNo=$[ $testNo + 1 ]

        echo -n "  $testNo : $testCurl  "
        if test "$testCurl" = "0";then
            echo "# break host is up !"
            abcCurl=0
        fi

    done





    if test "$kiosk" = "chromium"; then
        ./startKioskChrome2.sh "http://localhost:8080/yss/index.html#pageByName=2%20Qest" >> "$vyTmpLog"

    elif test "$kiosk" = "firefox"; then
        ./startKioskFirefox2.sh "http://localhost:8080/yss/index.html#pageByName=2%20Qest" >> "$vyTmpLog"
    else

        echo "TODO no kiosk [$kiosk] for you :("
        
    fi

    echo "-----------------------------------------------------------"
    date
    echo "# [i] temporary log location of sesion [ $vyTmpLog ]"
    echo "# [i] so kiosk exit ? ----------------------- pid [ $vitePid ]"
    echo -en "# "
    ps aux | grep "local" | grep "$vitePid"

    echo -en "# [?] kill viteyss ? [Y/n]: "
    read line
    if test "$line" = "y" || test "$line" = "" || test "$line" = "Y" ;then 
        kill "$vitePid"
        echo "# * kill ..." 
    fi

    

    exec bash

fi

echo "# [i] end of selectorStep1 .... DONE $vitePid"
