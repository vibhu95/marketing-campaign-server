const path = require('path');
const csvtojson = require('csvtojson');
const Recipient = require("../data/models/Recipient");
const Dao = require('../data/dao/common');
const G = require('../globals');

const upload = (filePath, res)=>{
    console.log('filePath ::: '+filePath);
    console.log('full path ::: '+path.join(G.rootPath,filePath));
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
        emp.forEach(item=>{
            console.log(`item ::: ${item.Name}`);
        });
        const CommonDao = new Dao();
        CommonDao.addRecipients(emp,()=>{});
    });
    res.end("true");
}

module.exports = upload;