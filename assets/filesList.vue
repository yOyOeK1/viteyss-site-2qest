<template>

<pre>
quest: {{ quest.name }}
files: ({{ quest.files.length }}) 
</pre>


Selection ({{ fSelect }}):
<div
    v-for="fItem,fNo in quest.files">


     <FFile         
        :item="fItem",
        :rate="quest.rates[fNo]"
        :opts="quest.opts[fNo]"
        :fInfo="quest.fInfos[fNo]"
        :fNo="fNo"
        :fSelect="fSelect"
        @file-select-update="onEmit_fileSelectUpdate( $event )"
        />


    <div v-if="fNo==fSelect"
        style="background-color: darkkhaki;">
        <VideoPlayer
            :mySrc="`/@fs`+fItem"
            :currentTime="quest.opts[ fNo ]['currentTime']"
            />

        

        
        <input type="checkbox" v-model="quest.opts[ fNo ]['inPoint']" 
            id="nextOptInPoi" style="display:inline;"/>
        <label for="nextOptInPoi" style="display:inline;">in point</label>


        {{ quest.opts[ fNo ]['currentTime']==-1?'':'[ '+quest.opts[ fNo ]['currentTime']+" sec. ]"}}
        <button @click="onStopForNotes( fNo )">STOP</button>


         <input type="checkbox" v-model="quest.opts[ fNo ]['outPoint']" 
            id="nextOptOutPou" style="display:inline;"/>
        <label for="nextOptOutPou" style="display:inline;">out point</label>


        <hr></hr>

        
        <input type="checkbox" v-model="quest.opts[ fNo ]['stabilize']" 
            id="nextOptStabilize" style="display:inline;"/>
        <label for="nextOptStabilize" style="display:inline;">stabilize</label>
        |
        <input type="checkbox" v-model="quest.opts[ fNo ]['rotMin']" 
            id="nextOptRotMin" style="display:inline;"/>
        <label for="nextOptRotMin" style="display:inline;">rot -90</label>
        |
        <input type="checkbox" v-model="quest.opts[ fNo ]['rotPlu']" 
            id="nextOptRotPlu" style="display:inline;"/>
        <label for="nextOptRotPlu" style="display:inline;">rot +90</label>
       
        <hr></hr>



        <input type="checkbox" v-model="goToNext" 
            id="nextAfterRating" style="display:inline;"/>
        <label for="nextAfterRating" style="display:inline;">next</label>
        |

        <button @click="onIsRate(fNo, 'ok')">OK</button>
        <button @click="onIsRate(fNo, 'maby')">maby</button>
        <button @click="onIsRate(fNo, 'no')">no</button>
        <button @click="onIsRate(fNo, 'delete')">delete</button>


    </div>

   
    
    
</div>
<br></br>
<br></br>
<br></br>
<br></br>
</template>

<script>
import File from './file.vue';
import VideoPlayer from './videoPlayer.vue';
import { toRaw } from 'vue';


export default{

components:{
    "FFile": File,
    "VideoPlayer": VideoPlayer,
},
mounted(){
    if( this.quest.files.length > 0 )
        this.fSelect = 0;
},
data(){

    let files = [];
    let rates = [];
    let fInfos = [];
    let opts = [];
    
    if( 'vyArgs' in process.env.vy_config ){
        let args = JSON.parse(process.env.vy_config.vyArgs);
        if( args.name =='2quest' ){
            let j = JSON.parse( JSON.stringify( toRaw( args.payload.files ) ) );
            let myI = 0;
            for( let f of j ){
                files.push( f );
                rates.push('');
                fInfos.push( args.payload.fInfos[ myI ] );
                opts.push({
                    stabilize: false,
                    rotMin: false, 
                    rotPlu: false,
                    currentTime: -1,
                    inPoint: false,
                    outPoint: false,
                    status: -1,
                    entryDate: Date.now()

                });
                myI++;
            }
        }
    }
         

    return {
        quest: {
            name: 'qName - abc123',
            files: files,
            rates: rates,
            fInfos: fInfos,
            opts: opts,
        },
        fSelect: -1,
        goToNext: true,
        
    };

},
methods:{

    onEmit_fileSelectUpdate( event ){
        this.fSelect = event;
    },

    onIsRate(fItem, rate){
        this.quest.rates[ fItem ]= rate;
        if( this.quest.files.length >= this.fSelect-1 && this.goToNext )
            this.fSelect++;

    },

    onStopForNotes( fNo ){
        let vp = document.getElementById('myVidPla');
        vp.pause();
        this.quest.opts[ fNo ]['currentTime'] = vp.currentTime;

    }
}

}

</script>