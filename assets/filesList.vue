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


<!--
<div
    id="vidPlayLanding">
    <VideoPlayer
        v-if="fSelect!=-1 && 'opts' in qest && qest.opts.length > fSelect"
        id="vidPlay00"
        :mySrc="`/@fs`+qest.files[ fSelect ]"
        :currentTime="qest.opts[ fSelect ]['clipFrom']!=0?qest.opts[ fSelect ]['clipFrom']:qest.opts[ fSelect ]['currentTime']"
        @two-qest-video-update="onEmit_videoUpdate"
        >as single player</VideoPlayer>
</div>

-->

<div
    v-for="fItem,fNo in qest.files"
    style="padding-bottom:0px; display:block;">

    <section :id="`fileSection`+fNo"></section>
    <div class="smallBt"
        :style="(fNo==fSelect?'background-color: rgb(189, 203, 230);':'')">
        <table>
            <tr>
                <td>
                    [{{ fNo }}] 

                </td><td>

                    <button @click="onMoveFile(fNo, 'up')"
                            :disabled="fNo == 0"
                            title="Move this file up in list"><i class="fa-solid fa-sort-up"></i>
                    </button>

                </td><td>

                    <button @click="onMoveFile(fNo, 'down')"
                            :disabled="fNo == (qest.files.length-1)"
                            title="Move this file up in list"><i class="fa-solid fa-sort-down"></i>
                    </button>

                </td><td>

                    <FFile   
                        v-if="1"   
                        :qest="qest"
                        :fNo="fNo"
                        :fSelect="fSelect"
                        :myColor="colorOfFileNow( fNo )"
                        @file-select-update="onEmit_fileSelectUpdate( $event )"
                        />
            
                </td>            
            </tr>
        </table>
        
    


        <div v-if="fNo==fSelect"
            style="background-color: #242e41; color:white;">
            <!--
                :mySrc="`file://`+fItem"
                -->

            
                
                <VideoPlayer
                    ref="vidPlay00"
                    :mySrc="`/@fs`+fItem"
                    :currentTime="qest.opts[ fNo ]['clipFrom']!=0?qest.opts[ fNo ]['clipFrom']:qest.opts[ fNo ]['currentTime']"
                    @two-qest-video-update="onEmit_videoUpdate"
                    >abcx</VideoPlayer>

            

            <!--
                
            <input type="checkbox" v-model="qest.opts[ fNo ]['inPoint']" 
                id="nextOptInPoi" style="display:inline;"/>
            <label for="nextOptInPoi" style="display:inline;">in point</label>
            -->


            
            <button 
                title="clip from current position as start" @click="onStopForNotes( fNo,'from' )"><img src="@viteyss-site-2qest/assets/ico_brackFromW_16_16.png"></img></button>
            <button @mousedown.prevent="onStopForNotes( fNo, '--d' )" @mouseup.prevent="onStopForNotes( fNo, '--u' )"
                @touchdown.prevent="onStopForNotes( fNo, '--d' )" @touchup.prevent="onStopForNotes( fNo, '--u' )"
                title="< seek frames"
                ><i class="fa-solid fa-angle-left"></i></button>
            <button 
                v-if="isPlaing" 
                @click="onStopForNotes( fNo, 'stop' )">STOP</button>
            <button
                v-else 
                @click="onStopForNotes( fNo, 'play' )">PLAY</button>
            <button @mousedown.prevent="onStopForNotes( fNo, '++d' )" @mouseup.prevent="onStopForNotes( fNo, '++u' )"
                @touchdown.prevent="onStopForNotes( fNo, '++d' )" @touchup.prevent="onStopForNotes( fNo, '++u' )"
                title="> seek frames"
                ><i class="fa-solid fa-angle-right"></i></button>
            <button  
                title="clip to current position as end" @click="onStopForNotes( fNo,'to' )"><img src="@viteyss-site-2qest/assets/ico_brackToW_16_16.png"></img></button>

            {{ qest.opts[ fNo ]['currentTime']==-1?'0':msToDurationString(qest.opts[ fNo ]['currentTime'])}}
            / 
            {{ qest.opts[ fNo ]['duration']==-1?'0':msToDurationString(qest.opts[ fNo ]['duration'])}}



            <hr></hr>


            <!-- TOOLS START -->


            <div v-if="qest.opts[ fNo ]['clipTo']!=-1"
                class="toolsRadio"
                style="display: inline-block;"
                title="Clip this video to">
                <i class="fa-solid fa-scissors"></i>
                [ <a @click="onSeekTo(fNo,'from')">{{ msToDurationString( qest.opts[ fNo ]['clipFrom'] ) }}</a> ]
                - 
                [ <a @click="onSeekTo(fNo,'to')">{{ msToDurationString( qest.opts[ fNo ]['clipTo'] ) }}</a> ]
                <!--
                <button @click="onStopForNotes( fNo,'clear' )" style="padding:3px;"
                    title="Clean clip selection">[x]</button>
                    -->
                [<a @click="onStopForNotes( fNo,'clear' )" style="padding:3px;"
                    title="Clean clip selection">x</a>]
            </div>
            

            <!--
            <input type="checkbox" v-model="qest.opts[ fNo ]['outPoint']" 
                id="nextOptOutPou" style="display:inline;"/>
            <label for="nextOptOutPou" style="display:inline;">out point</label>
            -->

            |
            
            <div 
                title="stabilize"
                class="toolsRadio"
                >
                <input type="checkbox" v-model="qest.opts[ fNo ]['stabilize']" 
                    style="display: inline;"
                    id="nextOptStabilize"/>
                <label for="nextOptStabilize"
                    style="display: inline;">
                    <img src="@viteyss-site-2qest/assets/ico_stabi_16_16.png"></img>
                </label>
            </div>
            |
            <div 
                class="toolsRadio"
                title="rot -90">
                <input type="checkbox" v-model="qest.opts[ fNo ]['rotMin']" 
                    style="display: inline;"
                    id="nextOptRotMin"/>
                <label for="nextOptRotMin"
                    style="display: inline;">
                    <i class="fa-solid fa-rotate-left"></i>
                </label>
            </div>
            |
            <div title="rot +90"
            class="toolsRadio">
                <input type="checkbox" v-model="qest.opts[ fNo ]['rotPlu']" 
                    style="display: inline;"
                    id="nextOptRotPlu"/>
                <label for="nextOptRotPlu"
                    style="display: inline;">
                    <i class="fa-solid fa-rotate-right"></i>
                </label>
            </div>


            <!-- TOOLS END -->


        
            

            
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

            <button
                title="Clone current file" 
                @click="onMakeCopyClip( fNo )"><i class="fa-regular fa-copy"></i></button>
            <button 
                title="OK use in 2qest"
                @click="onIsRate(fNo, 'ok')"><i class="fa-regular fa-circle-check"></i></button>
            <button
                title="Maby use it" 
                @click="onIsRate(fNo, 'maby')"><i class="fa-solid fa-circle-notch"></i></button>
            <button 
                title="No don't use it"
                @click="onIsRate(fNo, 'no')"><i class="fa-regular fa-circle-xmark"></i></button>
            <button @click="onIsRate(fNo, 'delete')">delete</button>


        </div>

        
    </div>
   
    
    
