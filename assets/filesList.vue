<template>

<div v-if="fSelect >= 0 && qest.files.length>0">



<div
    class="twoAppBar"
    style="background-color: darkolivegreen; color: white;">
    2Qest: <input type="input" v-model="qest.name" style="width:120px;">

    <span title="medias in this qest">
        <i class="fa-solid fa-file-video"></i>
        ({{ qest.files.length }}) 
    </span>
</div>

<!--
    Selection ({{ fSelect }}):
-->
<div
    v-for="fItem,fNo in qest.files"
    style="padding-bottom:10px;">

    
    [{{ fNo }}] <FFile   
        style="display: inline;"   
        v-if="1"   
        :qest="qest"
        :fNo="fNo"
        :fSelect="fSelect"
        @file-select-update="console.log('67890');onEmit_fileSelectUpdate( $event )"
        />


    <div v-if="fNo==fSelect"
        style="background-color: #242e41; color:white; align-self: center;">
        <!--
            :mySrc="`file://`+fItem"
            -->
            <VideoPlayer
                :mySrc="`/@fs`+fItem"
                :currentTime="qest.opts[ fNo ]['clipFrom']!=0?qest.opts[ fNo ]['clipFrom']:qest.opts[ fNo ]['currentTime']"
                @two-qest-video-update="onEmit_videoUpdate"
                >abcx</VideoPlayer>

        

        <!--
            
        <input type="checkbox" v-model="qest.opts[ fNo ]['inPoint']" 
            id="nextOptInPoi" style="display:inline;"/>
        <label for="nextOptInPoi" style="display:inline;">in point</label>
        -->


        
        <button titel="clip from current position" @click="onStopForNotes( fNo,'from' )"><img src="@viteyss-site-2qest/assets/ico_brackFromW_16_16.png"></img></button>
        <button @mousedown.prevent="onStopForNotes( fNo, '--d' )" @mouseup.prevent="onStopForNotes( fNo, '--u' )"
            @touchdown.prevent="onStopForNotes( fNo, '--d' )" @touchup.prevent="onStopForNotes( fNo, '--u' )"
            ><</button>
        <button 
            v-if="isPlaing" 
            @click="onStopForNotes( fNo, 'stop' )">STOP</button>
        <button
            v-else 
            @click="onStopForNotes( fNo, 'play' )">PLAY</button>
        <button @mousedown.prevent="onStopForNotes( fNo, '++d' )" @mouseup.prevent="onStopForNotes( fNo, '++u' )"
            @touchdown.prevent="onStopForNotes( fNo, '++d' )" @touchup.prevent="onStopForNotes( fNo, '++u' )"
            >></button>
        <button  titel="clip to current position" @click="onStopForNotes( fNo,'to' )"><img src="@viteyss-site-2qest/assets/ico_brackToW_16_16.png"></img></button>

        {{ qest.opts[ fNo ]['currentTime']==-1?'0':msToDurationString(qest.opts[ fNo ]['currentTime'])}}
         / 
        {{ qest.opts[ fNo ]['duration']==-1?'0':msToDurationString(qest.opts[ fNo ]['duration'])}}




        <div v-if="qest.opts[ fNo ]['clipTo']!=-1">
            Clip: 
            <a @click="onSeekTo(fNo,'from')">[ {{ msToDurationString( qest.opts[ fNo ]['clipFrom'] ) }} ]</a>
            to 
            <a @click="onSeekTo(fNo,'to')">[ {{ msToDurationString( qest.opts[ fNo ]['clipTo'] ) }} ]</a>
            | <button @click="onStopForNotes( fNo,'clear' )">[x]</button>
        </div>
        

        <!--
        <input type="checkbox" v-model="qest.opts[ fNo ]['outPoint']" 
            id="nextOptOutPou" style="display:inline;"/>
        <label for="nextOptOutPou" style="display:inline;">out point</label>
        -->

        <hr></hr>

        
        <input type="checkbox" v-model="qest.opts[ fNo ]['stabilize']" 
            id="nextOptStabilize" style="display:inline;"/>
        <label for="nextOptStabilize" style="display:inline;">stabilize</label>
        |
        <input type="checkbox" v-model="qest.opts[ fNo ]['rotMin']" 
            id="nextOptRotMin" style="display:inline;"/>
        <label for="nextOptRotMin" style="display:inline;">rot -90</label>
        |
        <input type="checkbox" v-model="qest.opts[ fNo ]['rotPlu']" 
            id="nextOptRotPlu" style="display:inline;"/>
        <label for="nextOptRotPlu" style="display:inline;">rot +90</label>
       
        <hr></hr>

        
        <table style="width:95vw;">
            <tr>
                <td style="vertical-align: top;">
                    <textarea
                        rows="3"
                        placeholder="Notes to it"
                        style="width:100%;"
                        v-model="qest.notes[ fNo ]"
                            />

                </td>
                <td style="vertical-align: top; max-width: 160px;">
                    <TagsColector
                        :tags="qest.tags[ fNo ]"
                        @tags-colector-add="onEmit_tagsAdd"
                        @tags-colector-remove-index="onEmit_tagRemove"
                        />
                

                </td>
            </tr>
        </table>

    
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

