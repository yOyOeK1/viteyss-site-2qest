<template>
<div
    :style=" fNo==fSelect?`background-color:#cdcdcd;`:'' +
        `border-bottom:solid gray 1px;`"
    @click="$emit('file-select-update',fNo);"
    :title="item"
    >
    <b>
        {{ rate!=''?rate+' | ':'' }}
    </b><small>
        {{ opts.inPoint?'in@':' ' }}
        {{ opts.currentTime!=-1?opts.currentTime+" | ":'' }}
        {{ opts.inPoint?'@out':' ' }}
    </small> | 
    <b>{{ getName() }}</b> 
    
    
    <!--
        <small>fpath:{{ getDirname() }}</small> fNo:({{ fNo }})  
        {{ item }}
    -->

    <VYButtonContext
        title="File info"
        icon="<i class='fa-solid fa-file-import'></i>"
        v-model:is-showing="showFileInfo"
        >
        <small v-html="dofInfo()" />
    </VYButtonContext>
</div>
</template>

<script>

import VyButtonContext from '../../../../Apps/viteyss-site-settings1/UiAssets/vyButtonContext.vue';

export default{
components:{
    "VYButtonContext": VyButtonContext
},
emits:[ 'file-select-update' ],
props: [ 'item','fInfo', 'fNo', 'fSelect', 'rate', 'opts' ],
data(){ return { showFileInfo:false }; },
methods:{
    getName(){ return this.item.substring( this.item.lastIndexOf('/')+1 ); },
    getDirname(){ return this.item.substring( 0, this.item.lastIndexOf('/') ); },
    dofInfo(){ 
        let tr = []; 
        for(let k of Object.keys( this.fInfo  )){
            tr.push( `<small>${k}: </small>${this.fInfo[ k ]}` );
        }
        console.log('fInfo: ',tr.join('<br>'));
        return tr.join('<br>');
    },
}
}
</script>