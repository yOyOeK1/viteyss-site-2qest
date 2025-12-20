

argsC=$#

# userConfig cmd title wait
argsMin=1

if test $argsC -lt 2; then
    echo "EE wrang argC"
    exit -1
fi

if test $1 = "h";then
    if test $2 = "user"; then
        echo "a@hu"
    elif test $2 = "port"; then
        echo "2222"
    fi
    exit 0
fi

if test $1 = "local";then
    if test $2 = "user"; then
        echo "yoyo@192.168.43.220"
    elif test $2 = "port"; then
        echo "2222"
    fi
    exit 0
fi

echo "EE no userConfig"
exit -1
