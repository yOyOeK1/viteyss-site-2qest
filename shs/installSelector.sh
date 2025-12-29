#!/bin/bash


echo "- installing it as a script for nautilus"
echo "my pwd[$(pwd)]"



twoQuestHOME="/home/yoyo/Apps/viteyss-site-2qest"
menuItem="2questInst"

nautScr="$HOME""/.local/share/nautilus/scripts"




if test -d "$nautScr"; then
    echo "* nautilus directory / scripts OK"


    if test -e "$nautScr""/""$menuItem" ; then
        echo "  link OK"
    else
        echo "  making link for contextmenu [$menuItem]"
        ln -s "$twoQuestHOME""/shs/selectorStep1.sh" "$nautScr""/""$menuItem"
    fi



else
    echo "* nautilus directory / scripts not pressent. [$nautScr]"

fi


fTarget="$HOME""/.local/share/applications""/twoquest.desktop"
echo "- installing it as a app twoquest.desktop"
if test -e "$fTarget"; then
    echo "* [$fTarget] is OK"
else    

    # TODO file selected are passt in different way then by nautilus :(

    echo '[Desktop Entry]
Name=2Qest
Exec='"$twoQuestHOME""/shs/selectorStep1.sh"' "%F"
Comment=Two run it with 2qest
Terminal=true
Icon='"$twoQuestHOME"'/assets/ico_in_64_64.png
Type=Application
MimeType=video/mpeg;video/mp4;video/ogg;video/x-flv;video/x-ms-wmv;video/x-msvideo;
Categories=Multimedia;Player;
' > "$fTarget"


fi