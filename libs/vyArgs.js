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

export{ vyArgsChk }