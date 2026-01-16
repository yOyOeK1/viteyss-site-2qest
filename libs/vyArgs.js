function vyArgsChk ( qestName = 'NaNo.O' ){

    let files = [];
    let rates = [];
    let fInfos = [];
    let opts = [];
    let notes = [];
    let tags = [];
    let startType = 'NaNStartSet';
    let extraPayload = undefined;
    
    if( 'vyArgs' in process.env.vy_config ){
        let args = process.env.vy_config.vyArgs;
        if( args.nameArgs =='2qest' ){
            startType = args.startType;
            extraPayload = 'extraPayload' in args ? args.extraPayload : undefined;
            let j = JSON.cloneRaw( args.payload.files );
            let myI = 0;
            for( let f of j ){
                files.push( f );
                rates.push('');
                notes.push('');
                tags.push([]);
                fInfos.push( args.payload.fInfos[ myI ] );
                opts.push( getOptsDef() );
                myI++;
            }
        }else 
            return -1;
    }else 
        return -1;

    let qest = {
        startType, extraPayload,
        name: qestName,
        files,
        rates,
        fInfos,
        opts,
        notes,
        tags,
    }
    return qest;


}


function getOptsDef( currentTime = -1, clipFrom = 0, clipTo = -1){
    return { 
        stabilize: false,
        rotMin: false, 
        rotPlu: false,
        currentTime: currentTime,
        duration: -1,
        clipFrom: clipFrom,
        clipTo: clipTo,
        inPoint: false,
        outPoint: false,
        status: -1,
        entryDate: Date.now()
    };
}


function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

let fTotalInSh = 0;
function atomTask( fNo, tNo, title, cmd ){
    let tr = [
        `echo -n "# " && date && echo -e "# file no: ${fNo} / ${fTotalInSh} --- ${title}" 2>&1 | tee -a "$tmpFFmpegLog"`,
        //`echo -e "\n\n ${title}" && date >> "$tmpFFmpegLog"`,
        //`# --- ${title} ... log at [ $tmpFFmpegLog ]`,
        `touch './_Ready/${fNo}__status_${tNo}_${title}'`,
        //`ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -vf "transpose=1" './file${fNameLast}RotP${ext}'  >> "$tmpFFmpegLog" `,
        'set +e',
        cmd,
        `endStatus="$?";`,
        'set -e',
        //`echo "* [ ${title} ] done with code [ $endStatus ]"`,
        `echo -e "#                              ... done" && echo -n "# " && date 2>&1 | tee -a "$tmpFFmpegLog"`,
        `echo "exitCode: $endStatus" >> "./_Ready/${fNo}__status_${tNo}_${title}_END"`
    ];
    return tr.join('\n');

}

