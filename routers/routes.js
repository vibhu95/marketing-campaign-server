const multer = require("multer");
const upload = require("../controllers/uploadRecipients");
const addCampaign = require('../controllers/addCampaign');
const getRecipients = require('../controllers/getRecipients');
const getCampaigns = require('../controllers/getCampaigns');
const {mailCounter, unsubscribe} = require('../controllers/utils');
const bodyParser = require('body-parser');

class Routes{
    constructor(webserver){
        this.webserver = webserver;
    }

    init_Routes(){
        let app = this.webserver;

        const multerUpload = multer({dest : 'uploads/'});

        // parse various different custom JSON types as JSON
        app.use(bodyParser.json({ type: 'application/json' }))
        app.use(bodyParser.urlencoded({ extended: false }))

        app.post('/upload/csv', multerUpload.single('recipients'),(req,res,next)=>{

            if(!req.file || !req.file.mimetype || req.file.mimetype !== 'text/csv'){
                res.end("Invalid File");
            }else{
                upload(req.file.path, res);
            }
        });

        app.post('/add/campaign',(req,res,next)=>{
            if(req.body){
                addCampaign(req.body,res);
            }else{
                res.end('done');
            }
        });

        app.get('/all/recipients',(req,res,next)=>{
            getRecipients(res);
        });

        app.get('/all/campaigns',(req,res,next)=>{
            getCampaigns(res);
        });

        app.get('/auth/:mailId/counter',(req,res,next)=>{
            if(req.params && req.params.mailId){
                mailCounter(req.params, res);
            }else{
                res.end('');
            }
        });

        app.get('/auth/:mailId/:userId/unsubscribe',(req,res,next)=>{
            if(req.params && req.params.mailId && req.params.userId){
                unsubscribe(req.params, res);
            }else{
                res.end('Failed !!! Please Try again.');
            }
        });
    }
}

module.exports = Routes;