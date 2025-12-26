<template>



2 App mStatus:({{ mStatus }})
<!--
    <div style="display: inline-block;">
        <TwoSplash />
    </div>
    -->


<button @click="onLoad()">Load</button>
<button @click="onSave()">Save</button>
<button @click="onClean()">Clean</button>

<select v-model="cliType">
    <option v-for="cliT in cliTypes" >{{ cliT }}</option>
</select>
<button @click="onCli()">Cli</button>


<input type="checkbox" v-model="debExec"></input>
<div v-if="debExec">

    cli:
    <button @click="onCli('exe')">EXE</button>
    <button @click="onExecCli('cal')">call</button>
<button @click="onExecCli('free')">free</button>
<button @click="onExecCli('df -hm')">df</button>
<button @click="onExecCli('pwd')">pwd</button>
<button @click="onExecCli('ls /tmp')">ls /tmp</button>
<button @click="onExecCli('cd ../viteyss-site-2qest/shs; ./cmdInSsh.sh h free true')">free at hu</button>
<br></br>
<input type="text" v-model="inputCmd" ></input>
<button @click="onExecCli(inputCmd)">local</button>
<button @click="onExecCliOfInput('h')">to hu</button>
<button @click="onExecCliOfInput('iloo')">to ilo</button>
<button @click="onExecCliOfInput('all')">all</button>



<hr></hr>
</div>




<div v-if="file!=-1">
    <TwoFileList 
        ref="tfl"
        :qestAs="file"
    />



</div>


</template>

<script>
import { jsonToShs, vyArgsChk } from '../libs/vyArgs';
import FilesList from './filesList.vue';
import Splash from './splash.vue';
import {toRaw} from 'vue';

export default{
components:{
    "TwoSplash": Splash,
    "TwoFileList": FilesList
},
mounted(){
    setTimeout(()=>{

        let f = '';
        f = 'nst/2qest/251219tt_setOfTwo.js';
        f = 'nst/251226tt094859_2q_test1.js';
        this.test_loadFileOnStart( f );

    },1000);
},
data(){

    let mStatus = 'loaded';
    let qArg = vyArgsChk( 'nautilus001' );
    console.log('2Qest loaded with args?',qArg);
    if( qArg != -1 ){
        mStatus = 'argsStart';
    }
    return {
        mStatus,
        file: qArg,
        debExec: false,
        cliType: 'sh',
        cliTypes: ['sh','shs','agent'],
        
        inputCmd: ''
    };
},
methods:{
    onSave(){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        console.log('q now : ',JSON.dumpNice( q ));
        setOpts.FileDialog('save', JSON.dumpNice( q ) );

    },

    /** so one liner iFs file load */
    async test_loadFileOnStart( iFsPath = undefined ){
        let f = await iFs.readFile( iFsPath);
        this.onLoadFromJson( JSON.parse(f) );

    },

    onLoadFromJson( j ){
        this.$refs.tfl.onSetQest( j );
    },

    onLoad(){
        let fd = null;
        let onLoadDone = ( msg ) => {
            console.log('ok so data to load is \n\n',msg,'\n\n');
            //this.onLoadToLocalFromString( msg );
            let j = JSON.parse( msg );
            this.onLoadFromJson( j );
            fd.app.closePanel();
        }; 

        fd = setOpts.FileDialog('load',{'onDone':onLoadDone});
    },
    onCli( action = 'save' ){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        let shs = jsonToShs( q, toRaw( this.cliType )  );

        if( action == 'save' )
            setOpts.FileDialog('save', shs.join('\n') );
        else{

            this.onExecCli(
                `tmpD=$(mktemp -d); 
                tmpF=$tmpD"/shs.sh"
                resQ="Do you want to execute it? [Y/n]"
                b64Cmd=${btoa(shs.join('\n'))};
                echo $b64Cmd | base64 -d > $tmpF;
                chmod +x $tmpF;
                
                #gnome-terminal -e 'bash -c "echo $b64Cmd; cat '$tmpF';echo;echo '$tmpF' ; chmod +x '$tmpF'; echo gogo?; sleep 5; '$tmpF'; tree -alh ./; echo DONE; sleep 10; exec bash"'
                
                gnome-terminal -e 'bash -c "cd '$tmpD';tree -alh ./; pwd; sleep 5; time ./shs.sh; tree -alh ./; exec bash"';
                echo "DONE"
                
                `

            );
        }
    },

    onExecCliOfInput( toWho = 'local' ){

        if( toWho == 'all'){
            for(let agent of ['local','h','iloo'] ){
                this.onExecCli( `cd ../viteyss-site-2qest/shs; ./cmdInSsh.sh ${agent} "${this.inputCmd}" true` );
            }
        }else{
            this.onExecCli( `cd ../viteyss-site-2qest/shs; ./cmdInSsh.sh ${toWho} "${this.inputCmd}" true` );
        }

    },


    /*
ottO.newTask({'q':'exeIt/{"webCmdSubProcess": "[sh,-c,cal]","mqtt":false,"stdout":"0","pH":"-1"}'}).then(r=>console.log( `resq:[ \n`,JSON.dumpNice(JSON.parse(r)),`\n ]` ));
    */
    onExecCli( cmd ){
        
        let cEx = `[sh,-c, ${cmd}]`;
        let cmdTem = {
            "webCmdSubProcess": `b64[${btoa(cmd)}]`,
            "mqtt":0,
            "pH":'i'+Date.now()+Math.random()
        };
        ottO.newTask({
            'q': 'exeIt/'+JSON.stringify( cmdTem )
        }).then(r=>{
            console.log( `resq:[ \n`,JSON.dumpNice(JSON.parse(r)),`\n ]` );
            let j = JSON.parse( r );
            if( j.length != 2 || j[0] != 0 || j[1][ j[1].length-1 ] != "" ){
                console.log('EE cmd back wrong !');
                return -1;
            }else{
                let msgL = j[1];
                msgL.splice( msgL.length-1, 1 );
                console.log(`Ruselt for cmd \n * cmd: ${cmd}\n * result :\n`,msgL,"\n-------------------");

            }


        });
    }
}

    
}

</script>