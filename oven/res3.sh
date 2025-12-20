#-------------------




# 2 Qest  nautilus001
mkdir "./_Ready"
echo " * temp dir is [$(pwd)]" . . . . .


#   file no: 0 
touch './_Ready/0_status_START'
cp "/home/yoyo/Videos/flashRoll_houseBank/VID_20230611_083522.mp4" './file0.mp4'
                
#     * clip 0 - 3.738633
ffmpeg -i './file0.mp4' -ss 00:00:00.0 -to 00:00:03.7 -c copy './file0Clip.mp4'
#     * stabilize
touch './_Ready/0_status_STAB'
ffmpeg -i './file0Clip.mp4' -vf vidstabdetect=stepsize=32:shakiness=7:accuracy=10:result=file0Clip_stab_tvs.trf -f null -
touch './_Ready/0_status_STABpass2'
ffmpeg -i './file0Clip.mp4' -vf vidstabtransform=input=file0Clip_stab_tvs.trf:zoom=0:smoothing=10,unsharp=5:5:0.8:3:3:0.4 -c:v libx264 -preset slow -crf 18 -c:a copy './file0ClipStab.mp4'
cp './file0ClipStab.mp4' './_Ready/0_VID_20230611_083522_nautilus001.mp4'
touch './_Ready/0_status_DONE'


#   file no: 1 
touch './_Ready/1_status_START'
cp "/home/yoyo/Videos/flashRoll_houseBank/VID_20230611_083522.mp4" './file1.mp4'
                
#     * clip 6.495215 - 10.119487
ffmpeg -i './file1.mp4' -ss 00:00:06.4 -to 00:00:10.1 -c copy './file1Clip.mp4'
cp './file1Clip.mp4' './_Ready/1_VID_20230611_083522_nautilus001.mp4'
touch './_Ready/1_status_DONE'
touch './_Ready/2_VID_20230611_083522.mp4_h256_2_2q.mp4_asRate_'
touch './_Ready/2_status_000'
touch './_Ready/3_VID_20230611_083550_2q.mp4_asRate_'
touch './_Ready/3_status_000'
touch './_Ready/4_VID_20230611_083603_2q.mp4_asRate_'
touch './_Ready/4_status_000'
touch './_Ready/5_VID_20230611_083631_2q.mp4_asRate_'
touch './_Ready/5_status_000'
echo "_Ready in: [ $(pwd)/_Ready ]"
#DONE