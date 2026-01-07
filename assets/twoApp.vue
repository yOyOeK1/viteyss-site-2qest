<template>



<div
    class="twoAppBar"
    style="
        background-color: darkgreen;
        color: white;
        border-bottom: 2px solid black;
        font-size: 80%;
        
    ">
    2App | mStatus:({{ mStatus }}) |

    <select v-model="appViewMode">
        <option v-for="avm in appViewModes">
            {{avm}}
        </option>
    
    </select>

    | 

    [<a 
        title="Show keyboard short cuts map"
        @click="showKeymap = true">k</a>]

    <div v-if="showKeymap">
        <KeysMap 
            @key-map-close="onEmit_hideKeyMap"/>
    </div>
    
    | {{ getVersion }} 

    <div v-if="autoSaveEnabled" 
        title="Auto save"
        style="display: inline;"> | <i id="twoAppAutoSaveIndi" class="fa-solid fa-robot"></i></div>


</div>


<!--
    <div style="display: inline-block;">
        <TwoSplash />
    </div>
    -->
<div
    class="twoAppBar"
    style="
        background-color: rgb(60, 45, 59);
        color: white;
        border-bottom: 2px solid black;
        font-size: 80%;
              
    "
    >


    <VYButtonContext
        
        title="File / new / open / save ..."
        icon="<i class='fa-solid fa-ellipsis-vertical'></i>"
        v-model:is-showing="showMenuFile"
        >
        <pre><b>Files:</b>
        <button @click="onClean()"><i class="fa-solid fa-file-circle-plus"></i>New file ...</button>
        <button @click="onLoad()"><i class="fa-solid fa-upload"></i>Open file ...</button>
        <button @click="onSave()"><i class="fa-solid fa-floppy-disk"></i>Save file as ...</button></pre>

        <div 
            class="toolsRadio"
            title="Auto save">
            <input type="checkbox" v-model="autoSaveEnabled" 
                style="display: inline;"
                id="autoSaveEnabledInput"/>
            <label for="autoSaveEnabledInput"
                style="display: inline;">
                <i class="fa-solid fa-robot"></i>&nbsp;Auto save
            </label>
        </div>


    

    </VYButtonContext>

    |

    <select v-model="cliType">
        <option v-for="cliT in cliTypes" >{{ cliT }}</option>
    </select>
    <button @click="onCli()">Cli</button>

    |

    <input type="checkbox" v-model="debExec"
        title="debug stuff"></input>



</div>



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

<button @click="onEmit_makeAutoSave('test1','abc')">thusetu</button>

<div v-if="file!=-1" style="display: inline;">
    <TwoFileList 
        ref="tfl"
        :qestAs="file"
        :viewMode="appViewMode"
    />



</div>



</template>

<style>

@font-face {
  font-family: hackvyss;
  src: url("/libs/fonts/Hack-Regular.woff");
}

body {
    font-family: "hackvyss";
}

.twoAppBar{
    padding: 5px;
    font-family: hackvyss;
}


</style>


<script>
import { jsonToShs, vyArgsChk } from '../libs/vyArgs';
import {toRaw} from 'vue';
import FilesList from './filesList.vue';
import { animate as ajsanimate } from 'animejs';
import iFs from 'indexeddb-fs';
import Splash from './splash.vue';
import VyButtonContext from '@viteyss-site-settings1/UiAssets/vyButtonContext.vue';
import KeysMap from './keysMap.vue';

