#!/bin/bash


echo "- installing it as a script for nautilus"
echo "my pwd[$(pwd)]"


#twoQestHOME="/home/yoyo/Apps/viteyss-site-2qest"
twoQestHOME="$npm_config_local_prefix"
viteyssHOME="$twoQestHOME""/../viteyss"
menuItem="2qestInst_""$npm_package_version"
nautScr="$HOME""/.local/share/nautilus/scripts"


echo "viteyss   [$viteyssHOME]"
echo "2qest     [$twoQestHOME]"
sleep 1


echo "* setting up selecterStep1 ...."
sed 's:twoQestHOME="":twoQestHOME="'"$viteyssHOME"'":g' "./shs/selectorStep_org.sh" > "./shs/selectorStep1.sh"
echo "  - chmod it "
chmod +x "./shs/selectorStep1.sh"





if test -d "$nautScr"; then
    echo "* nautilus directory / scripts OK"


    if test -e "$nautScr""/""$menuItem" ; then
        echo "  - link OK   ["$nautScr""/""$menuItem"]"
    else
        echo "  - making link for contextmenu   [$menuItem]"
        ln -s "$twoQestHOME""/shs/selectorStep1.sh" "$nautScr""/""$menuItem"
    fi

else
    echo "* nautilus directory / scripts not pressent.  [$nautScr]"

fi



fTarget="$HOME""/.local/share/applications/""$menuItem"".desktop"
fTargetCon="$HOME""/.local/share/applications/""$menuItem""_convertToSh.desktop"
echo "* installing it as a app [ $fTarget ]"

echo '[Desktop Entry]
Name=2Qest - v'"$npm_package_version"'
Exec='"$twoQestHOME"'/shs/selectorStep1.sh 1 --site=2qest --files=0 %F
Comment=Two run it with 2qest
Terminal=true
Icon='"$twoQestHOME"'/assets/ico_in_64_64.png
Type=Application
MimeType=text/plain;video/mpeg;video/mp4;video/ogg;video/x-flv;video/x-ms-wmv;video/x-msvideo;
Categories=Multimedia;Player;
Actions=OpenQest;ConvertShQest
' > "$fTarget"
echo "  - making link for .desktop  [ $fTarget ]"

echo '[Desktop Entry]
Name=2Qest convert to sh - v'"$npm_package_version"'
Exec='"$twoQestHOME"'/shs/selectorStep1.sh 0 --site=2qest --convertToSh=1 --files=0 %F
Comment=Two run 2qest file convert to sh at spot
Terminal=true
Icon='"$twoQestHOME"'/assets/ico_inConvert_64_64.png
Type=Application
MimeType=text/plain;video/mpeg;video/mp4;video/ogg;video/x-flv;video/x-ms-wmv;video/x-msvideo;
Categories=Multimedia;Player;
Actions=OpenQest;ConvertShQest
' > "$fTargetCon"

echo "  - making link for .desktop  [ $fTargetCon ]"

    
