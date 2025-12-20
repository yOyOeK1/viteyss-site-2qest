#!/bin/bash

argsC=$#

 . ./shsFuncs.sh

# example
# ./cmdInNc.sh "date > /tmp/ncW" localhost 19900
# cmd "date > /tmp/ncW"
# ipTarget localhost
# portTarget 19900
#
# return 0
#
# desc
# to listen
# nc -l 19900
# node ./libs/tcpListener.js 192.168.43.220 5000
#
#
# example
# cmd='cal;sleep 2; free; sleep 2; date;sleep 5; ps;sleep 2;date;sleep 2;date;sleep 2;date;sleep 2;date; echo "DONE"'; ./cmdInNc.sh "$cmd" 0.0.0.0 5000
#


# cmd ipTarget portTarget
argsMin=3

if test $argsC -eq 3; then
    cmd=$1
    ip=$2
    port=$3
    echo "# nc to START "$(shsMs);
    
    pidF=`tempfile`
    pidExc=`tempfile`"DONE"
    pidNC=-1
    #sh -c "$cmd" 2>&1 | nc -q 1 "$ip" "$port";
    sh -c "$cmd"'
        echo "$?" > '"$pidExc"'
        ' 2>&1  | nc -l -k -C -N "$ip" "$port"  &
    pid=$!
    res=$?
    echo "$pid" > "$pidF"
    

    echo -n " # working so pid $pid res $res"
    while [ 1 ];do
        if test -e "$pidExc"; then
            exCod=`cat "$pidExc"`
            echo -e "DONE"
            echo "# cmd is Done with [$exCod] pidExc [$pidExc]"
            kill $pid

            echo "# nc to DONE "$(shsMs)
            exit $res

        else
            echo -n '.'
            sleep 1
            
        fi
    done


   
    
else
    echo "EE wrong args count"
    exit -1

fi