import { vyArgsChk } from '../libs/vyArgs';
import File from './file.vue';
import { msToDurationString } from './libs';
import TagsColector from './tagsColector.vue';

import VideoPlayer from './videoPlayer.vue';
import { toRaw } from 'vue';



export default{

props: [ 'qestAs' ],

components:{
    "FFile": File,
    "VideoPlayer": VideoPlayer,
    "TagsColector": TagsColector,
},
mounted(){
    if( this.qest.files.length > 0 )
        this.fSelect = 0;

    
},
data(){
    //let qest = vyArgsChk('qName - abc 32');   
    console.log('qestAs: ',this.qestAs);
    return {
        qest: this.qestAs,/*
        qest: {
            name: 'qName - abc123',
            files: files,
            rates: rates,
            fInfos: fInfos,
            opts: opts,
            notes: notes,
            tags: tags,
        },*/
        fSelect: -1,
        goToNext: true,

        longPress: -1,
        longPressTime: 1.00,

        isPlaing: false,
        vpSync: -1,
        
    };

},
methods:{
    onCanDoNewQery( query = '' ){
        console.log( 'can do new ?', {fSelect:this.fSelect,qest:this.qest} );
        if( this.fSelect != -1 ){
            let saveQ = false;
            if( query == 'new')
                saveQ = confirm("Save 2qest befor making new one?");
            else if( query == 'loading')
                saveQ = confirm("Save 2qest befor loading?");


            if( saveQ ) return 'save';
            else return 'ok';
        }
        return 'ok';
    },
    onClean(){  this.onSetQest({
            qest:{},
            fSelect:-1
        });
    },
    onSetQest( data ){
        console.log(' new qest ',data);
        this.fSelect = -1;
        this.qest = data.qest;
        
        // to update old files to current structure START
        if( !('notes' in this.qest) ){
            let n = new Array( this.qest.files.length );
            n.forEach( i => i = '' );
            this.qest['notes'] = n
        }

        if( !('tags' in this.qest) ){
            let t = new Array( this.qest.files.length );
            t.forEach( i => i = [] );
            this.qest['tags'] = t
        }
        // to update old files to current structure END


        this.fSelect = data.fSelect;
    },
    onGetQest(){
        return {
            qest:this.qest,
            fSelect: this.fSelect,
            goToNext: this.goToNext,            
        };
    },
    onMakeCopyClip( fNo ){
        console.log('clon ....',fNo);
        this.qest.files.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.files[ fNo ]))) );
        this.qest.rates.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.rates[ fNo ] ))) );
        this.qest.fInfos.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.fInfos[ fNo ]))) );
        this.qest.opts.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.opts[ fNo ]))) );
        this.qest.notes.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.notes[ fNo ]))) );
        this.qest.tags.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.tags[ fNo ]))) );
        //this.qest.notes.splice( fNo, 0,  JSON.parse(JSON.stringify(toRaw( this.qest.notes[ fNo ]))) );
        //Object.keys( this.qest ).forEach( 
        //    key => 
        //        this.qest[ key ].splice( fNo, 0, JSON.cloneRaw( this.qest[ key ][ fNo ] ) ) 
        //);
        if( this.qest.files.length >= this.fSelect-1 && this.goToNext )
            this.fSelect++;
    },

    onEmit_tagRemove( index ){
        this.qest.tags[ this.fSelect ].splice( parseInt( index ), 1 );
    },
    onEmit_tagsAdd( event){
        this.qest.tags[ this.fSelect ].push( `${event}` );
    },

    onEmit_fileSelectUpdate( event ){
        this.fSelect = event;

    },

    onEmit_videoUpdate( msg  ){
        console.log('video update root',msg);
        let vp = document.getElementById('myVidPla');
        if( !vp ) return -1;

        if( msg.action == 'seek' )
            this.qest.opts[ this.fSelect ]['currentTime'] = msg.payload;
        
        else if( msg.action == 'play' ) this.isPlaing = true;
        else if( msg.action == 'pause' ){
            this.isPlaing = false;
            if( this.vpSync != -1 ) clearInterval( this.vpSync );
        }else if( msg.action == 'playing' ) {
            if( this.vpSync != -1 ) clearInterval( this.vpSync );
            this.vpSync = setInterval(()=>{
                this.qest.opts[ this.fSelect ]['currentTime'] = vp.currentTime;
            },100);

        }else if( msg.action == 'loadeddata' && this.qest.opts[  this.fSelect ]['duration'] == -1 ){
            
            this.qest.opts[ this.fSelect ]['duration'] = msg.target.duration;
            this.qest.opts[ this.fSelect ]['currentTime'] = msg.target.currentTime;
            
        }

        
    },

    onIsRate(fItem, rate){
        this.qest.rates[ fItem ]= rate;
        if( this.qest.files.length >= this.fSelect-1 && this.goToNext ){
            
            this.fSelect++;
        }

    },

    onSeekTo( fNo, isWhat ){
        let vp = document.getElementById('myVidPla');

        if( isWhat == 'from' )
            vp.currentTime = this.qest.opts[ this.fSelect ]['clipFrom'];
        else
            vp.currentTime = this.qest.opts[ this.fSelect ]['clipTo'];

    },

    onStopForNotes( fNo, action = '' ){

        if( action == 'clear' ){
            this.qest.opts[ this.fSelect ]['currentTime'] = -1;
            this.qest.opts[ this.fSelect ]['clipFrom'] = 0;
            this.qest.opts[ this.fSelect ]['clipTo'] = -1;
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
                this.qest.opts[ this.fSelect ]['currentTime'] = vp.currentTime;
        
            },300 );

        


        
        }else if( action == 'from' ){
            this.qest.opts[ this.fSelect ]['clipFrom'] = vp.currentTime;
            if( this.qest.opts[ this.fSelect ]['clipTo'] == -1 )
                this.qest.opts[ this.fSelect ]['clipTo'] = vp.duration;
            
        }else if( action == 'to' ){
            this.qest.opts[ this.fSelect ]['clipTo'] = vp.currentTime;
            

        }else if( action == 'play' ){
            vp.play();

        }else{
            vp.pause();
        }


        this.qest.opts[ this.fSelect ]['currentTime'] = vp.currentTime;
        this.qest.opts[ this.fSelect ]['duration'] = vp.duration;



    },
    msToDurationString(sec){ return msToDurationString( sec ) },

    

}

}

</script>