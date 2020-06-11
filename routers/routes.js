const multer = require("multer");
const upload = require("../controllers/uploadRecipients");

class Routes{
    constructor(webserver){
        this.webserver = webserver;
    }

    init_Routes(){
        let app = this.webserver;

        const multerUpload = multer({dest : 'uploads/'});

        app.post('/upload/csv', multerUpload.single('recipients'),(req,res,next)=>{

            if(!req.file || !req.file.mimetype || req.file.mimetype !== 'text/csv'){
                res.end("Invalid File");
            }else{
                console.log('path ::: '+req.file.path);
                upload(req.file.path, res);
            }
        });

        app.post('/add/mailer',(req,res,next)=>{
            
            res.end('done');
        });

        app.get('/users',(req,res,next)=>{
            
            res.end('done');
        });

        app.post('/all/mails',(req,res,next)=>{
            
            res.end('done');
        });
    }
}

module.exports = Routes;