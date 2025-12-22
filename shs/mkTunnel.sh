#!/bin/bash
#

args=$*
argsC=$#

#
# example
# ./mkTunnel.sh hu 8080 18080
# userConfig hu
# localPort 8080
# atTargetPort 18080
#
# return 0
#


# userConfig localPort atTargetPort
argsMin=3



userN="$1"
lPort="$2"
atTargetPort="$3"
if test $argsC -eq 3; then

    sU=`./sshConfigs.sh $userN user`
    sP=`./sshConfigs.sh $userN port`
    sD=`./sshConfigs.sh $userN home`

    if test $? = 0; then
        ucon="ssh $sU -p $sP "
    else
        echo "EE no userConfig"
        exit -1
    fi
    
    tunel="$atTargetPort"":localhost:""$lPort"
    echo "# mk tunnel [ $tunel ]"

    ssh -N -R "$tunel" "$sU" -p "$sP"

else
    echo "EE wrong argument count"
    exit -1


fi

