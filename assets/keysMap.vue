<template>


    <div style="background-color: #84db14; opacity: 0.3; 
        filter: blur(2px);
        position: absolute; top:0;left:0;
        width: 100%; height: 100%;
        "
        @mouseup="$emit('key-map-close', 1)"
        @touchup="$emit('key-map-close', 1)"
        >

    </div>

        <div style="position:absolute; top:10px; left: 10px;z-index: 6;opacity: 1.0;"
            >
            <img src="@viteyss-site-2qest/assets/keyShortCuts.svg" />
        </div>



</template>
<script>
export default{
emits:[ 'key-map-close' ]
}

</script>
