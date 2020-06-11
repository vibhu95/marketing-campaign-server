const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Routes = require('./routers/Routes');
const morgan = require('morgan');
const G = require('./globals');
const _init = require('./controllers/init');
const fs = require('fs');
const path = require('path');

const app = express();

// filter out successfull responses for morgan
app.use(morgan('dev', { skip : (req, res) => res.statusCode < 400 }));
// log all requests to error.log
app.use(morgan('common', {    stream: fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' }) }))

app.use(_setCors);

const routers = new Routes(app);
routers.init_Routes();
_init();
G.rootPath = __dirname;

app.listen(process.env.PORT || 7700, function() {
  console.log("Server up and listening");
});

console.log(`Worker ${process.pid} started`);

function _setCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", ['*'].join());
  res.header("Access-Control-Allow-Methods", ['GET','PUT','POST','OPTIONS'].join());
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
}