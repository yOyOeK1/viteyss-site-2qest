
import Netcat from 'node-netcat';

class tcpListener{

    constructor( ip = 'localhost', port='10900',
        onMessage = undefined
     ){
        this.opts = { ip, port, onMessage };
        this.clients = [];
        this.cCounter = 11;

        this.netC = undefined;
        this.aState = ['init'];

        console.log(`tcpListen at opts: \n\t`,this.opts);
    }
    l( msg ){ console.log('ncL ('+this.aState[ this.aState.length-1 ]+') ',msg); }

    start(){
        let netC = Netcat.client( this.opts.port, this.opts.ip  );
        let opts = this.opts;
       this.aState = [ 'starting'];


        netC.on('open', ()=>{
            this.l(['on open .... nice ']);
            this.aState.push('online');
        });
        netC.on('close', ()=>{
            this.l(['on close ']);
            this.aState.push('offline');
        });

        netC.on('data', (data)=>{   
            this.l(['on data ', data.toString('ascii')]);

        });
        netC.on('error',e=> {
            if( e.code == 'ECONNREFUSED' ){
                this.l(' * its OK Host is down or finished ?');
            } else
                this.l('ee ',e) ;

            this.aState.push('error');
        });
        
        
        this.netC = netC;

        this.netC.start();
        this.l(`tcpListen - listen ....`);
        
    }

}


if(1){
    let se = new tcpListener(
        process.argv[2],process.argv[3],
        m => console.log(`tcpL got:[${m}]`)
    );
    se.start();

}



export{ tcpListener }