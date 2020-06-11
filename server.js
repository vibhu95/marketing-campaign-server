const express = require('express');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// const morgan = require('morgan');
const G = require('./globals');
const _init = require('./controllers/init');
// const fs = require('fs');
const path = require('path');

const app = express();

// filter out successfull responses for morgan
// app.use(morgan('dev', { skip : (req, res) => res.statusCode < 400 }));
// log all requests to error.log
// app.use(morgan('common', { stream: fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' }) }))

app.use(_setCors);

G.rootPath = __dirname;
_init(app);

app.listen(process.env.PORT || 7800, function() {
  console.log("Server up and listening");
});

function _setCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", ['*'].join());
  res.header("Access-Control-Allow-Methods", ['GET','PUT','POST','OPTIONS'].join());
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
}