</div>


</div>


<br></br>
<br></br>
<br></br>
<br></br>
</template>
<style>

.smallBt button{
    padding:7px;
    margin-right: 4px;
}

.toolsRadio{
    border:solid rgb(123, 123, 123) 1px;
    background-color: rgb(41, 41, 17);
    border-radius: 6px;
    padding: 4px;
    display: inline-block;
}

.toolsRadio label{
    display: inline;
}


</style>
<script>

import { vyArgsChk } from '../libs/vyArgs';
import File from './file.vue';
import { msToDurationString } from './libs';
import TagsColector from './tagsColector.vue';

import VideoPlayer from './videoPlayer.vue';
import { toRaw } from 'vue';



export default{

props: [ 'qestAs', 'viewMode' ],

components:{
    "FFile": File,
    "VideoPlayer": VideoPlayer,
    "TagsColector": TagsColector,
},
mounted(){
    if( this.qest.files.length > 0 )
        this.fSelect = 0;

    console.log('Files list mount key short cuts');
    window.addEventListener('keydown', e => this.manageKeyShortCuts( 'down',e ) );
    window.addEventListener('keyup', e => this.manageKeyShortCuts( 'up', e ) );
    
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

        PiPNode: undefined,
        
    };

},
watch:{
   
    viewMode(nv, ov){
        console.log('filesList view mode switch ['+nv+']');
        if( nv == 'PiP' ){
            let windowFeatures = 'width=320,height=180,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes';
                    
            if( this.PiPNode == undefined ){
                console.log('filesList open');
                let nw = window.open( '','', windowFeatures );
                window['pipnw'] = nw;
                nw.window.document.write('<html><body style="background-color:gray;"><div id="PiP"></div></body></html>');
                // magic!
                //this.PiPNode.document.body.appendChild( this.$refs.vidPlay00 );
                let pipDiv = nw.window.document.getElementById('PiP');
                let vpDiv = window.document.getElementById('vidPlay00');
                vpDiv.onbeforeunload = (e='')=>{
                    console.log('wtf');
                    e.preventDefault();
                    e.returnValue = ' one moment';
                    this.moveVideoPlayerFromTo();
                    nw.close();
                };
                //vpDiv.innerHTML = '';
                pipDiv.appendChild( vpDiv );

                this.PiPNode = nw;

            }else{
                console.log('filesList recycle');

            }

            /*

            if( this.PiPNode == undefined ){
                let openCustomWindow = ( url ) => {
                    let windowName = '2Qest - PiP';
                    let windowFeatures = 'width=500,height=400,location=no,toolbar=no,menubar=no,scrollbars=no,resizable=yes';
                    let newWindow = window.open(url, windowName, windowFeatures);
                    if (newWindow) {
                        this.PiPNode = newWindow;
                        window['pipnode'] = newWindow;
                        newWindow.focus();
                    } else {
                        alert('Popup blocked! Please enable popups for this site.');
                    }

                    return false; // Prevent the default link action if used in an anchor tag
                }
                openCustomWindow(`http://${window.location.host}/yss/index.html#pageByName=2%20Qest`);

            }else{
                this.PiPNode.focus();
            }
                */

        }else{

           this.moveVideoPlayerFromTo();


            /*
            if( this.PiPNode != undefined ){
                this.PiPNode.close();
                this.PiPNode = undefined;
            }
                */

        }

    }
},
methods:{

    colorOfFileNow( fNo ){
        let tr = '';
        
        //console.log('rates ',{ fNo, 'value':this.qest.rates[ fNo ] });
        if( this.qest.rates[ fNo ] == 'ok' ) tr = '#adff4b';
        else if( this.qest.rates[ fNo ] == 'maby' ) tr = 'rgb(216, 255, 176)';
        else if( this.qest.rates[ fNo ] == 'no' ) tr = 'rgb(236, 144, 144)';
        else if( this.qest.rates[ fNo ] == 'delete' ) tr = 'rgb(255, 69, 150)';
        
        if( tr == '' ) tr = 'rgb(172, 192, 198)';


        return tr;
    },


    onMoveFile( fNo, moveDirection = 'up' ){
        if( fNo == 0 && moveDirection == 'up' ) return -1;
        else if( (fNo+1) >= this.qest.files.length && moveDirection == 'down' ) return -1;

        function swapPlaces( myArray, inInd, targInd ){
            let t = myArray[ inInd ];
            myArray[ inInd ] = myArray[ targInd ];
            myArray[ targInd ] = t;
        }

        let targInd = fNo + ( moveDirection=='up' ? -1 : 1 );
        
        console.log('swap ', moveDirection);
        
        swapPlaces( this.qest.files, fNo, targInd);
        swapPlaces( this.qest.rates, fNo, targInd);
        swapPlaces( this.qest.fInfos, fNo, targInd);
        swapPlaces( this.qest.opts, fNo, targInd);
        swapPlaces( this.qest.notes, fNo, targInd);
        swapPlaces( this.qest.tags, fNo, targInd);
        
        this.fSelect = ( moveDirection=='up' ? -1 : 1 ) + this.fSelect;

    },

    manageKeyShortCuts( eventWay, e ){
        let focusOn = document.activeElement;
        console.log( 'got key ',e, ' keycode: ',e.keyCode,' alt:'+e.altKey+' ctr:'+e.ctrlKey+' focuse on ['+focusOn.tagName+']');
        let setPrevent = false;

        if( ['DIV','VIDEO' ].indexOf( focusOn.tagName ) != -1 ){
            if( e.keyCode == 32){// space
                if( eventWay == 'down' ){
                    //console.log('space ! down ');
                    if( !this.isPlaing ) this.onStopForNotes( this.fSelect, 'play' );
                    else this.onStopForNotes( this.fSelect, 'stop' );
                }
                setPrevent = true;

            } else  if( e.keyCode == 49 && eventWay == 'down' ){ // 1 stabi
                this.qest.opts[ this.fSelect ]['stabilize'] = ! this.qest.opts[ this.fSelect ]['stabilize'];

            } else  if( e.keyCode == 50 && eventWay == 'down'){ // 2 rot left
                this.qest.opts[ this.fSelect ]['rotMin'] = !this.qest.opts[ this.fSelect ]['rotMin'];

            } else  if( e.keyCode == 51 && eventWay == 'down'){ // 3 rot right
                this.qest.opts[ this.fSelect ]['rotPlu'] = !this.qest.opts[ this.fSelect ]['rotPlu'];
            

            } else if( e.altKey ){
                if( eventWay == 'up' && (e.keyCode == 65 || e.code == 'ArrowLeft') ){ 
                // clip left
                    this.onStopForNotes( this.fSelect, 'from' );
                
                } else if( eventWay == 'up' && (e.keyCode == 85 || e.code == 'ArrowRight') ){ 
                    // clip right
                    this.onStopForNotes( this.fSelect, 'to' );
                }
                setPrevent = true;

            } else if( e.ctrlKey ){
                if( eventWay == 'up' && (e.keyCode == 65 || e.code == 'ArrowLeft') ){ 
                    // seek to clip left
                    this.onSeekTo(this.fSelect,'from');
                    setPrevent = true;
                    
                } else if( eventWay == 'up' && (e.keyCode == 85 || e.code == 'ArrowRight') ){ 
                    // seek to clip right
                    this.onSeekTo(this.fSelect, 'to');
                    setPrevent = true;
                }

            } else if( e.keyCode == 65 || e.code == 'ArrowLeft' ){ // seek left

                if( e.shiftKey && eventWay == 'down' ){
                    this.onSeek( 0.00 );
                }else{
                    if( eventWay == 'down' )
                        this.onStopForNotes( this.fSelect, '--d' );
                    if( eventWay == 'up' )
                        this.onStopForNotes( this.fSelect, '--u' );
                }

                setPrevent = true;

            } else if( e.keyCode == 85 || e.code == 'ArrowRight' ){ // seek right

                if( e.shiftKey && eventWay == 'down' ){
                    this.onSeek( -1 );
                }else{
                    if( eventWay == 'down' )
                        this.onStopForNotes( this.fSelect, '++d' );
                    if( eventWay == 'up' )
                        this.onStopForNotes( this.fSelect, '++u' );
                }

                setPrevent = true;

            }

        }

        if( setPrevent ){
            e.preventDefault();
            e.stopPropagation();
        }

    },


    moveVideoPlayerFromTo(){
         if( this.PiPNode != undefined ){
            let vpDiv = this.PiPNode.window.document.getElementById('vidPlay00');
            let vpLandDiv = window.document.getElementById('vidPlayLanding');
            vpLandDiv.appendChild( vpDiv );

            this.PiPNode.close();
            this.PiPNode = undefined;
        }
    },


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
            let n = [];
            for(let i=0;i<this.qest.files.length; i++)
                n.push('');
            this.qest['notes'] = n
        }

        if( !('tags' in this.qest) ){
            let t = [];
            for(let i=0;i<this.qest.files.length; i++)
                t.push([]);
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
        console.log('tagsadd ',{ qest:this.qest, fSelect: this.fSelect });
        this.qest.tags[ this.fSelect ].push( `${event}` );
    },

    onEmit_fileSelectUpdate( event ){
        this.fSelect = event;
        // only to make scroll to selected
        this.onEmit_scrollToFSelection();  

    },

    onEmit_scrollToFSelection(){
        setTimeout(()=>{
            let fNo = this.fSelect;
            let sectionNode = document.getElementById('fileSection'+fNo );
            console.log('fSelected now is ',fNo, ' .... scroll to it ....node:',sectionNode);
            window.scrollTo({
                top: sectionNode.offsetTop,
                behavior: 'smooth'
            });
        },100);
    },

    onEmit_videoUpdate( msg  ){
        console.log('video update root',msg);
        let vp = this.getCurrentVideoPlayer();
        if( vp == undefined ){
            console.log('EE can\'t get player node ');
            return -1;
        }


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


    getCurrentVideoPlayer(){
        let vp = undefined;
        if( this.viewMode == 'PiP' ){
            vp = this.PiPNode.window.document.getElementById('myVidPla');
        }else{
            vp = document.getElementById('myVidPla');
        }
        if( vp == undefined ){
            console.log('EE can\'t get player node ');
        }
        return vp;

    },


    onIsRate(fItem, rate){
        this.qest.rates[ fItem ]= rate;
        if( this.qest.files.length >= this.fSelect-1 && this.goToNext ){
            
            this.fSelect++;
        }

    },

    onSeek( secPos = 0.00){
        let vp = this.getCurrentVideoPlayer();
        if( vp == undefined ){
            console.log('EE can\'t get player node ');
            return -1;
        }
        if( secPos == -1 ) secPos = vp.duration;

        vp.currentTime = secPos;

    },

    onSeekTo( fNo, isWhat ){
       if( isWhat == 'from' )
            this.onSeek( parseFloat( this.qest.opts[ this.fSelect ]['clipFrom'] ) );
        else
            this.onSeek( parseFloat( this.qest.opts[ this.fSelect ]['clipTo'] ) );

    },

    onStopForNotes( fNo, action = '' ){

        if( action == 'clear' ){
            this.qest.opts[ this.fSelect ]['currentTime'] = -1;
            this.qest.opts[ this.fSelect ]['clipFrom'] = 0;
            this.qest.opts[ this.fSelect ]['clipTo'] = -1;
            return 1;
        }

        let vp = this.getCurrentVideoPlayer();
        if( vp == undefined ){
            console.log('EE can\'t get player node ');
            return -1;
        }


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