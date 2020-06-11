const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Routes = require('./routers/Routes');
const morgan = require('morgan');
const G = require('./globals');
const _init = require('./controllers/init');
const fs = require('fs');
const path = require('path');

if(cluster.isMaster){

    console.log(`Master ${process.pid} is running`);

    // To ignore the over usage of cpu
    for(let i=1;i<numCPUs;i++){
        cluster.fork();
    }

    // Handle all connection close jobs here
    cluster.on('exit', (worker, code, signal) => {

      if(G.mongoClient){
        G.mongoClient.close();
      }

      console.log(`worker ${worker.process.pid} died`);
    });
}else{

const app = express();

// filter out successfull responses for morgan
app.use(morgan('dev', { skip : (req, res) => res.statusCode < 400 }));
// log all requests to error.log
app.use(morgan('common', {    stream: fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' }) }))


const routers = new Routes(app);
routers.init_Routes();
_init();
G.rootPath = __dirname;
console.log('G.rootPath ::: '+G.rootPath);

app.listen(7000);

console.log('NODE_ENV ::: '+process.env.NODE_ENV);
console.log(`Worker ${process.pid} started`);
}