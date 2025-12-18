<template>

    <div v-if="mySrc!=''">    
        <video autoplay width="100%" height="220"
            controls="1"
            id="myVidPla"
            style="border:1px red solid;background-color: black;"
            :onloadeddata="currentTime!=-1?`this.currentTime=`+currentTime+`;this.pause();`:''"
            
            >
            <source :src="getNiceSrc" type="video/mp4">
            
            Your browser does not support the video tag.
        </video>
    </div>    

</template>
<script>

export default{
props: {
    mySrc:{ type: String, default: '' },
    currentTime:{ type:Number, default:-1}
},
computed:{
     getNiceSrc( ){
        console.log( 'video player src: '+this.mySrc);

        if( this.currentTime != -1 ){
            let vp = document.getElementById('myVidPla');
            setTimeout(()=>{ 
                console.log('video player resume ',this.currentTime);
                vp.currentTime = this.currentTime; 
                vp.pause();
                //loadeddata="onLoadedVideo"
            },500);
        }

        return this.mySrc;
    }
},
mounted(){
       // vp.pause();
        //this.currentTime = vp.currentTime;
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