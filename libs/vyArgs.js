function vyArgsChk ( qestName = 'NaNo.O' ){

    let files = [];
    let rates = [];
    let fInfos = [];
    let opts = [];

    
    if( 'vyArgs' in process.env.vy_config ){
        let args = JSON.parse(process.env.vy_config.vyArgs);
        if( args.name =='2qest' ){
            let j = JSON.cloneRaw( args.payload.files );
            let myI = 0;
            for( let f of j ){
                files.push( f );
                rates.push('');
                fInfos.push( args.payload.fInfos[ myI ] );
                opts.push( getOptsDef() );
                myI++;
            }
        }else 
            return -1;
    }else 
        return -1;

    let qest = {
        name: qestName,
        files: files,
        rates: rates,
        fInfos: fInfos,
        opts: opts,
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

function jsonToShs( j ){
    let shs = ['#-------------------\n\n\n\n',
        '# 2 Qest  '+j.qest.name,
        //'tDir=`mktemp -d`',
        //'mkdir $tDir"/_Ready"',
        'mkdir "./_Ready"',
        'echo " * temp dir is [$(pwd)]" . . . . .',
        //'sleep 1',
        //'cd $tDir'
        
    ];
    console.log(j);
    let q = j.qest;
    let fOkNo = 0;
    for( let f=0,fc=q.files.length; f<fc; f++ ){
        console.log(` * [${f}] file .... rating [ ${q.rates[ f ]} ] `);

        let fIn = `${q.files[ f ]}`;
        let dirname = fIn.substring( 0, fIn.lastIndexOf('/') );
        let filename = fIn.substring( fIn.lastIndexOf('/')+1 );
        let ext = fIn.substring( fIn.lastIndexOf('.') );
        let fileNoExt = filename.substring( 0, filename.length-ext.length ); 
        let fOut = `${dirname}/${fileNoExt}_fNo${f}${ext}`;
        
        let opt = q.opts[ f ];
        if( q.rates[ f ] == 'ok' ){

            shs.push(`\n
#   file no: ${f} 
touch './_Ready/${f}_status_START'
cp "${dirname}/${filename}" './file${f}${ext}'
                `);

            console.log(`   - opts :`,JSON.stringify( opt ),
                '\n dirname: ',dirname,
                '\n filename: ',filename,
                '\n ext: ',ext );
            let fNameLast = `${f}`;


            if( opt.clipTo > opt.clipFrom ){

                if( opt.clipFrom != 0 ||
                    ( opt.clipTo != opt.duration && opt.clipTo > opt.clipFrom )
                ){
                    let tStart = msToTime( parseInt(opt.clipFrom*1000.00) );
                    let tTotal = msToTime( parseInt(opt.clipTo*1000.00) );
                    shs.push(`#     * clip ${opt.clipFrom} - ${opt.clipTo}\n`+
                        `ffmpeg -i './file${fNameLast}${ext}' -ss ${tStart} -to ${tTotal} -c copy './file${fNameLast}Clip${ext}'`
                        );
                    fNameLast+= 'Clip';
                }
            }


            if( opt.stabilize ){
                shs.push(`#     * stabilize`);
                shs.push(`touch './_Ready/${f}_status_STAB'`);
                shs.push(`ffmpeg -i './file${fNameLast}${ext}' -vf vidstabdetect=stepsize=32:shakiness=7:accuracy=10:result=file${fNameLast}_stab_tvs.trf -f null -`);
                shs.push(`touch './_Ready/${f}_status_STABpass2'`);
                shs.push(`ffmpeg -i './file${fNameLast}${ext}' -vf vidstabtransform=input=file${fNameLast}_stab_tvs.trf:zoom=0:smoothing=10,unsharp=5:5:0.8:3:3:0.4 -c:v libx264 -preset slow -crf 18 -c:a copy './file${fNameLast}Stab${ext}'`);
            
                fNameLast+= 'Stab';
            }

            if( opt.rotMin ){
                shs.push(`#     * rotMin\n`+
                    `ffmpeg -i './file${fNameLast}${ext}' -vf "transpose=2" './file${fNameLast}RotM${ext}'`
                );
                fNameLast+= 'RotM';

            }

            if( opt.rotPlu ){
                shs.push(`#     * rotPlu\n`+
                    `ffmpeg -i './file${fNameLast}${ext}' -vf "transpose=1" './file${fNameLast}RotP${ext}'`
                    );
                fNameLast+= 'RotP';
                
            }
            
            
            shs.push(`cp './file${fNameLast}${ext}' './_Ready/${f}_${fileNoExt}_${j.qest.name}${ext}'`);
            shs.push(`touch './_Ready/${f}_status_DONE'`);
        }else{
            shs.push(`touch './_Ready/${f}_${fileNoExt}_2q${ext}_asRate_${q.rates[ f ]}'`);
            shs.push(`touch './_Ready/${f}_status_000${q.rates[ f ]}'`);
        }

    }
    shs.push(`echo "_Ready in: [ $(pwd)/_Ready ]"`);
    shs.push(`#DONE`);
    
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