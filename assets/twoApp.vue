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
<button @click="onCli()">Cli</button>

cli:
<button @click="onCli('exe')">EXE</button>
<button @click="onExecCli('cal')">call</button>
<button @click="onExecCli('free')">free</button>
<button @click="onExecCli('df -hm')">df</button>
<button @click="onExecCli('pwd')">pwd</button>
<button @click="onExecCli('ls /tmp')">ls /tmp</button>
<input type="text" @change="onExecCli($event.target.value)"></input>



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

export default{
components:{
    "TwoSplash": Splash,
    "TwoFileList": FilesList
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
        

    };
},
methods:{
    onSave(){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        console.log('q now : ',JSON.dumpNice( q ));
        setOpts.FileDialog('save', JSON.dumpNice( q ) );

    },
    onLoad(){
        let fd = null;
        let onLoadDone = ( msg ) => {
            console.log('ok so data to load is \n\n',msg,'\n\n');
            //this.onLoadToLocalFromString( msg );
            let j = JSON.parse( msg );
            this.$refs.tfl.onSetQest( j );
            fd.app.closePanel();
        }; 

        fd = setOpts.FileDialog('load',{'onDone':onLoadDone});
    },
    onCli( action = 'save' ){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        let shs = jsonToShs( q );

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

    /*
ottO.newTask({'q':'exeIt/{"webCmdSubProcess": "[sh,-c,cal]","mqtt":false,"stdout":"0","pH":"-1"}'}).then(r=>console.log( `resq:[ \n`,JSON.dumpNice(JSON.parse(r)),`\n ]` ));
    */
    onExecCli( cmd ){
        let cEx = `[sh,-c, ${cmd}]`;
        let cmdTem = {
            "webCmdSubProcess": `b64[${btoa(cmd)}]`,
            "mqtt":0,
            "pH":3
        };
        ottO.newTask({
            'q': 'exeIt/'+JSON.stringify( cmdTem )
        }).then(r=>console.log( `resq:[ \n`,JSON.dumpNice(JSON.parse(r)),`\n ]` ));
    }
}

    
}

</script>