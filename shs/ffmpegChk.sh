

# example
# ./ffmpegChk.sh
#
# return 0 | 1


ffmpeg -version
res=$?
echo "so exit is "$res

if test $res -eq 0; then
    echo "# ffmpeg OK"
    exit 0
fi

exit 1