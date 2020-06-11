const Dao = require('../data/dao/common');

const addCampaign = (data,res)=>{

    const commonDao = new Dao();
    commonDao.addCampaings(data, result=>{
        console.log('Campaign Added Successfully ',result);
    });

    res.end('done');
}

module.exports = addCampaign;