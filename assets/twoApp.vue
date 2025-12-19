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
    onCli(){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        let shs = jsonToShs( q );
        setOpts.FileDialog('save', shs.join('\n') );
    }
}

    
}

</script>