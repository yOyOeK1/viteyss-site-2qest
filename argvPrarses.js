import path from 'node:path';
import fs from 'fs';

let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;
//let debug = true;

class argvFor2qest{
    constructor(){
        //console.log('[@] vy2qest-argvParser ...init');
    }
    handleRequestArgv = ( argsOpts ) => {
        
        if( 'site' in argsOpts && argsOpts.site == '2qest' ){
            console.group(`* --site=2qest .... `);  
              

            let flist = argsOpts.files.replaceAll(' /', '\n/').split('\n');
            let startType = 'from context menu';
            let extraPayload = {};
            
            if( flist.length == 0 ){
                console.log('EE no --files= or files with space separation found');
                process.exit(-2);
            }

            if( flist.length == 1 && flist[0].endsWith('.2qest') ){
                console.log('* start with file .2qest ....');
                let twoQf = fs.readFileSync( flist[0] ).toString();
                let jqf = undefined;
                try{
                    startType = 'from context menu with .2qest';
                    extraPayload['twoQestRaw'] = twoQf;
                    extraPayload['twoQestFilePath'] = flist[0];
                    jqf = JSON.parse( twoQf ); 
                    flist = jqf.qest.files;

                }catch(e){ 
                    console.log('EE start with .2qest file but it\'s not going good ...',e);
                    process.exit(10);
                }
                
                //

            }

            //console.log('Exit for now ...');
            //process.exit(-11);


            let qest = {startType, files:[],dirs:[],fInfos:[]};
            flist.forEach( f => {
                if ( f.length > 5 ){
                    let src = f;
                    while( src.startsWith(' /') && src.length > 5 ){
                        src = src.substring(1);
                    }
                    qest.files.push( src );
                    qest.dirs.push( path.dirname( src ));
                    if(0){
                        let fInfo = -1;
                        try{
                            fInfo = fs.statSync( src );                
                        }catch(e){
                            console.log('EE file info no',e);
                        }
                        qest.fInfos.push( fInfo );

                    }else{
                        qest.fInfos.push(undefined);
                    }
                }
            });
            let qestStr = JSON.stringify(qest,null,4);
            console.log(`have files from selection size. ... info on collected data (${qestStr.length}) of file: [ ${extraPayload['twoQestFilePath']} ]`
            //    ,qestStr
            );
            //process.exit(-1);
            
        
        
            /*envviteyss= {
                nameArgs: '2qest', 
                startType, extraPayload,
                'payload': qest,
                fsAllow: [...new Set(qest.dirs)],
                runIt: true,
                name: 'local',
            };*/


            console.groupEnd();

            return {
                nameArgs: '2qest', 
                startType, extraPayload,
                'payload': qest,
                fsAllow: [...new Set(qest.dirs)],
                runIt: true,
                name: 'local',
            };

        }

        //return '3456789987654';
        return undefined;
    }
}

export { argvFor2qest }