export default{
components:{
    "TwoSplash": Splash,
    "TwoFileList": FilesList,
    "VYButtonContext": VyButtonContext,
    "KeysMap": KeysMap
},
mounted(){
    setTimeout(()=>{

        let f = '';
        f = 'nst/2qest/251219tt_setOfTwo.js';
        f = 'nst/251226tt094859_2q_test1.js';
        f = 'nst/2Qest/251228tt093334.2qest';
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

    setTimeout(()=>{
        this.autoSaveEnabled = true;
    });

    return {
        autoSaveEnabled: false,
        autoSaveIterator: -1,
        autoSaveLastState: '',
        appViewMode: 'basic1',
        appViewModes: ['basic1','PiP'],

        showMenuFile: false,
        showKeymap: false,

        mStatus,
        file: qArg,
        debExec: false,
        cliType: 'sh', 
        cliTypes: ['sh','shs','twoCount'],
        
        inputCmd: ''
    };
},
watch:{
    appViewMode(nv, ov){
        console.log('twoApp view mode switch ['+nv+']');
    },
    autoSaveEnabled( nv, ov ){
        let tfl = this.$refs.tfl;
        //console.log('autoSaveEnabele:',nv,' tfl type ',`${(typeof tfl)}`, tfl, ' qest in tfl', ('qest' in tfl));
        //if( !this.$refs.tfl || this.$refs.tfl == null|| this.$refs.tfl == 'null'  ){
        //return 1;
        if( !('qest' in tfl) ){

        }else if( nv ){
            this.autoSaveIterator = setInterval(()=>{
                let tflt = this.$refs.tfl;
                if( !('qest' in tfl) || tflt == null ){
                    
                }else{
                    let qest = tflt.onGetQest();
                    let fileName = `${tflt.qest.name}`;
                    let q = JSON.cloneRaw( qest );
                    let currentState = `${JSON.dumpNice( q )}`;
                    console.log('autosave chk same',
                        currentState.length, ' to ', `${this.autoSaveLastState}`.length, 
                        //'\ndata curren\n',currentState                    
                    );
                    if( `${this.autoSaveLastState}` != currentState ){                    
                        $.toast(`<i class="fa-solid fa-robot"></i>&nbsp;Auto save ...`);
                        this.autoSaveLastState = currentState;   
                        this.onEmit_makeAutoSave( 
                            toRaw(fileName), 
                            JSON.dumpNice(toRaw(qest)) 
                        );                        
                
                    }else{
                        $.toast(`<i class="fa-solid fa-robot"></i>&nbsp;Auto skipp it's same ...`);
                    
                    }
                }

            },
            //5000);
            60000*5); // 5 min


        }else if( this.autoSaveIterator != -1 ){
            clearInterval( this.autoSaveIterator );
            this.autoSaveIterator = -1;
            this.autoSaveLastState = '';
            this.currentState = '';

        }
    }
},
computed:{
    getVersion(){
        return siteByKey.s_vys2qestPage.o.package.version;
    }
},
methods:{


    async onEmit_makeAutoSave( fileName, data ){   
        if( fileName == '' ) fileName = 'NotNameFile'     
        await iFs.createDirectory('/nst/2qestAutoSave');
        await iFs.writeFile( `/nst/2qestAutoSave/${fileName}.2qest`, data );
        console.log('makeAutoSave DONE');
        ajsanimate('#twoAppAutoSaveIndi',{
            opacity:[0.5,1,0.5,1],
            rotate:[-45,+45,0],
            alterate: true,
            loop:2,
            duration:500
        });
    },

    onEmit_hideKeyMap(){ this.showKeymap = false; },

    onSave( cbOnSave = undefined ){
        let fileName = `${this.$refs.tfl.qest.name}`;
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        //console.log('q now : ',JSON.dumpNice( q ));
        setOpts.FileDialog('save', {
            fileName,
            ext:'.2qest',
            data:JSON.dumpNice( q ),
            onSave: cbOnSave
        } );
        this.showMenuFile = false;
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
        let qRes =this.$refs.tfl.onCanDoNewQery( 'loading' );
        this.showMenuFile = false;
        if( qRes == 'ok' ){
            this.onLoad_execute();
        }else if( qRes == 'save' ){
            let cbOnSave = ( event = 'NaN' ) => {
                console.log( 'load after save. event:',event);
                this.onLoad_execute();
            };
            this.onSave( cbOnSave );
        }
    },
    onLoad_execute(){
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
    


    onClean(){
        let qRes =this.$refs.tfl.onCanDoNewQery( 'new' );
        if( qRes == 'ok' ){
            this.$refs.tfl.onClean();
        }else if( qRes == 'save' ){
            let cbOnSave = ( event = 'NaN' ) => {
                console.log( 'make clear after save. event:',event);
                this.$refs.tfl.onClean();
            };
            this.onSave( cbOnSave );
        }
        this.showMenuFile = false;
    },


    onCli( action = 'save' ){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        let shs = jsonToShs( q, toRaw( this.cliType )  );

        if( action == 'save' )
            
        
        setOpts.FileDialog('save', {
            ext:'.'+this.cliType,
            data: shs.join('\n'),
        });



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

