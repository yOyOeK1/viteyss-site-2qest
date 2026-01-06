
import { createApp } from 'vue';
import FilesList from "./assets/filesList.vue";
import twoApp from './assets/twoApp.vue';


class s_vys2qestPage{

  constructor(){

    this.twoApp = createApp( twoApp );
    
    this.package = process.env.vy_config.pathsToSitesPackages.find( s=>{ 
      //console.log('2qest package site -> ',s);
      return s.package.name == 'viteyss-site-2qest';
    });
    this.package = this.package.package;
    //console.log('2qest package ',this.packages);

  }
  
  get getName(){
    return `2 Qest`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {

    return `<!--
    <img src="${this.homeUrl}/assets/ico_viteyss_32.png"><b>${this.getName}</b><br>
    This is a npm package<br>
    viteyss-site-2qest<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>
    <hr>
    -->
    <div id="twoQestApp" >twoQestApp holder</div>
    `;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    this.twoApp.mount( '#twoQestApp' );
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
