<template>



2 App mStatus:({{ mStatus }})
<div style="display: inline-block;">
    <TwoSplash />
</div>


<button @click="dumpQuest()">d</button>

<div v-if="file!=-1">
    <TwoFileList 
        ref="tfl"
        :qestAs="file"
    />



</div>


</template>

<script>
import { vyArgsChk } from '../libs/vyArgs';
import FilesList from './filesList.vue';
import Splash from './splash.vue';

export default{
components:{
    "TwoSplash": Splash,
    "TwoFileList": FilesList
},
data(){

    let mStatus = 'loaded';
    let qArg = vyArgsChk( 'nautilus :)' );
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
    dumpQuest(){
        let q = JSON.cloneRaw( this.$refs.tfl.onGetQest() );
        console.log('q now : ',JSON.dumpNice( q ));
        setOpts.FileDialog('save', JSON.dumpNice( q ) );

    }
}

    
}

</script>