function jsonToShs( j, cliType = 'sh' ){
    let qAgent = localStorageH.getK('device/name');// nameOfThisClient
   
    let shsDel = [];
    let shSleep = 5;
    let ffmpegArgs = '-loglevel -8';
    let deleteSectionApIndex = 17;
    let shs = [
        "#!/bin/bash",
        '#-------------------\n\n',
        '# stop on any error .....',
        'set -e\n\n',
        '# 2 Qest       [ '+j.qest.name+' ]',
        `# cliType:     [ ${cliType} ]`,
        `# generated at: [ ${qAgent} ]`,
        `# ffmpegArgs:  [ ${ffmpegArgs} ]`,
        '# YES - to do it ',
        'deleteSelectedThisTime="NO"',
        'TrashDirectory=`mktemp -d`',
        'tmpFFmpegLog="$TrashDirectory""/ffmpeg.log"',
        'echo "# Trash Directory: [ $TrashDirectory ]  ffmpeg log [ $tmpFFmpegLog ]"',
        //'tDir=`mktemp -d`',
        //'mkdir $tDir"/_Ready"',
        `echo "# winking dir is [$(pwd)] . . . . . all good? ... (wait ${shSleep} sec)"`,
        `sleep ${shSleep}`,
        '',
        "# delete section",
        // deleteSectionApIndex update to inject !
        "# delete section",
        "# delete section",
        "# delete section",
        '',
        '',
        'mkdir "./_Ready"',
        //'cd $tDir'        
    ];



    let q = j.qest;
    let fOkNo = 0;
    let baseDirF = ''; 
    fTotalInSh = q.files.length;
    for( let f=0,fc=q.files.length; f<fc; f++ ){
        console.log(` * [${f}] file .... rating [ ${q.rates[ f ]} ] `);

        let fIn = `${q.files[ f ]}`;
        let dirname = fIn.substring( 0, fIn.lastIndexOf('/') );
        let filename = fIn.substring( fIn.lastIndexOf('/')+1 );
        let ext = fIn.substring( fIn.lastIndexOf('.') );
        let fileNoExt = filename.substring( 0, filename.length-ext.length ); 
        //let fOut = `${dirname}/${fileNoExt}_fNo${f}${ext}`;
        
        let opt = q.opts[ f ];
        let fSufix = '';
        if( q.tags[ f ].length > 0 ) fSufix+= '_'+q.tags[ f ].join('_');

        shs.push(`\n\n# file no: ${f} ----------------[ ${q.rates[ f ]} ]  START\n#\n#`);

        
        

        if( q.notes[ f ] != '' ){
            //shs.push(`# notes ----------------  START`);
            shs.push(`# [note] # ${q.notes[ f ].replaceAll('\n','\n# [note] # ')}` );
            //shs.push(`# notes --------------------- END`);
        }
        if( q.tags[ f ].length > 0 ){
            shs.push(`# tags ---------------------- START`);
            shs.push(`#     * File source:  [ ${dirname}/${filename} ]`);
            shs.push(`#     * Tags:         2q:#`+q.tags[ f ].join('\t2q:#'));
            shs.push(`#     * At time:      ${Date()}`);
            shs.push(`# tags ---------------------- END`);
        }

        if( q.rates[ f ] == 'delete' ){
            if( cliType == 'sh' ){
                shsDel.push(`baseDirF="${dirname}"`);
                shsDel.push(`echo "* delete ... [ $baseDirF""/${filename}" ]`);
                shsDel.push(`mv "$baseDirF""/${filename}" "$TrashDirectory""/${filename}"`);

            }

        }else if( [ 'ok', 'mayby', 'maby' ].indexOf( q.rates[ f ] ) != -1 ){
            fSufix = q.rates[ f ]+"_"+fSufix;

            shs.push(`# work ---------------------- START
date >> "$tmpFFmpegLog"
baseDirF="${dirname}"
touch './_Ready/${f}__status_00_START'
touch './_Ready/${f}__status_01_DOWNLOAD_START'`);

            if( cliType == 'sh' ){
                //
                // sshfs -o allow_other,default_permissions,cache=yes,auto_cache,reconnect,uid=1000,gid=1000 \
                //  a@21.21.21.21:/data/data/com.termux/files/home/tmp \
                //  ./abciloo \
                //  -p 2222
                //
                shs.push(`cp --preserve=timestamps "$baseDirF""/${filename}" './file${f}${ext}'`);
                

            }else if( cliType == 'shs' ){
                shs.push(`scpFrom.sh local "$baseDirF""/${filename}" './file${f}${ext}'`);

            }
            shs.push(`touch './_Ready/${f}__status_02_DOWNLOAD_END'`);


            /*
            console.log(`   - opts :`,JSON.stringify( opt ),
                '\n dirname: ',dirname,
                '\n filename: ',filename,
                '\n ext: ',ext );
            */
            let fNameLast = `${f}`;
            let toCleanTmp = [];
            
            shs.push(`touch './_Ready/${f}__status_03_WORK_STAR'`);

            if( opt.clipTo > opt.clipFrom ){

                if( opt.clipFrom != 0 ||
                    ( opt.clipTo != opt.duration && opt.clipTo > opt.clipFrom )
                ){

                    let tStart = msToTime( parseInt(opt.clipFrom*1000.00) );
                    let tTotal = msToTime( parseInt(opt.clipTo*1000.00) );
                    let clipCmd = `ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -ss ${tStart} -to ${tTotal} -c copy './file${fNameLast}Clip${ext}' `;// >> "$tmpFFmpegLog"`;
                    toCleanTmp.push(`./file${fNameLast}Clip${ext}`);

                    if(1){
                        shs.push( atomTask( f, 4, 'CLIP', clipCmd) );
                    }else{

                        shs.push(`touch './_Ready/${f}__status_04_CLIP_STAR'`);
                        shs.push('echo -e "\n\n clip " && date >> "$tmpFFmpegLog"')
                        shs.push(`# --- clip ${opt.clipFrom} - ${opt.clipTo} ... log at [ $tmpFFmpegLog ]`);
                        shs.push( clipCmd );
                        
                        shs.push('endStatus="$?";echo "* done with code [ $endStatus ]"');
                        shs.push('echo "exitCode: $endStatus" >> "./_Ready/0__status_05_CLIP_END"');
                        //shs.push(`touch './_Ready/${f}__status_05_CLIP_END'`);
                    }
                    fNameLast+= 'Clip';
                }
            }


            if( opt.stabilize ){
                let stabi1 = `ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -vf vidstabdetect=stepsize=32:shakiness=7:accuracy=10:result=file${fNameLast}_stab_tvs.trf -f null - `;// >> "$tmpFFmpegLog"`;
                let stabi2 = `ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -vf vidstabtransform=input=file${fNameLast}_stab_tvs.trf:zoom=0:smoothing=10,unsharp=5:5:0.8:3:3:0.4 -c:v libx264 -preset slow -crf 18 -c:a copy './file${fNameLast}Stab${ext}' `;// >> "$tmpFFmpegLog"`;
                toCleanTmp.push(`./file${fNameLast}_stab_tvs.trf`);
                toCleanTmp.push(`./file${fNameLast}Stab${ext}`);
                
                if(1){
                        shs.push( atomTask( f, 6, 'STABILIZE_STEPpass1', stabi1) );
                        shs.push( atomTask( f, 7, 'STABILIZE_STEPpass2', stabi2) );
                }else{
                    shs.push('echo -e "\n\n stabilize - step 1" && date >> "$tmpFFmpegLog"')
                    shs.push('# --- stabilize ... log at [ $tmpFFmpegLog ]');
                    shs.push(`touch './_Ready/${f}__status_06_STABpass1'`);
                    shs.push(stabi1);
                    shs.push('endStatus="$?";echo "* done with code [ $endStatus ]"');
                    shs.push('echo "exitCode: $endStatus" >> "./_Ready/0__status_06_STABpass1_END"');


                    shs.push('echo -e "\n\n stabilize - step 2" && date >> "$tmpFFmpegLog"')
                    shs.push(`touch './_Ready/${f}__status_07_STABpass2'`);
                    shs.push(stabi2);
                    shs.push('endStatus="$?";echo "* done with code [ $endStatus ]"');
                    shs.push('echo "exitCode: $endStatus" >> "./_Ready/0__status_07_STABpass2_END"');
                }

                shs.push(`# --- stabilize - test if it's ok  --- START
if test -e './file${fNameLast}Stab${ext}';then 
    echo "-  ok file is at place"
    if test \`du './file${fNameLast}Stab${ext}' | awk '{print $1}'\` -lt "100";then
        echo "- file to small less then 100 kb ... swaping to org"
        touch './_Ready/${f}__status_07_STABpass2_FILE_TO_SMALL'
        echo -e "\n\n EE file to small EE" && date >> "$tmpFFmpegLog"
        mv './file${fNameLast}Stab${ext}' \`mktemp\`
        cp './file${fNameLast}${ext}' './file${fNameLast}Stab${ext}'
    fi
else 
    echo "- file missing ... swap to org"
    touch './_Ready/${f}__status_07_STABpass2_FILE_MISSING'
    echo -e "\n\n EE file missing EE" && date >> "$tmpFFmpegLog"
    cp './file${fNameLast}${ext}' './file${fNameLast}Stab${ext}'
fi                 
# --- stabilize - test if it's ok --- END`);
                
                fNameLast+= 'Stab';
            }

            if( opt.rotMin ){
                let rotMinCmd = `ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -vf "transpose=2" './file${fNameLast}RotM${ext}' `;// >> "$tmpFFmpegLog"`;
                toCleanTmp.push(`./file${fNameLast}RotM${ext}`);
                if(1){
                    shs.push( atomTask( f, 8, 'ROTATE_MIN', rotMinCmd) );
                }else{
                    shs.push('echo -e "\n\n rotMin" && date >> "$tmpFFmpegLog"')
                    shs.push(`# --- rotMin ... log at [ $tmpFFmpegLog ]`);+
                    shs.push(`touch './_Ready/${f}__status_08_rotMin'`);
                    shs.push( rotMinCmd );
                    shs.push('endStatus="$?";echo "* done with code [ $endStatus ]"');
                    shs.push('echo "exitCode: $endStatus" >> "./_Ready/0__status_08_rotMin_END"');
                }
                fNameLast+= 'RotM';

            }



            if( opt.rotPlu ){
                let rotPluCmd = `ffmpeg ${ffmpegArgs} -i './file${fNameLast}${ext}' -vf "transpose=1" './file${fNameLast}RotP${ext}'  `;// >> "$tmpFFmpegLog"`;
                toCleanTmp.push(`./file${fNameLast}RotP${ext}`);
                if(1){
                    shs.push( atomTask( f, 9, 'ROTATE_PLU', rotPluCmd) );
                }else{
                    shs.push('echo -e "\n\n rotPlu" && date >> "$tmpFFmpegLog"')
                    shs.push(`# --- rotPlu ... log at [ $tmpFFmpegLog ]`);
                    shs.push(`touch './_Ready/${f}__status_09_rotPlu'`);
                    shs.push( rotPluCmd );
                    shs.push('endStatus="$?";echo "* done with code [ $endStatus ]"');
                    shs.push('echo "exitCode: $endStatus" >> "./_Ready/0__status_09_rotPlu_END"');
                }
                fNameLast+= 'RotP';
                
            }

            shs.push(`mv './file${fNameLast}${ext}' './file${f}_DONE${ext}'`);
            
            shs.push(`touch './_Ready/${f}__status_10_WORK_END'\n`);
                //'./${f}_${j.qest.name}_${fileNoExt}_${ext}'`);


            shs.push(`touch './_Ready/${f}__status_11_UPLOAD_START'`);
            let targetFileName = `${j.qest.name}_${f}_${fileNoExt}_"$qAgent"_${fSufix}${ext}`;
            if( cliType == 'sh' ){
                shs.push(`cp "./file${f}_DONE${ext}" "./_Ready/${targetFileName}"`);
                shs.push('timeStampSrc=`date -R -r "$baseDirF""/'+filename+'"`');
                shs.push('echo "# * preserving timestamp of file [ $timeStampSrc ]"');
                //shs.push('echo "# * to clean temporary files ... "; for toCleanTmp in `echo "'+toCleanTmp.join(" ")+'"`;do echo "   * rm: ... [ $toCleanTmp ]"; if test -e "$toCleanTmp";then rm "$toCleanTmp"; fi;done; echo "";');
                shs.push(`touch -d "$timeStampSrc" "./_Ready/${targetFileName}"`);
                
            } else if( cliType == 'shs' ){
                shs.push(`scpIt.sh local "./file${f}_DONE${ext}" "$baseDirF""/${targetFileName}"`);

            }
            shs.push(`touch './_Ready/${f}__status_14_UPLOAD_FINISH'`);


            shs.push(`#\n# work ---------------------- END\n#`);
        }
        
        let rate = q.rates[ f ]?q.rates[ f ]:'NaN';
        shs.push(`touch './_Ready/${f}_${fileNoExt}_2q${ext}_asRate_${rate}'`);
        shs.push(`touch './_Ready/${f}__status_000${rate}'`);
        
        shs.push(`#\n#\n# file no: ${f} ----------------  END\n\n`);
    }
    shs.push(`echo "_Ready in: [ $(pwd)/_Ready ]"`);
    shs.push(`#DONE`);

    if( cliType == 'sh' ) // add delete section
        shs.splice( deleteSectionApIndex, 0, `# delete selected as DELETE ?\nif test "YES" = "$deleteSelectedThisTime";then\n\n\t`+shsDel.join('\n\t')+`\n\nfi\n# delete selected as DELETE ---- END` );


    return shs;
}


if( process && 'argv' in process && process.argv.length >= 3 ){
    if( `${process.argv[1]}`.endsWith('/vyArgs.js') ){
        const args = process.argv.slice(2);

        if( process.argv.length == 3 && process.argv[2].startsWith('--jsonToShs=') ){
            let jStr = `${process.argv[2].substring(12)}`;
            let j = -1;
            try{ j = JSON.parse( jStr );
            }catch(e){ 
                console.error('EE on processing json ',e, ' \n jStr['+jStr+']');
                process.exit( -1 );
            }

            if( j != -1 ){
                let sh = jsonToShs( j );
                console.log('\n\n\n---------------------------------------\n=====================================\n',
                    sh.join('\n'));       
            }


        }else{
            console.log("try --help");
        }

    }
}


export{ vyArgsChk,jsonToShs }