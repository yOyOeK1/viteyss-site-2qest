<template>



<div
    v-if="fSelect!=-1 && 'stabilize' in qest.opts[ fNo ]"
    :style=" fNo==fSelect?`background-color:#cdcdcd;`:'' +
        `border-bottom:solid gray 1px;`"
    @click="$emit('file-select-update',fNo);"
    :title="qest.files[ fNo ]"
    >
    <b>
        {{ qest.rates[ fNo ]!=''?qest.rates[ fNo ]+' | ':'' }}
    </b><small>
        {{ qest.opts[ fNo ].stabilize?'S':' ' }}
        {{ qest.opts[ fNo ].rotPlu?'R':' ' }}
        {{ qest.opts[ fNo ].rotMin?'L':' ' }}
        {{ getClipNiceStr() }}
    </small> 
    <b>{{ getName() }}</b> 
    
    
    <!--
        <small>fpath:{{ getDirname() }}</small> fNo:({{ fNo }})  
        {{ item }}
    -->

    <VYButtonContext
        title="File info"
        icon="<i class='fa-solid fa-file-import'></i>"
        :name="'file'+getName()"
        v-model:is-showing="showFileInfo"
        style="color:white;"
        >
        <small v-html="dofInfo()" />
    </VYButtonContext>
</div>



</template>

<script>


import VyButtonContext from '@viteyss-site-settings1/UiAssets/vyButtonContext.vue';
import { msToDurationString } from './libs';


export default{
    components:{
        "VYButtonContext": VyButtonContext
    },
    emits:[ 'file-select-update' ],
    props: { 
        'qest':{ type: Object, default: {}} ,
        'fNo':{ type: Number, default: -1}, 
        'fSelect':-1, 
    },
    data(){ 
        return { 
            showFileInfo:false
        }; 
    },
    methods:{
        getName(){ 
            let file = `${this.qest.files[ this.fNo ]}`;
            return file == '' ? '' : file.substring( file.lastIndexOf('/')+1 ); 
        },
        getDirname(){ 
            let file = `${this.qest.files[ this.fNo ]}`;
            return file == '' ? '' : file.substring( 0, file.lastIndexOf('/') ); 
        },
        dofInfo(){ 
            
            let tr = []; 
            for(let k of Object.keys( this.qest.fInfos[ this.fNo ]  )){
                tr.push( `<small>${k}: </small>${this.qest.fInfos[ k ]}` );
            }
            console.log('fInfo: ',tr.join('<br>'));
            return tr.join('<br>');
        },

        getClipNiceStr(){
            let opt = this.qest.opts[ this.fNo ];
            return opt.clipFrom !=0 || opt.clipTo != -1 ? 
                '['+msToDurationString( opt.clipFrom )+" - "+msToDurationString( opt.clipTo )+"] ":
                '';
        },


        msToDurationString(sec){ 
            return msToDurationString( sec );
        },
    }
}
</script>