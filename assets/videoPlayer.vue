<template>

    <div v-if="mySrc!=''"
        style="position: relative;">    

        



        <video 
            :autoplay="isAutoplay" 
            controls
            ref="myVidPla"
            id="myVidPla"
            style="background-color: black;padding:0px;
                width:100%;
                max-height: 70vh;
                "
            >
            <source :src="getNiceSrc" type="video/mp4">
            
            Your browser does not support the video tag.
        </video>

        <!--
            <div id="custom-controls" class="controls">
                slotStart[<slot></slot>] 
                <a @click="$refs.myVidPla.requestFullscreen()">[f]</a>
                slotEnd
                
            </div>
            -->


    </div>    
</template>
<style>
    /*
#myVidPla::-webkit-media-controls {
  display: none !important;

}
#myVidPla{
    z-index: 0;
}
#custom-controls {
  position: absolute;
  top: 10px;
  left: 0px;
  width: 100%;
  z-index: 2147483647;
  
}

*/
</style>

<script>

export default{
emits:[ 'two-qest-video-update' ],
props: {
    mySrc:{ type: String, default: '' },
    currentTime:{ type:Number, default:-1}
},
data(){
    return {
        isAutoplay:false
    };
},
computed:{
     getNiceSrc( ){
        console.log( 'video player src: '+this.mySrc);

        /*
        if( this.currentTime != -1 ){
            let vp = document.getElementById('myVidPla');
            setTimeout(()=>{ 
                console.log('video player resume ',this.currentTime);
                vp.currentTime = this.currentTime; 
                vp.pause();
                //loadeddata="onLoadedVideo"
            },500);
        }
            */

        return this.mySrc;
    }
},
mounted(){
       // vp.pause();
        //this.currentTime = vp.currentTime;

    let vh = document.getElementById('myVidPla');
    if( vh == undefined ) return -1;
    vh.addEventListener('seeked',(e)=>{
        if(0)console.log('videoPlayer vh:',vh,
            '\ne:',e
        );
        mkTrashHold( '2qest_seek', ()=>{
            this.$emit( 'two-qest-video-update', {
                action: 'seek',
                payload: e.target.currentTime    
            });

        }, 10 );

    });

    //:onloadeddata="currentTime!=-1?`this.currentTime=`+currentTime+`;this.pause();`:''"

    vh.addEventListener('loadeddata',(e)=>{
        this.$emit( 'two-qest-video-update', {
            action: 'loadeddata',
            target: e.target 
        });
    });

    vh.addEventListener('play',(e)=>{
        this.$emit( 'two-qest-video-update', {
            action: 'play' 
        });
    });

     vh.addEventListener('pause',(e)=>{
        this.$emit( 'two-qest-video-update', {
            action: 'pause' 
        });
    });
     vh.addEventListener('playing',(e)=>{
        this.$emit( 'two-qest-video-update', {
            action: 'playing', payload: e.target.currentTime
        });
    });



},
methodes:{
    onLoadedVideo(e=''){
        console.log('videoPlayer onloaded ...',e);
    },

    onInput( e ){
        console.log( 'video player got event ',e);
    },
   
}


}

</script>
