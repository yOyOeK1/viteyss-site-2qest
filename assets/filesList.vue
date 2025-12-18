<template>

<div v-if="fSelect >= 0 && quest.files.length>0">


<pre>
Quest: <input type="input" v-model="quest.name">
files: ({{ quest.files.length }}) 
</pre>


Selection ({{ fSelect }}):
<div
    v-for="fItem,fNo in quest.files">

    
     <FFile      
        v-if="1"   
        :quest="quest"
        :fNo="fNo"
        :fSelect="fSelect"
        @file-select-update="console.log('67890');onEmit_fileSelectUpdate( $event )"
        />


    <div v-if="fNo==fSelect"
        style="background-color: black; color:white;">
        <VideoPlayer
            :mySrc="`/@fs`+fItem"
            :currentTime="quest.opts[ fNo ]['clipFrom']!=0?quest.opts[ fNo ]['clipFrom']:quest.opts[ fNo ]['currentTime']"
            />

        

        <!--
            
        <input type="checkbox" v-model="quest.opts[ fNo ]['inPoint']" 
            id="nextOptInPoi" style="display:inline;"/>
        <label for="nextOptInPoi" style="display:inline;">in point</label>
        -->


        
        <button @click="onStopForNotes( fNo,'from' )">from</button>
        <button @mousedown="onStopForNotes( fNo, '--d' )" @mouseup="onStopForNotes( fNo, '--u' )"
            ><</button>
        <button @click="onStopForNotes( fNo, 'stop' )">STOP</button>
        <button @click="onStopForNotes( fNo, 'play' )">PLAY</button>
        <button @mousedown="onStopForNotes( fNo, '++d' )" @mouseup="onStopForNotes( fNo, '++u' )"
            >></button>
        <button @click="onStopForNotes( fNo,'to' )">to</button>

        {{ quest.opts[ fNo ]['currentTime']==-1?'0':msToDurationString(quest.opts[ fNo ]['currentTime'])}} / 
        {{ quest.opts[ fNo ]['duration']==-1?'0':msToDurationString(quest.opts[ fNo ]['duration'])}}

        <div v-if="quest.opts[ fNo ]['clipTo']!=-1">
            Clip: 
            <a @click="onSeekTo(fNo,'from')">[ {{ msToDurationString( quest.opts[ fNo ]['clipFrom'] ) }} ]</a>
            to 
            <a @click="onSeekTo(fNo,'to')">[ {{ msToDurationString( quest.opts[ fNo ]['clipTo'] ) }} ]</a>
            | <button @click="onStopForNotes( fNo,'clear' )">[x]</button>
        </div>
        

        <!--
        <input type="checkbox" v-model="quest.opts[ fNo ]['outPoint']" 
            id="nextOptOutPou" style="display:inline;"/>
        <label for="nextOptOutPou" style="display:inline;">out point</label>
        -->

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

        <button @click="onMakeCopyClip( fNo )">clone</button>
        <button @click="onIsRate(fNo, 'ok')">OK</button>
        <button @click="onIsRate(fNo, 'maby')">maby</button>
        <button @click="onIsRate(fNo, 'no')">no</button>
        <button @click="onIsRate(fNo, 'delete')">delete</button>


    </div>

   
    
    
</div>


</div>


<br></br>
<br></br>
<br></br>
<br></br>
</template>

<script>

import File from './file.vue';
import { msToDurationString } from './libs';
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
                opts.push( this.getOptsDef() );
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

        longPress: -1,
        longPressTime: 1.00,
        
    };

},
methods:{

    getOptsDef( currentTime = -1, clipFrom = 0, clipTo = -1){
        return { 
            stabilize: false,
            rotMin: false, 
            rotPlu: false,
            currentTime: currentTime,
            duration: -1,
            clipFrom: clipFrom,
            clipTo: clipTo,
            inPoint: false,
            outPoint: false,
            status: -1,
            entryDate: Date.now()
        };
    },

    onMakeCopyClip( fNo ){
        console.log('clon ....',fNo);
        this.quest.files.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.quest.files[ fNo ]))) );
        this.quest.rates.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.quest.rates[ fNo ] ))) );
        this.quest.fInfos.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.quest.fInfos[ fNo ]))) );
        this.quest.opts.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.quest.opts[ fNo ]))) );
        if( this.quest.files.length >= this.fSelect-1 && this.goToNext )
            this.fSelect++;
    },

    onEmit_fileSelectUpdate( event ){
        this.fSelect = event;
    },

    onIsRate(fItem, rate){
        this.quest.rates[ fItem ]= rate;
        if( this.quest.files.length >= this.fSelect-1 && this.goToNext )
            this.fSelect++;

    },

    onSeekTo( fNo, isWhat ){
        let vp = document.getElementById('myVidPla');

        if( isWhat == 'from' )
            vp.currentTime = this.quest.opts[fNo]['clipFrom'];
        else
            vp.currentTime = this.quest.opts[fNo]['clipTo'];

    },

    onStopForNotes( fNo, action = '' ){

        if( action == 'clear' ){
            this.quest.opts[ fNo ]['currentTime'] = -1;
            this.quest.opts[ fNo ]['clipFrom'] = 0;
            this.quest.opts[ fNo ]['clipTo'] = -1;
            return 1;
        }
        let vp = document.getElementById('myVidPla');        
        

        if( action == '--u' || action == '++u' ){
            clearInterval( this.longPress );
            this.longPress = -1;
            this.longPressTime = 1.00;
        }else if( action == '--d' || action == '++d' ){
            if( this.longPress != -1 ) clearInterval( this.longPress );
            let multi = action.startsWith('--')? -1.00 : 1.00;

            vp.currentTime += multi / 30.00;
            
            this.longPress = setInterval( ()=>{ 
                vp.currentTime += (multi / 30.00)* this.longPressTime;
                this.longPressTime+=5.0;
                if( this.longPressTime > 200.00 ) this.longPressTime = 200.00;
                this.quest.opts[ fNo ]['currentTime'] = vp.currentTime;
        
            },300 );

        


        
        }else if( action == 'from' ){
            this.quest.opts[ fNo ]['clipFrom'] = vp.currentTime;
            if( this.quest.opts[ fNo ]['clipTo'] == -1 )
                this.quest.opts[ fNo ]['clipTo'] = vp.duration;
            
        }else if( action == 'to' ){
            this.quest.opts[ fNo ]['clipTo'] = vp.currentTime;
            

        }else if( action == 'play' ){
            vp.play();

        }else{
            vp.pause();
        }


        this.quest.opts[ fNo ]['currentTime'] = vp.currentTime;
        this.quest.opts[ fNo ]['duration'] = vp.duration;



    },
    msToDurationString(sec){ return msToDurationString( sec ) },

    

}

}

</script>