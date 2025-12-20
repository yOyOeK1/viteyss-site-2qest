
shsErr(){
    echo "EE ""$*" >&2
}

shsMs(){
    date +%s%3N
}

#
# example
# shsJ "name:testName" "payload:fine" | jq .
# arg0 ...
# 
# returnStdio { "entryDate": "17662357360000" , "name": "testName" , "payload": "fine"  }
# return 0
#
shsJ(){
    #echo "shsJ() count:$#"
    tr='\t"entryDate": "'$(shsMs)'"' # as ms
    for a in $*;do
        vname=$(echo "$a" | cut -d ':' -f 1)
        vval=$(echo "$a" | cut -d ':' -f 2)
        tr=$tr',\n\t "'$vname'": "'$vval'"'
    done

    tr='{\n'"$tr"'\n}'

    echo -e "$tr" 
}


# example 
# cmdOnlyExit "sleep 1"
#
#  cmd
cmdOnlyExit(){
    cmd=$1
    tmpF=`tempfile`
    sh -c "$cmd" > $tmpF"_stdio.log" 2> $tmpF"_stderr.log"
    res=$?
    echo -e "# cmdOnlyExit \n#\texit [$res] tmpF path: [$tmpF]"

    echo $res
    return $res
}

shsTimeIt(){
    tStart=$(shsMs)
    sh -c "$cmd"
    res=$?
    tTotal=$[ $(shsMs) - $tStart ]
    echo "# shsTimeIt $tTotal ms."
    echo $res
    return $res
}

