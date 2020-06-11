const Dao = require('../data/dao/common');

const commonDao = new Dao();

const mailCounter = (data, res)=>{
    commonDao.campaignCounter(data.mailId, (result)=>{
        res.end('');
    });
}

const unsubscribe = (data,res)=>{
    commonDao.unsubscribeRecipient(data.mailId, data.userId, (result)=>{
        res.end(result);
    });
}

module.exports = {
    mailCounter, unsubscribe
}