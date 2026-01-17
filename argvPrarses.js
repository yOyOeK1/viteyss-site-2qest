import path from 'node:path';
import fs from 'fs';
import { jsonToObject, jsonToShs } from './libs/vyArgs.js';
import readline from 'node:readline';

let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;
//let debug = true;


class conQery{

    constructor(){
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        
    }

    getQ=( queryStr, onLine = undefined )=>{
        this.rl.question( queryStr, line => {
            console.log(`Hi ${line}!`);
            
            this.rl.close();
            if( onLine != undefined ) onLine( line );

        });
    }
    getQSync=( queryStr)=>{
        let trl = this.rl;
        return new Promise((ok,no)=>{
            trl.question( queryStr, line => {
                console.log(`Hi ${line}!`);
                
                trl.close();
                ok( line );
    
            });

        });
    }
        
}


class argvFor2qest{
    constructor(){
        //console.log('[@] vy2qest-argvParser ...init');
    }
    handleRequestArgv = ( argsOpts ) => {
        
        if( 'help' in argsOpts ){
            console.group([`[h] help from - viteyss-site-2qest`,
            
            `--site=2qest ...`,
            ` * with aditional `,
            `  --files=... `,
            `    can be path to : .mov .mp4 .avi . multimedia`,
            `        or`,
            `    .2qest - to open saved file`,

            ` * with `,
            `   --files=[pathTo.2qest] --convertToSh=1`,
            `        will convert at spot and make file .sh from it`,
            ``].join('\n# ')
        ); 
        }

        if( 'site' in argsOpts && argsOpts.site == '2qest' ){
            console.group(`* --site=2qest .... `);  
              
            let flist = argsOpts.files.replaceAll(' /', '\n/').split('\n');
            
            if( flist.length > 0 && flist[ flist.length-1 ].substring( flist[ flist.length-1 ].length-1 ) == ' ' )
                flist[ flist.length-1 ] = flist[ flist.length-1 ].substring(0, flist[ flist.length-1 ].length-1 );


            if( 'convertToSh' in argsOpts ){
                console.log(`[?] Do you want to convert? ... [ ${flist} ]`);
                console.log('* convert to sh mode ... ');
                let filesRes = [];
                for( let fi=0,fc=flist.length; fi< fc; fi++){
                    let fStr = fs.readFileSync( flist[ fi ] ).toString();
                    if( fStr.length > 100 ){
                        let j = undefined;
                        try{
                            j = JSON.parse( fStr );
                        }catch(e){
                            console.log('EE file content to json error ...11',e);
                            process.exit(11);
                        }

                        let qestObj = jsonToObject( j );
                        console.log('* have qest object ...');
                        let shsStr = jsonToShs( qestObj, 'sh', process.env['USER'] );
                        console.log('* have sh ... ('+shsStr.length+') long');
                        
                        
                        let tFile = `${flist[ fi ]}`.split('.');
                        tFile.pop();
                        tFile = tFile.join('.')+'_convert_'+(Date.now())+'.sh';
                        
                        console.log('* target sh file [ '+tFile+' ]');
                        fs.writeFileSync( tFile, shsStr.join('\n') );
                        filesRes.push( `\n\tfiles: [ ${j.qest.files.length} ]\n\ttarget: [ ${tFile} ] ` );

                        //console.log('DONE ...77');
                        //process.exit(77);


                    }else{
                        console.log('EE file to small ...10');
                        process.exit(10);
                    }
                }


                console.log(
                    '* '+Date.now()+
                    '\n* convert to sh mode ... exit 1 DONE'+
                    '\n* files result:\n\t'+filesRes.join('\n\t') 
                );
                /*
                if( filesRes.length > 0 ){
                    
                    let qc = new conQery();
                    let qres = qc.getQSync( "# [q] Do you want to run int ... inPlace [N/y]");
                    console.log('A: ['+qres+']');
                    
                }
                */

                process.exit(11);
            }






            let startType = 'from context menu';
            let extraPayload = {};
            
            if( flist.length == 0 ){
                console.log('EE no --files= or files with space separation found');
                process.exit(-2);
            }

            if( flist.length == 1 && flist[0].endsWith('.2qest') ){
                console.log('* start with file .2qest .... ');
                

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
            console.log(`have files from selection size. ... info on collected data (${qestStr.length}) of file: [ ${qest.files.length} ]`
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