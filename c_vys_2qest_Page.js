
import { createApp } from 'vue';
import FilesList from "./assets/filesList.vue";



class s_vys2qestPage{

  constructor(){

    this.twoApp = createApp( FilesList );
  }
  
  get getName(){
    return `2 Qest`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {

    return `<img src="${this.homeUrl}/assets/ico_viteyss_32.png"><b>${this.getName}</b><br>
    <!--This is a npm package<br>
    viteyss-site-2qest<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>
    <hr>
    --><div id="twoQuestApp" >twoQuestApp holder</div>
    `;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.twoApp.mount( '#twoQuestApp' );
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    cl( `${this.getName} [cb] - got msg `);

  }

}

export { s_vys2qestPage };
