const express = require('express');
const multer = require("multer");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path')
const csvtojson = require('csvtojson');
const Recipient = require('./data/models/Recipient.js');
const sendGrid = require("@sendgrid/mail");
const nodeCron = require("node-cron");
const Q = require("q");
const MongoClient = require('mongodb').MongoClient;
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const upload = multer({dest : 'uploads/'});

const app = express();

if(cluster.isMaster){

    console.log(`Master ${process.pid} is running`);

    // To ignore the over usage of cpu
    for(let i=1;i<numCPUs;i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
}else{

// filter out successfull responses for morgan
app.use(morgan('dev', {
    skip : (req, res) => res.statusCode < 400
}));
// log all requests to error.log
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' })
  }))

app.post("/upload", upload.single('recipients'), (req, res, next) => {
    if(!req.file || !req.file.mimetype || req.file.mimetype !== 'text/csv'){
        res.end("Invalid File");
    }else{
        let emp = [];
        csvtojson()
        .fromFile(path.join(__dirname,req.file.path))
        .then(json=>{
            json.forEach((row)=>{
                let e = new Recipient();
                Object.assign(e, row);
                emp.push(e);
            })
        }).then(()=>{
            emp.forEach(item=>{
                console.log(`item ::: ${item.Name}`);
            });
        });
        res.end("true");
    }
});

app.get("/test", (req,res,next) => {
    const msg = {
        to: 'vibhutinarayan995@gmail.com',
        from: 'vibhuti@antrepriz.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      (async () => {
        try {
          await sendGrid.send(msg);
        } catch (error) {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
        }
      })();
    res.end("Success");
});

const mongoUrl = 'mongodb://localhost:27017';
const database = 'gerald_assignment';

app.get('/connect',(req,res,next)=>{
    MongoClient.connect(mongoUrl, {useUnifiedTopology:true}, (err,client)=>{
        if(err){
            console.error("Failed");
            console.error(err);
        }else{
            console.log('Successfully Connected');
            const db = client.db(database);
          
            client.close();
        }
    });
    res.end('connected');
})

console.log(nodeCron.validate('* * * * Tue,Wed'));

// nodeCron.schedule('*/5 * * * * *', () => {
//     Q(undefined)
//     .then(()=>{
//         console.log('Then 1');
//         return Q.resolve('Error');
//     })
//     .finally(()=>{
//         console.log('Finally');
//     })
//     .fail(()=>{
//         console.log('Fail');
//     })
//     .done();
//     console.log(new Date());
//   });

console.log("__dirname ::: ",__dirname);
console.log("process PORT ::: ",process.env.PORT);
console.log("process API key ::: ",process.env.SENDGRID_API_KEY);
console.log("process NODE env ::: ",process.env.NODE_ENV);


app.listen(7000);


console.log(`Worker ${process.pid} started`);

}