const path = require('path');
const csvtojson = require('csvtojson');
const Recipient = require("../data/models/Recipient");
const Dao = require('../data/dao/common');
const G = require('../globals');
const fs = require('fs');

const upload = (filePath, res)=>{
    let emp = [];
    csvtojson()
    .fromFile(path.join(G.rootPath,filePath))
    .then(json=>{
        json.forEach((row)=>{
            let e = new Recipient();
            Object.assign(e, row);
            e.Status = 'subscribed';
            emp.push(e);
        })
    }).then(()=>{
        console.table(emp.map(i=>i.Name));
        
        // Persisting the records
        const CommonDao = new Dao();
        CommonDao.addRecipients(emp,()=>{});
    }).then(()=>{
        fs.unlink(path.join(G.rootPath,filePath),err=>{
            if(err && err.code == 'ENOENT') {
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`removed`);
            }
        });
    });
    res.end("true");
}

module.exports = upload;